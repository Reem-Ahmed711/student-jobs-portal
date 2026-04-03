const express = require("express");
const app = express();
const cors = require("cors");
require("./config/firebase");

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));

const applicationRoutes = require("./jobs/jobsRoutes");
const interactionRoutes = require("./interactions/interactionRoutes");

app.use("/api", applicationRoutes);
app.use("/api", interactionRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));