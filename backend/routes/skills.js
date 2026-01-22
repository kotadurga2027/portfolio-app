// routes/skills.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataPath = path.join(__dirname, "../data/skills.json");

// helper: read JSON safely
function readSkills() {
  try {
    const raw = fs.readFileSync(dataPath);
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading skills.json:", err);
    return { skillsList: [] };
  }
}

// ✅ ADD THIS ROUTE
router.get("/", (req, res) => {
  const data = readSkills();
  res.json(data.skillsList || []);
});

module.exports = router;
