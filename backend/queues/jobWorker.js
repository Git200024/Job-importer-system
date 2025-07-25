require("dotenv").config();
const { Worker } = require("bullmq");
const redis = require("../config/redis");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Job = require("../models/Job");
const { processJob } = require("../services/jobService");
const ImportLog = require("../models/importLog");
const { jobQueue } = require("../queues/jobQueue");

connectDB(); // Connect MongoDB

let stats = {
  total: 0,
  new: 0,
  updated: 0,
  failed: 0,
  failedReasons: [],
};

// Track all sources seen during this batch
let sources = [];

function extractFilename(url) {
  try {
    const host = new URL(url).hostname;
    return host.replace(/^www\./, "");
  } catch (e) {
    return "unknown-source";
  }
}

// domain + timestamp for uniqueness
function getTimestampedFilename(sources) {
  const freq = {};
  for (const src of sources) {
    const file = extractFilename(src);
    freq[file] = (freq[file] || 0) + 1;
  }

  const mostCommon = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
  const domain = mostCommon ? mostCommon[0] : "unknown-source";

  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14); // YYYYMMDDHHMMSS
  return `${domain}_${timestamp}`;
}

const jobWorker = new Worker(
  "jobQueue",
  async (job) => {
    const { job: jobData, source } = job.data;
    sources.push(source);

    try {
      const result = await processJob(jobData);
      stats.total++;

      if (result === "new") stats.new++;
      else if (result === "updated") stats.updated++;
    } catch (err) {
      stats.total++;
      stats.failed++;
      stats.failedReasons.push({
        jobTitle: jobData.title,
        reason: err.message,
      });
      console.error(`Failed to process job: ${jobData.title}`, err.message);
    }
  },
  { connection: redis }
);

// When all jobs done
jobWorker.on("drained", async () => {
  const filename = getTimestampedFilename(sources);

  console.log("Queue drained. Saving import log...");
  console.log("Filename:", filename);
  console.log(" Stats:", stats);

  await ImportLog.create({
    filename,
    ...stats,
    timestamp: new Date(),
  });

  // Reset stats & sources
  stats = {
    total: 0,
    new: 0,
    updated: 0,
    failed: 0,
    failedReasons: [],
  };
  sources = [];

  console.log("Import log saved");
});

jobWorker.on("failed", (job, err) => {
  console.error(`Worker job failed: ${job.name}`, err.message);
});
