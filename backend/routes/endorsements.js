const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataPath = path.join(__dirname, "../data/stats.json");

/* =========================
   SUBMIT ENDORSEMENT
========================= */
router.post("/", (req, res) => {
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

    const data = JSON.parse(fs.readFileSync(dataPath));

    // Ensure endorsementsList exists
    if (!data.endorsementsList) {
      data.endorsementsList = [];
    }

    const newEndorsement = {
      id: Date.now().toString(),   // unique id
      name: name.trim(),
      role: role ? role.trim() : "",
      message: message.trim(),
      date: new Date().toISOString(),
      status: "approved"           // future: moderation
    };

    data.endorsementsList.push(newEndorsement);

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    res.json({ success: true, endorsement: newEndorsement });
  } catch (err) {
    console.error("Endorse error:", err);
    res.status(500).json({ error: "Failed to save endorsement" });
  }
});

/* =========================
   GET ENDORSEMENTS
========================= */
router.get("/", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath));
    res.json(data.endorsementsList || []);
  } catch (err) {
    console.error("Fetch endorsements error:", err);
    res.status(500).json({ error: "Failed to load endorsements" });
  }
});

/* LIKE AN ENDORSEMENT */
router.post("/:id/like", (req, res) => {
  try {
    const { id } = req.params;
    const data = JSON.parse(fs.readFileSync(dataPath));

    const endorsement = data.endorsementsList.find(e => e.id === id);
    if (!endorsement) {
      return res.status(404).json({ error: "Endorsement not found" });
    }

    // Initialize likes if not present
    if (!endorsement.likes) endorsement.likes = 0;

    endorsement.likes += 1;

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    res.json({ success: true, likes: endorsement.likes });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ error: "Failed to like endorsement" });
  }
});

module.exports = router;
