const express = require("express");
const Endorsement = require("../models/endorsements");  // import mongoose model
const router = express.Router();

/* =========================
   SUBMIT ENDORSEMENT
========================= */
router.post("/", async (req, res) => {
  try {
    const { name, role, message } = req.body;

    // Validation
    if (!name || !message) {
      return res.status(400).json({ error: "Name and message are required" });
    }
    if (name.length > 100 || (role && role.length > 100)) {
      return res.status(400).json({ error: "Name/Role too long" });
    }
    if (message.length > 1000) {
      return res.status(400).json({ error: "Message too long" });
    }

    const newEndorsement = new Endorsement({
      name: name.trim(),
      role: role ? role.trim() : "",
      message: message.trim(),
      status: "approved"
    });

    await newEndorsement.save();
    res.json({ success: true, endorsement: newEndorsement });
  } catch (err) {
    console.error("Endorse error:", err);
    res.status(500).json({ error: "Failed to save endorsement" });
  }
});

/* =========================
   GET ENDORSEMENTS
========================= */
router.get("/", async (req, res) => {
  try {
    const endorsements = await Endorsement.find().sort({ date: -1 });
    res.json(endorsements);
  } catch (err) {
    console.error("Fetch endorsements error:", err);
    res.status(500).json({ error: "Failed to load endorsements" });
  }
});

/* =========================
   LIKE AN ENDORSEMENT
========================= */
router.post("/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const endorsement = await Endorsement.findById(id);

    if (!endorsement) {
      return res.status(404).json({ error: "Endorsement not found" });
    }

    endorsement.likes = (endorsement.likes || 0) + 1;
    await endorsement.save();

    res.json({ success: true, likes: endorsement.likes });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ error: "Failed to like endorsement" });
  }
});

module.exports = router;
