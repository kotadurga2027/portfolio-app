const mongoose = require("mongoose");

const votingSchema = new mongoose.Schema({
  option: { type: String, required: true },   // e.g. "React", "Node.js"
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Voting", votingSchema);
