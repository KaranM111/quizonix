const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema({

    unitName:{

        type:String,

        required:true,

        trim:true

    },

    unitNumber:{

        type:Number,

        required:true

    },

    description:{

        type:String,

        default:""

    },

    createdBy:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    },

    isActive:{

        type:Boolean,

        default:true

    },

    createdAt:{

        type:Date,

        default:Date.now

    }

});

module.exports = mongoose.model("Unit", unitSchema);