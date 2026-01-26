const mongoose = require("mongoose");

const votingSchema = new mongoose.Schema({
  votingSkills: [
    {
      name: { type: String, required: true },
      votes: { type: Number, default: 0 },
      percent: { type: Number, default: 0 }
    }
  ]
}, { timestamps: true });

// ✅ Force Mongoose to use "votings" collection
module.exports = mongoose.model("Voting", votingSchema, "votings");
