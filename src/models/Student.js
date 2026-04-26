const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },

  branch: {
    type: String,
    enum: ["IT", "CSE", "CSE-AIML"],
    required: true
  },

  semester: {
    type: Number,
    required: true,
    enum: [1,2,3,4,5,6,7,8] // 🔥 small improvement
  },

  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject"
    }
  ]

}, { timestamps: true }); // 🔥 good practice

module.exports = mongoose.model("Student", studentSchema);