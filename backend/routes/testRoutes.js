const express = require("express");

const router = express.Router();

const testController = require("../controllers/testController");

const {
    verifyToken
} = require("../middleware/auth");

/* ---------- TEST ---------- */

router.post("/start", verifyToken, testController.startTest);

router.get("/questions/:subjectId/:count", verifyToken, testController.getQuestions);

router.post("/submit", verifyToken, testController.submitTest);

router.get("/result/:testId", verifyToken, testController.getResult);

router.get("/history/:studentId", verifyToken, testController.getHistory);

module.exports = router;