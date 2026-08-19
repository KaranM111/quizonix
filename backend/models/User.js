const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    fullName:{

        type:String,

        required:true,

        trim:true

    },

    email:{

        type:String,

        required:true,

        unique:true,

        lowercase:true,

        trim:true

    },

    password:{

        type:String,

        required:true

    },

    role:{

        type:String,

        enum:["admin","student"],

        default:"student"

    },

    college:{

        type:String,

        default:""

    },

    branch:{

        type:String,

        default:"BCA"

    },

    semester:{

        type:Number,

        default:3

    },

    profileImage:{

        type:String,

        default:""

    },

    testsAttempted:{

        type:Number,

        default:0

    },

    testsCompleted:{

        type:Number,

        default:0

    },

    totalMarks:{

        type:Number,

        default:0

    },

    averageAccuracy:{

        type:Number,

        default:0

    },

    totalPoints:{

        type:Number,

        default:0

    },

    highestScore:{

        type:Number,

        default:0

    },

    rank:{

        type:Number,

        default:0

    },

    createdAt:{

        type:Date,

        default:Date.now

    }

});

module.exports = mongoose.model("User", userSchema);