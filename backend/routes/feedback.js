const express = require("express");
const Feedback = require("../models/feedback");
const router = express.Router();

/* =========================
   POST /api/feedback → Save new feedback
========================= */
router.post("/", async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || typeof rating !== "string") {
    return res.status(400).json({ success: false, error: "Rating is required" });
  }

  try {
    const entry = new Feedback({
      rating,
      feedback: comment || ""
    });

    await entry.save();
    console.log("Received feedback:", entry);

    res.json({ success: true, feedback: entry });
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

/* =========================
   GET /api/feedback → View all feedback
========================= */
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ date: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res.status(500).json({ error: "Failed to load feedback" });
  }
});

module.exports = router;
