const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({

    unit:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Unit",

        required:true

    },

    subjectName:{

        type:String,

        required:true,

        trim:true

    },

    subjectCode:{

        type:String,

        default:""

    },

    pptFile:{

        type:String,

        default:""

    },

    aiPrompt:{

        type:String,

        default:""

    },

    totalQuestions:{

        type:Number,

        default:0

    },

    isPublished:{

        type:Boolean,

        default:false

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

module.exports = mongoose.model("Subject", subjectSchema);