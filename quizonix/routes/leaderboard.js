const express = require("express");
const { getDb } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /api/leaderboard/quizzes -> list of quizzes for the filter dropdown
router.get("/quizzes", requireAuth, (req, res) => {
  const db = getDb();
  const quizzes = db
    .prepare("SELECT id, title, unit FROM quizzes WHERE published = 1 ORDER BY unit, title")
    .all();
  res.json({ quizzes });
});

// GET /api/leaderboard?quizId=5   -> ranking for one quiz
// GET /api/leaderboard?unit=Unit1 -> combined ranking (sum of scores) for a whole unit
// GET /api/leaderboard             -> overall ranking (sum of scores across everything)
router.get("/", requireAuth, (req, res) => {
  const db = getDb();
  const { quizId, unit } = req.query;

  let rows;
  if (quizId) {
    rows = db
      .prepare(
        `SELECT u.name, u.email, a.score, a.total_questions, a.time_taken_seconds, a.submitted_at
         FROM attempts a JOIN users u ON u.id = a.user_id
         WHERE a.quiz_id = ?
         ORDER BY a.score DESC, a.time_taken_seconds ASC`
      )
      .all(quizId);
  } else if (unit) {
    rows = db
      .prepare(
        `SELECT u.name, u.email, SUM(a.score) as score, SUM(a.total_questions) as total_questions,
                SUM(a.time_taken_seconds) as time_taken_seconds, COUNT(*) as quizzes_taken
         FROM attempts a
         JOIN users u ON u.id = a.user_id
         JOIN quizzes q ON q.id = a.quiz_id
         WHERE q.unit = ?
         GROUP BY u.id
         ORDER BY score DESC, time_taken_seconds ASC`
      )
      .all(unit);
  } else {
    rows = db
      .prepare(
        `SELECT u.name, u.email, SUM(a.score) as score, SUM(a.total_questions) as total_questions,
                SUM(a.time_taken_seconds) as time_taken_seconds, COUNT(*) as quizzes_taken
         FROM attempts a
         JOIN users u ON u.id = a.user_id
         GROUP BY u.id
         ORDER BY score DESC, time_taken_seconds ASC`
      )
      .all();
  }

  res.json({ leaderboard: rows });
});

module.exports = router;
