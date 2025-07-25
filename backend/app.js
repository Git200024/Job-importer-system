require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
const importLogRoutes = require("./routes/importLog");

connectDB(); // Connect to MongoDB

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/import-logs", importLogRoutes); // API Routes

require("./cron/fetchFeed"); // Cron job auto-start

// Default route
app.get("/", (req, res) => {
  res.send("Job Importer Server is Running");
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
