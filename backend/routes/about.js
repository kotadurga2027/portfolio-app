const express = require("express");
const About = require("../models/about");   // import mongoose model
const router = express.Router();

/* =========================
   GET ABOUT DATA
========================= */
router.get("/", async (req, res) => {
  try {
    const aboutData = await About.findOne();
    if (aboutData) {
      return res.json(aboutData);
    }

    // Backward compatibility: try legacy collection name if current is empty.
    const legacy = await About.db.collection("about").findOne({});
    if (legacy) {
      return res.json(legacy);
    }

    return res.status(404).json({ error: "No about data found" });
  } catch (err) {
    console.error("Error fetching about data:", err);
    res.status(500).json({ error: "Failed to load about data" });
  }
});

/* =========================
   DEBUG ABOUT SOURCE
========================= */
router.get("/debug", async (req, res) => {
  try {
    const dbName = About.db?.databaseName || null;
    const modelCollection = About.collection?.name || null;

    const aboutsCount = await About.db.collection("abouts").countDocuments();
    const aboutCount = await About.db.collection("about").countDocuments();
    const sampleAbouts = await About.db.collection("abouts").findOne({}, { projection: { intro: 1 } });
    const sampleAbout = await About.db.collection("about").findOne({}, { projection: { intro: 1 } });

    res.json({
      ok: true,
      dbName,
      modelCollection,
      counts: {
        abouts: aboutsCount,
        about: aboutCount
      },
      sampleKeys: {
        aboutsHasIntro: Boolean(sampleAbouts?.intro),
        aboutHasIntro: Boolean(sampleAbout?.intro)
      }
    });
  } catch (err) {
    console.error("About debug error:", err);
    res.status(500).json({ ok: false, error: "Failed to load about debug data" });
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
