const mongoose = require("mongoose");

const votingSchema = new mongoose.Schema({
  votingSkills: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      votes: { type: Number, default: 0 }
    }
  ]
}, { timestamps: true });

// ✅ Force collection name to "votings"
module.exports = mongoose.model("Voting", votingSchema, "votings");
