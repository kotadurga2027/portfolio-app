const mongoose = require("mongoose");

const statSchema = new mongoose.Schema({
  page: { type: String, required: true },   // e.g. "projects", "skills"
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Stat", statSchema);
