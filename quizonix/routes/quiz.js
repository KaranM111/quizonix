const express = require("express");
const { getDb } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /api/quiz  -> list published quizzes, grouped by unit, with whether current user attempted
router.get("/", requireAuth, (req, res) => {
  const db = getDb();
  const quizzes = db
    .prepare(
      `SELECT q.id, q.title, q.unit, q.duration_minutes, q.total_questions, q.created_at,
              a.score as my_score, a.total_questions as my_total
       FROM quizzes q
       LEFT JOIN attempts a ON a.quiz_id = q.id AND a.user_id = ?
       WHERE q.published = 1
       ORDER BY q.unit, q.created_at DESC`
    )
    .all(req.user.id);
  res.json({ quizzes });
});

// GET /api/quiz/:id -> get quiz questions WITHOUT correct answers, to take the test
router.get("/:id", requireAuth, (req, res) => {
  const db = getDb();
  const quiz = db.prepare("SELECT * FROM quizzes WHERE id = ? AND published = 1").get(req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found." });

  const already = db
    .prepare("SELECT * FROM attempts WHERE user_id = ? AND quiz_id = ?")
    .get(req.user.id, quiz.id);
  if (already) {
    return res.status(409).json({ error: "You have already taken this quiz.", attempt: already });
  }

  const questions = db
    .prepare("SELECT id, question_text, option_a, option_b, option_c, option_d FROM questions WHERE quiz_id = ?")
    .all(quiz.id);

  res.json({ quiz, questions });
});

// POST /api/quiz/:id/submit  body: { answers: { [questionId]: "A" }, timeTakenSeconds }
router.post("/:id/submit", requireAuth, (req, res) => {
  const db = getDb();
  const quizId = req.params.id;
  const quiz = db.prepare("SELECT * FROM quizzes WHERE id = ?").get(quizId);
  if (!quiz) return res.status(404).json({ error: "Quiz not found." });

  const already = db
    .prepare("SELECT * FROM attempts WHERE user_id = ? AND quiz_id = ?")
    .get(req.user.id, quizId);
  if (already) {
    return res.status(409).json({ error: "You have already submitted this quiz." });
  }

  const { answers = {}, timeTakenSeconds = 0 } = req.body;
  const questions = db.prepare("SELECT id, correct_option FROM questions WHERE quiz_id = ?").all(quizId);

  let score = 0;
  for (const q of questions) {
    const given = answers[q.id];
    if (given && given === q.correct_option) score++;
  }

  db.prepare(
    `INSERT INTO attempts (user_id, quiz_id, score, total_questions, time_taken_seconds)
     VALUES (?, ?, ?, ?, ?)`
  ).run(req.user.id, quizId, score, questions.length, timeTakenSeconds);

  res.json({ score, total: questions.length });
});

module.exports = router;
