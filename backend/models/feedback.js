const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  feedback: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },   // optional rating system
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", feedbackSchema);
