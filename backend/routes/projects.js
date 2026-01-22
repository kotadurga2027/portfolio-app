// routes/projects.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataPath = path.join(__dirname, "../data/projects.json");

// helper: read JSON safely
function readProjects() {
  try {
    const raw = fs.readFileSync(dataPath);
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading projects.json:", err);
    return { projectsList: [] };
  }
}
// helper: write JSON safely
function writeProjects(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing projects.json:", err);
  }
}

// GET /api/projects → return all projects
router.get("/", (req, res) => {
  const data = readProjects();
  res.json(data.projectsList || []);
});
// POST /api/projects/:id/like → increment likes for a project
router.post("/:id/like", (req, res) => {
  const data = readProjects();
  const project = data.projectsList.find(p => p.id === req.params.id);

  if (!project) {
    return res.status(404).json({ success: false, error: "Project not found" });
  }

  project.likes = (project.likes || 0) + 1;
  writeProjects(data);

  res.json({ success: true, likes: project.likes });
});

module.exports = router;
