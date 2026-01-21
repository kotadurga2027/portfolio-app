const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.use("/api/stats", require("./routes/stats"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});