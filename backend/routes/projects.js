const express = require("express");
const Project = require("../models/projects");   // import mongoose model
const router = express.Router();

/* =========================
   GET /api/projects → return all projects
========================= */
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ date: -1 });
    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to load projects" });
  }
});

/* =========================
   POST /api/projects/:id/like → increment likes for a project
========================= */
router.post("/:id/like", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }

    project.likes = (project.likes || 0) + 1;
    await project.save();

    res.json({ success: true, likes: project.likes });
  } catch (err) {
    console.error("Error liking project:", err);
    res.status(500).json({ success: false, error: "Failed to like project" });
  }
});

module.exports = router;
