const ImportLog = require("../models/importLog.js");

// GET /api/import-logs
const getImportLogs = async (req, res) => {
  try {
    const logs = await ImportLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    console.error("Failed to fetch import logs:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getImportLogs };
