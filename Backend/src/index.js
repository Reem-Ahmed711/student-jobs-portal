const express = require("express");
const app = express();
const cors = require("cors");
require("./config/firebase");

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));

const applicationRoutes = require("./routes/jobsRoutes");
const interactionRoutes = require("./routes/interactionRoutes");
const cvRoutes = require("./routes/cvRoutes");
const searchroutes = require("./routes/searchRoutes");

app.use("/api", applicationRoutes);
app.use("/api", interactionRoutes);
app.use("/api", cvRoutes);
app.use("/api", searchroutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));