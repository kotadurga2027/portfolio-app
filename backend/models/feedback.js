const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  rating: {
    type: String,
    enum: ["Needs Work", "Okay", "Good", "Great", "Amazing"], // match frontend labels
    required: true
  },
  feedback: { type: String, default: "" }, // optional comment
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", feedbackSchema);
