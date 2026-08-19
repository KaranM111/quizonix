const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({

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

    test:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Test",

        required:true

    },

    mcqCategory:{

        type:Number,

        enum:[30,40,50],

        required:true

    },

    score:{

        type:Number,

        required:true

    },

    totalQuestions:{

        type:Number,

        required:true

    },

    accuracy:{

        type:Number,

        required:true

    },

    timeTakenInSeconds:{

        type:Number,

        required:true

    },

    rank:{

        type:Number,

        default:0

    },

    completed:{

        type:Boolean,

        default:true

    },

    createdAt:{

        type:Date,

        default:Date.now

    }

});

leaderboardSchema.index({
    subject:1,
    mcqCategory:1,
    score:-1,
    timeTakenInSeconds:1
});

module.exports = mongoose.model("Leaderboard", leaderboardSchema);