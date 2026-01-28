const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors({ origin: "https://gangumalla-kotadurga-portfolio.pages.dev" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/stats", require("./routes/stats"));
app.use("/api/endorsements", require("./routes/endorsements"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/skills", require("./routes/skills"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/voting", require("./routes/voting"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/about", require("./routes/about"));
app.use("/api/project-details", require("./routes/projectDetails"));


// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB first, then start server
mongoose.connect(process.env.MONGO_URI, { dbName: "portfolio" })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // stop server if DB fails
  });
