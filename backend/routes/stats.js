const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataPath = path.join(__dirname, "../data/stats.json");

/* =========================
   GET ALL STATS
========================= */
router.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath));
  res.json(data);
});

/* =========================
   VISITOR COUNT (UNIQUE)
========================= */
router.post("/visit", (req, res) => {
  const { fingerprint } = req.body;   // frontend will send this
  const data = JSON.parse(fs.readFileSync(dataPath));

  if (!data.fingerprints) {
    data.fingerprints = [];
  }

  // Only increment if fingerprint is new
  if (fingerprint && !data.fingerprints.includes(fingerprint)) {
    data.visitors += 1;
    data.fingerprints.push(fingerprint);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  }

  res.json({ visitors: data.visitors });
});

module.exports = router;
