const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({

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

    question:{

        type:String,

        required:true,

        trim:true

    },

    options:[

        {

            type:String,

            required:true

        }

    ],

    correctAnswer:{

        type:Number,

        required:true,

        min:0,

        max:3

    },

    explanation:{

        type:String,

        default:""

    },

    difficulty:{

        type:String,

        enum:["Easy","Medium","Hard"],

        default:"Medium"

    },

    createdBy:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    },

    createdAt:{

        type:Date,

        default:Date.now

    }

});

module.exports = mongoose.model("Question", questionSchema);