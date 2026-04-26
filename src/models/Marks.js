const mongoose= require("mongoose");
const marksSchema =new mongoose .Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:true,
    },

    studentname:{
        type:String,
        required:true,
    },
    registrationNumber:{
        type:String,
        required:true,
    },
    subject:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject",
        required:true,
    },
    marks:{
         type: Number,
    required: true
    },
    grade:{
        type:String,
        enum:["O","E","A","B","C","D","F"],
         required:true,
    }
}, { timestamps: true });
module.exports =mongoose.model("Marks",marksSchema);