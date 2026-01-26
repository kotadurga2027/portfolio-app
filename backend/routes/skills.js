const express = require("express");
const Skill = require("../models/skills");   // import mongoose model
const router = express.Router();

/* =========================
   GET /api/skills → return all skills
========================= */
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ name: 1 }); // sorted alphabetically
    res.json(skills);
  } catch (err) {
    console.error("Error fetching skills:", err);
    res.status(500).json({ error: "Failed to load skills" });
  }
});

/* =========================
   POST /api/skills → add a new skill
========================= */
router.post("/", async (req, res) => {
  const { name, level, category } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Skill name is required" });
  }

  try {
    const skill = new Skill({ name, level, category });
    await skill.save();
    res.json({ success: true, skill });
  } catch (err) {
    console.error("Error saving skill:", err);
    res.status(500).json({ error: "Failed to save skill" });
  }
});

module.exports = router;
