const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Intermediate" },
  category: String,   // e.g. "Frontend", "Backend", "DevOps"
});

module.exports = mongoose.model("Skill", skillSchema);
