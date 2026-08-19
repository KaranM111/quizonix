const Test = require("../models/Test");
const Question = require("../models/Question");
const Leaderboard = require("../models/Leaderboard");

exports.startTest = async (req, res) => {

    try {

        const {

            unitId,
            subjectId,
            totalQuestions

        } = req.body;

        const test = await Test.create({

            student: req.user.id,

            unit: unitId,

            subject: subjectId,

            totalQuestions,

            questions: []

        });

        res.status(201).json({

            success: true,

            message: "Test Started",

            testId: test._id

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

        const subjectId = req.params.subjectId;

        const count = Number(req.params.count);

        const questions = await Question.aggregate([

            {

                $match: {

                    subject: require("mongoose").Types.ObjectId.createFromHexString(subjectId)

                }

            },

            {

                $sample: {

                    size: count

                }

            }

        ]);

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

exports.submitTest = async (req, res) => {

    try {

        const {

            testId,
            answers,
            timeTakenInSeconds

        } = req.body;

                const test = await Test.findById(testId);

        if (!test) {

            return res.status(404).json({

                success: false,

                message: "Test Not Found"

            });

        }

        let correct = 0;

        let finalAnswers = [];

        for (const answer of answers) {

            const question = await Question.findById(answer.questionId);

            if (!question) continue;

            const isCorrect = question.correctAnswer === answer.selectedAnswer;

            if (isCorrect) correct++;

            finalAnswers.push({

                question: question._id,

                selectedAnswer: answer.selectedAnswer,

                correctAnswer: question.correctAnswer,

                isCorrect

            });

        }

        const total = finalAnswers.length;

        const wrong = total - correct;

        const accuracy = total === 0
            ? 0
            : Number(((correct / total) * 100).toFixed(2));

        test.questions = finalAnswers;
        test.correctAnswers = correct;
        test.wrongAnswers = wrong;
        test.score = correct;
        test.accuracy = accuracy;
        test.durationInSeconds = timeTakenInSeconds;
        test.completed = true;
        test.submittedAt = new Date();

        await test.save();

        await Leaderboard.create({

            student: test.student,

            unit: test.unit,

            subject: test.subject,

            test: test._id,

            mcqCategory: test.totalQuestions,

            score: correct,

            totalQuestions: total,

            accuracy,

            timeTakenInSeconds,

            completed: true

        });

        res.json({

            success: true,

            message: "Test Submitted Successfully",

            score: correct,

            totalQuestions: total,

            wrongAnswers: wrong,

            accuracy

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getResult = async (req, res) => {

    try {

        const result = await Test.findById(req.params.testId)
            .populate("subject")
            .populate("unit");

        res.json({

            success: true,

            result

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getHistory = async (req, res) => {

    try {

        const history = await Test.find({

            student: req.params.studentId,

            completed: true

        })
        .populate("subject")
        .sort({

            createdAt: -1

        });

        res.json({

            success: true,

            history

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};