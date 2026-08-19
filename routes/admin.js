const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const officeParser = require("officeparser");
const { getDb } = require("../db");
const { requireAdmin } = require("../middleware/auth");
const { generateMCQs } = require("../utils/ai");

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, safe);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 40 * 1024 * 1024 }, // 40MB
  fileFilter: (req, file, cb) => {
    const ok = /\.pptx?$/i.test(file.originalname);
    cb(ok ? null : new Error("Only .ppt or .pptx files are allowed."), ok);
  },
});

// POST /api/admin/quizzes  (upload PPT + generate MCQs with AI)
router.post("/quizzes", requireAdmin, upload.single("ppt"), async (req, res) => {
  const db = getDb();
  try {
    const { title, unit, prompt, numQuestions, durationMinutes } = req.body;
    if (!req.file) return res.status(400).json({ error: "Please upload a .ppt/.pptx file." });
    if (!title) return res.status(400).json({ error: "Quiz title is required." });

    const count = Math.min(Math.max(parseInt(numQuestions) || 30, 1), 50);
    const duration = Math.min(Math.max(parseInt(durationMinutes) || 45, 5), 240);

    // 1. Extract text from the PPT (100% free, runs locally, no API call)
    const pptText = await officeParser.parseOfficeAsync(req.file.path);
    if (!pptText || pptText.trim().length < 50) {
      return res.status(400).json({ error: "Could not find enough readable text in that PPT." });
    }

    // 2. Ask the free AI model to turn that text into MCQs
    const questions = await generateMCQs({
      pptText,
      numQuestions: count,
      extraPrompt: prompt || "",
    });

    if (!questions.length) {
      return res.status(500).json({ error: "AI did not return any questions. Try again." });
    }

    // 3. Save quiz + questions to the database
    const insertQuiz = db.prepare(`
      INSERT INTO quizzes (title, unit, ppt_filename, duration_minutes, total_questions, published, created_by)
      VALUES (?, ?, ?, ?, ?, 1, ?)
    `);
    const quizInfo = insertQuiz.run(
      title.trim(),
      (unit || "").trim(),
      req.file.filename,
      duration,
      questions.length,
      req.user.id
    );
    const quizId = quizInfo.lastInsertRowid;

    const insertQ = db.prepare(`
      INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const insertMany = db.transaction((qs) => {
      for (const q of qs) {
        insertQ.run(
          quizId,
          q.question,
          q.options.A,
          q.options.B,
          q.options.C,
          q.options.D,
          q.correct
        );
      }
    });
    insertMany(questions);

    res.json({ ok: true, quizId, questionsGenerated: questions.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Something went wrong generating the quiz." });
  }
});

// GET /api/admin/quizzes  (list quizzes created by admins, with stats)
router.get("/quizzes", requireAdmin, (req, res) => {
  const db = getDb();
  const quizzes = db
    .prepare(
      `SELECT q.*, 
              (SELECT COUNT(*) FROM attempts a WHERE a.quiz_id = q.id) as attempts_count
       FROM quizzes q ORDER BY q.created_at DESC`
    )
    .all();
  res.json({ quizzes });
});

// DELETE /api/admin/quizzes/:id
router.delete("/quizzes/:id", requireAdmin, (req, res) => {
  const db = getDb();
  const id = req.params.id;
  db.prepare("DELETE FROM questions WHERE quiz_id = ?").run(id);
  db.prepare("DELETE FROM attempts WHERE quiz_id = ?").run(id);
  db.prepare("DELETE FROM quizzes WHERE id = ?").run(id);
  res.json({ ok: true });
});

module.exports = router;
