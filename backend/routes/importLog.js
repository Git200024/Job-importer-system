const express = require("express");
const router = express.Router();
const ImportLog = require("../models/importLog.js");

const { getImportLogs } = require("../controllers/importLog.js");

// GET /api/import-logs
router.get("/", getImportLogs);

module.exports = router;
