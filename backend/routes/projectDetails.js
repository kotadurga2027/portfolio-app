const express = require("express");
const router = express.Router();
const ProjectDetail = require("../models/projectDetail");

// GET all project details
router.get("/", async (req, res) => {
  try {
    const projects = await ProjectDetail.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch project details" });
  }
});

// GET single project detail by id
router.get("/:id", async (req, res) => {
  try {
    const project = await ProjectDetail.findOne({ id: req.params.id });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch project detail" });
  }
});

module.exports = router;
