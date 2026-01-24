const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataPath = path.join(__dirname, "../data/about.json");

/* =========================
   GET ABOUT DATA
========================= */
router.get("/", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath));
    res.json(data);
  } catch (err) {
    console.error("Error reading about.json:", err);
    res.status(500).json({ error: "Failed to load about data" });
  }
});

module.exports = router;
