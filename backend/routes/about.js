const express = require("express");
const Voting = require("../models/voting"); // uses "votings" collection
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

    const skillsWithPercent = votingDoc.votingSkills.map((s, i) => ({
      _id: i, // use index as ID for frontend
      name: s.name,
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
   POST vote for a skill by index
========================= */
router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const index = parseInt(id);

    const votingDoc = await Voting.findOne();
    if (!votingDoc || !votingDoc.votingSkills || !votingDoc.votingSkills[index]) {
      return res.status(404).json({ success: false, error: "Skill not found" });
    }

    votingDoc.votingSkills[index].votes += 1;
    await votingDoc.save();

    res.json({ success: true, votes: votingDoc.votingSkills[index].votes });
  } catch (err) {
    console.error("Error voting for skill:", err);
    res.status(500).json({ success: false, error: "Failed to vote for skill" });
  }
});

module.exports = router;
