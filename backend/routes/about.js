const express = require("express");
const About = require("../models/about");   // import mongoose model
const router = express.Router();

/* =========================
   GET ABOUT DATA
========================= */
router.get("/", async (req, res) => {
  try {
    const aboutData = await About.findOne();   // fetch first document
    if (!aboutData) {
      return res.status(404).json({ error: "No about data found" });
    }
    res.json(aboutData);
  } catch (err) {
    console.error("Error fetching about data:", err);
    res.status(500).json({ error: "Failed to load about data" });
  }
});

/* =========================
   UPDATE ABOUT DATA
========================= */
router.put("/", async (req, res) => {
  try {
    const updated = await About.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updated);
  } catch (err) {
    console.error("Error updating about data:", err);
    res.status(500).json({ error: "Failed to update about data" });
  }
});

module.exports = router;
