const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  techStack: [String],   // e.g. ["React", "Node.js", "MongoDB"]
  featured: { type: Boolean, default: false },
  githubLink: String,
  liveDemo: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", projectSchema);
