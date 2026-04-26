const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({

  facultyName: {
    type: String,
    required: true
  },

  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },

  branch: {
    type: String,
    enum: ["CSE", "IT", "CSE-AIML"],
    required: true
  },

  feedbackPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }

}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);