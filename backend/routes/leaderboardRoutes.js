const express = require("express");

const router = express.Router();

const leaderboardController = require("../controllers/leaderboardController");

const {
    verifyToken
} = require("../middleware/auth");

/* ---------- LEADERBOARD ---------- */

router.get("/", verifyToken, leaderboardController.getLeaderboard);

router.get("/subject/:subjectId/:mcqCategory", verifyToken, leaderboardController.getSubjectLeaderboard);

router.get("/student/:studentId", verifyToken, leaderboardController.getStudentRank);

module.exports = router;