const express = require("express");

const router = express.Router();

const adminController = require("../controllers/adminController");

const {
    verifyToken,
    verifyAdmin
} = require("../middleware/auth");

router.use(verifyToken);

router.use(verifyAdmin);

/* ---------- UNIT ---------- */

router.post("/unit", adminController.createUnit);

router.get("/units", adminController.getUnits);

router.put("/unit/:id", adminController.updateUnit);

router.delete("/unit/:id", adminController.deleteUnit);

/* ---------- SUBJECT ---------- */

router.post("/subject", adminController.createSubject);

router.get("/subjects", adminController.getSubjects);

router.put("/subject/:id", adminController.updateSubject);

router.delete("/subject/:id", adminController.deleteSubject);

/* ---------- PPT ---------- */

router.post("/upload-ppt", adminController.uploadPPT);

/* ---------- AI ---------- */

router.post("/generate-mcq", adminController.generateMCQs);

/* ---------- QUESTIONS ---------- */

router.get("/questions/:subjectId", adminController.getQuestions);

router.delete("/question/:id", adminController.deleteQuestion);

module.exports = router;