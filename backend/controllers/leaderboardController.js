const Leaderboard = require("../models/Leaderboard");

exports.getLeaderboard = async (req, res) => {

    try {

        const leaderboard = await Leaderboard.find()
            .populate("student", "fullName")
            .populate("subject", "subjectName")
            .sort({
                score: -1,
                accuracy: -1,
                timeTakenInSeconds: 1
            });

        res.json({
            success: true,
            leaderboard
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.getSubjectLeaderboard = async (req, res) => {

    try {

        const { subjectId, mcqCategory } = req.params;

        const leaderboard = await Leaderboard.find({

            subject: subjectId,

            mcqCategory: Number(mcqCategory),

            completed: true

        })
        .populate("student", "fullName")
        .sort({
            score: -1,
            accuracy: -1,
            timeTakenInSeconds: 1
        });

        res.json({
            success: true,
            leaderboard
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.getStudentRank = async (req, res) => {

    try {

        const records = await Leaderboard.find({
            student: req.params.studentId
        })
        .populate("subject", "subjectName")
        .sort({
            createdAt: -1
        });

        res.json({
            success: true,
            records
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};