const mongoose = require("mongoose");

const endorsementSchema = new mongoose.Schema({
  name: { type: String, required: true },   // person giving endorsement
  role: String,
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Endorsement", endorsementSchema);
