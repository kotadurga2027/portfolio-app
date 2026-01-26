const express = require("express");
const Voting = require("../models/voting");
const router = express.Router();

/* =========================
   GET all voting skills with percentages
========================= */
router.get("/", async (req, res) => {
  try {
    const votingDoc = await Voting.findOne(); // single document
    if (!votingDoc || !votingDoc.votingSkills) {
      return res.status(404).json({ error: "No voting data found" });
    }

    const totalVotes = votingDoc.votingSkills.reduce((sum, s) => sum + (s.votes || 0), 0);

    const skillsWithPercent = votingDoc.votingSkills.map(skill => ({
      id: skill.id,
      name: skill.name,
      votes: skill.votes,
      percent: totalVotes > 0 ? Math.round((skill.votes / totalVotes) * 100) : 0
    }));

    res.json(skillsWithPercent);
  } catch (err) {
    console.error("Error fetching voting skills:", err);
    res.status(500).json({ error: "Failed to load voting skills" });
  }
});

/* =========================
   POST vote for a skill by id
========================= */
router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const votingDoc = await Voting.findOne();

    if (!votingDoc) {
      return res.status(404).json({ success: false, error: "Voting document not found" });
    }

    const skill = votingDoc.votingSkills.find(s => s.id === id);
    if (!skill) {
      return res.status(404).json({ success: false, error: "Skill not found" });
    }

    skill.votes += 1;
    await votingDoc.save();

    res.json({ success: true, id: skill.id, votes: skill.votes });
  } catch (err) {
    console.error("Error voting for skill:", err);
    res.status(500).json({ success: false, error: "Failed to vote for skill" });
  }
});

module.exports = router;
