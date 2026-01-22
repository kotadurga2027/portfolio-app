// routes/contact.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataPath = path.join(__dirname, "../data/contact.json");

// helper: read messages
function readMessages() {
  try {
    const raw = fs.readFileSync(dataPath);
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading contact.json:", err);
    return { messages: [] };
  }
}

// helper: write messages
function writeMessages(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing contact.json:", err);
  }
}

// POST /api/contact → save message
router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  const data = readMessages();
  data.messages.push({
    name,
    email,
    message,
    date: new Date().toISOString()
  });

  writeMessages(data);
  res.json({ success: true });
});

module.exports = router;
