const mongoose = require("mongoose");

const ProjectDetailSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  tagline: String,
  problem: String,
  solution: String,
  impact: String,
  tools: [String],
  diagram: String,
  repo: String,
  demo: String,
  date: String,
  category: String,
  scale: String,
  challenges: String,
  learning: String,
  status: String,
  metrics: {
    type: Map,
    of: String
  },
  screenshots: [String],
  tags: [String]
});

module.exports = mongoose.model("ProjectDetail", ProjectDetailSchema);
