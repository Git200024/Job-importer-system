
const mongoose = require("mongoose");

console.log("importLog model loaded");

//ImportLog Schema 
const importLogSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  total: Number,
  new: Number,
  updated: Number,
  failed: Number,
  failedReasons: [
    {
      jobTitle: String,
      reason: String,
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ImportLog", importLogSchema);
