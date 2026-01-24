const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());   // parse JSON bodies safely

app.use("/api/stats", require("./routes/stats"));
app.use("/api/endorsements", require("./routes/endorsements"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/skills", require("./routes/skills"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/voting", require("./routes/voting"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/about", require("./routes/about"));



// global error handler (future‑proof)
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
