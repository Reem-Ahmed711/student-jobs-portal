// src/app.js
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors()); 
app.use(express.json());
// Routes

app.use("/api/auth", require("./routes/authRoutes"));


app.use("/api/profile", require("./profiles/profileRoutes"));

app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.get("/", (req, res) => {
  res.send("Server is working ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});