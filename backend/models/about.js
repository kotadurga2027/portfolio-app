const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  intro: {
    name: { type: String, required: true },
    image: { type: String },          // URL to profile image
    paragraphs: [{ type: String }]    // multiple intro paragraphs
  },
  experience: [
    {
      title: { type: String, required: true },
      company: { type: String },
      period: { type: String },       // e.g. "2020–2024"
      description: { type: String }
    }
  ],
  certifications: {
    acquired: [{ type: String }],     // list of completed certs
    planned: [{ type: String }]       // list of upcoming certs
  }
}, { timestamps: true });

module.exports = mongoose.model("About", aboutSchema);
