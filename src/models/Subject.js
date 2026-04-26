const mongose = require("mongoose");
const subjectSchema = new mongose.Schema({
    name:{
        type:String,
        required:true,
    },
    code:{
        type:String,
        required:true
    },
    branch:{
        type:String,
        required:true,
        enum:["CSE",'IT','CSE-AIML'],

    },
    semester:{
        type:Number,
        required:true,
        enum:[1,2,3,4,5,6,7,8],

    },
    teacher:{
        type:mongose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
});
const Subject = mongose.model("Subject", subjectSchema);
module.exports = Subject;
