const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({

    student:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    },

    unit:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Unit",

        required:true

    },

    subject:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Subject",

        required:true

    },

    questions:[

        {

            question:{

                type:mongoose.Schema.Types.ObjectId,

                ref:"Question"

            },

            selectedAnswer:{

                type:Number,

                default:-1

            },

            correctAnswer:{

                type:Number,

                required:true

            },

            isCorrect:{

                type:Boolean,

                default:false

            }

        }

    ],

    totalQuestions:{

        type:Number,

        required:true

    },

    correctAnswers:{

        type:Number,

        default:0

    },

    wrongAnswers:{

        type:Number,

        default:0

    },

    score:{

        type:Number,

        default:0

    },

    accuracy:{

        type:Number,

        default:0

    },

    durationInSeconds:{

        type:Number,

        default:2700

    },

    completed:{

        type:Boolean,

        default:false

    },

    submittedAt:{

        type:Date

    },

    createdAt:{

        type:Date,

        default:Date.now

    }

});

module.exports = mongoose.model("Test", testSchema);