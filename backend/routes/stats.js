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

/* =========================
   LIKE FEATURED PROJECT
   (PERSISTENT)
========================= */
router.post("/like", (req, res) => {
  const { project } = req.body;

  const data = JSON.parse(fs.readFileSync(dataPath));

  if (data.featuredProjectLikes[project] === undefined) {
    return res.status(400).json({ error: "Invalid project" });
  }

  data.featuredProjectLikes[project] += 1;

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  res.json({
    project,
    likes: data.featuredProjectLikes[project]
  });
});

module.exports = router;
