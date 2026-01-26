const express = require("express");
const Contact = require("../models/contact");   // import mongoose model
const router = express.Router();

/* =========================
   POST /api/contact → save message
========================= */
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  try {
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Error saving contact:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   GET /api/contact → fetch all messages
========================= */
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 }); // newest first
    res.json(contacts);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
