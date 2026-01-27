const express = require("express");
const Stat = require("../models/stats");   // import mongoose model
const router = express.Router();

/* =========================
   GET STATS (single object)
========================= */
router.get("/", async (req, res) => {
  try {
    const stats = await Stat.findOne(); // ✅ no filter, just grab first doc
    if (!stats) {
      return res.status(404).json({ error: "No stats found" });
    }
    res.json(stats); // ✅ send object directly
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to load stats" });
  }
});

/* =========================
   VISITOR COUNT (UNIQUE)
========================= */
router.post("/visit", async (req, res) => {
  const { fingerprint } = req.body;

  try {
    // Find the single stats document
    let stat = await Stat.findOne();

    // If not found, create it
    if (!stat) {
      stat = new Stat({ visitors: 0, technologies: 0, fingerprints: [] });
    }

    // Only increment if fingerprint is new
    if (fingerprint && (!stat.fingerprints || !stat.fingerprints.includes(fingerprint))) {
      stat.visitors = (stat.visitors || 0) + 1;
      stat.fingerprints.push(fingerprint);
      await stat.save();
    }

    res.json({ visitors: stat.visitors });
  } catch (err) {
    console.error("Error updating visitor count:", err);
    res.status(500).json({ error: "Failed to update visitor count" });
  }
});

module.exports = router;
