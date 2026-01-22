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
   VISITOR COUNT (PERSISTENT)
========================= */
router.post("/visit", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath));

  data.visitors += 1;

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  res.json({ visitors: data.visitors });
});

module.exports = router;
