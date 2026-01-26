const express = require("express");
const Stat = require("../models/stat");   // import mongoose model
const router = express.Router();

/* =========================
   GET ALL STATS
========================= */
router.get("/", async (req, res) => {
  try {
    const stats = await Stat.find();
    res.json(stats);
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
    // Find the global stats document (you can also scope by page if needed)
    let stat = await Stat.findOne({ page: "global" });

    if (!stat) {
      stat = new Stat({ page: "global", visitors: 0, fingerprints: [] });
    }

    // Only increment if fingerprint is new
    if (fingerprint && (!stat.fingerprints || !stat.fingerprints.includes(fingerprint))) {
      stat.visitors = (stat.visitors || 0) + 1;
      stat.fingerprints = [...(stat.fingerprints || []), fingerprint];
      await stat.save();
    }

    res.json({ visitors: stat.visitors });
  } catch (err) {
    console.error("Error updating visitor count:", err);
    res.status(500).json({ error: "Failed to update visitor count" });
  }
});

module.exports = router;
