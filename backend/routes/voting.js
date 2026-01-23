const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const filePath = path.join(__dirname, "../data/voting.json");

// Helper functions
function readVoting() {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
function writeVoting(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET all voting skills with percentages
router.get("/", (req, res) => {
  const data = readVoting();
  const totalVotes = data.votingSkills.reduce((sum, s) => sum + s.votes, 0);

  const skillsWithPercent = data.votingSkills.map(s => ({
    ...s,
    percent: totalVotes > 0 ? Math.round((s.votes / totalVotes) * 100) : 0
  }));

  res.json(skillsWithPercent);
});

// POST vote for a skill
router.post("/:id", (req, res) => {
  const { id } = req.params;
  const data = readVoting();
  const skill = data.votingSkills.find(s => s.id === id);

  if (!skill) {
    return res.status(404).json({ success: false, error: "Skill not found" });
  }

  skill.votes += 1;
  writeVoting(data);

  res.json({ success: true, votes: skill.votes });
});

module.exports = router;
