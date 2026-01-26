const express = require("express");
const Voting = require("../models/voting");   // import mongoose model
const router = express.Router();

/* =========================
   GET all voting skills with percentages
========================= */
router.get("/", async (req, res) => {
  try {
    const votingSkills = await Voting.find();
    const totalVotes = votingSkills.reduce((sum, s) => sum + (s.votes || 0), 0);

    const skillsWithPercent = votingSkills.map(s => ({
      _id: s._id,
      option: s.option,
      votes: s.votes,
      percent: totalVotes > 0 ? Math.round((s.votes / totalVotes) * 100) : 0
    }));

    res.json(skillsWithPercent);
  } catch (err) {
    console.error("Error fetching voting skills:", err);
    res.status(500).json({ error: "Failed to load voting skills" });
  }
});

/* =========================
   POST vote for a skill
========================= */
router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Voting.findById(id);

    if (!skill) {
      return res.status(404).json({ success: false, error: "Skill not found" });
    }

    skill.votes = (skill.votes || 0) + 1;
    await skill.save();

    res.json({ success: true, votes: skill.votes });
  } catch (err) {
    console.error("Error voting for skill:", err);
    res.status(500).json({ success: false, error: "Failed to vote for skill" });
  }
});

module.exports = router;
