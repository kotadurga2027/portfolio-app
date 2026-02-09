const express = require("express");
const Stat = require("../models/stats");
const Project = require("../models/projects");
const Skill = require("../models/skills");
const router = express.Router();

/* GET STATS - Dynamic calculation */
router.get("/", async (req, res) => {
  try {
    // Count projects and skills dynamically
    const projectCount = await Project.countDocuments();
    const skillCount = await Skill.countDocuments();
    
    // Static values (update manually)
    const currentYear = new Date().getFullYear();
    const careerStart = 2019; // Your start year
    const yearsExperience = currentYear - careerStart;
    const cicdPipelines = 10; // Update manually
    
    res.json({
      yearsExperience,
      projects: projectCount,
      cicdPipelines,
      technologies: skillCount
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    // Fallback values
    res.json({
      yearsExperience: 6,
      projects: 2,
      cicdPipelines: 10,
      technologies: 6
    });
  }
});

module.exports = router;