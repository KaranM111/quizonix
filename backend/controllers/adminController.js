const Unit = require("../models/Unit");
const Subject = require("../models/Subject");
const Question = require("../models/Question");

exports.createUnit = async (req, res) => {

    try {

        const { unitName, unitNumber, description } = req.body;

        const unit = await Unit.create({

            unitName,

            unitNumber,

            description,

            createdBy: req.user.id

        });

        res.status(201).json({

            success: true,

            message: "Unit Created Successfully",

            unit

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getUnits = async (req, res) => {

    try {

        const units = await Unit.find().sort({

            unitNumber: 1

        });

        res.json({

            success: true,

            units

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.updateUnit = async (req, res) => {

    try {

        const unit = await Unit.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true

            }

        );

        res.json({

            success: true,

            message: "Unit Updated",

            unit

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.deleteUnit = async (req, res) => {

    try {

        await Unit.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "Unit Deleted"

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.createSubject = async (req, res) => {

    try {

        const subject = await Subject.create({

            ...req.body,

            createdBy: req.user.id

        });

        res.status(201).json({

            success: true,

            message: "Subject Created",

            subject

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getSubjects = async (req, res) => {

    try {

        const subjects = await Subject.find()
            .populate("unit")
            .sort({ createdAt: -1 });

        res.json({

            success: true,

            subjects

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.updateSubject = async (req, res) => {

    try {

        const subject = await Subject.findByIdAndUpdate(

            req.params.id,

            req.body,

            { new: true }

        );

        res.json({

            success: true,

            message: "Subject Updated",

            subject

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.deleteSubject = async (req, res) => {

    try {

        await Subject.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "Subject Deleted"

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.uploadPPT = async (req, res) => {

    try {

        res.json({

            success: true,

            message: "PPT Uploaded Successfully"

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.generateMCQs = async (req, res) => {

    try {

        res.json({

            success: true,

            message: "AI MCQ Generation will be connected here."

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getQuestions = async (req, res) => {

    try {

        const questions = await Question.find({

            subject: req.params.subjectId

        });

        res.json({

            success: true,

            questions

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.deleteQuestion = async (req, res) => {

    try {

        await Question.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "Question Deleted"

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};