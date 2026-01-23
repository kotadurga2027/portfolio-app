const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const filePath = path.join(__dirname, "../data/feedback.json");

// Helpers
function readFeedback() {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
function writeFeedback(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// POST /api/feedback → Save new feedback
router.post("/", (req, res) => {
  const { rating, comment } = req.body;
  
  if (!rating || typeof rating !== "string") {
    return res.status(400).json({ success: false, error: "Rating is required" });
  }

  const data = readFeedback();
  const entry = {
    rating,
    comment: comment || "",
    timestamp: new Date().toISOString()
  };
  console.log("Received feedback:", req.body);

  data.feedback.push(entry);
  writeFeedback(data);

  res.json({ success: true });
});

// GET /api/feedback → Optional: view all feedback
router.get("/", (req, res) => {
  const data = readFeedback();
  res.json(data.feedback);
});

module.exports = router;
