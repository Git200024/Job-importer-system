const axios = require("axios");
const xml2js = require("xml2js");
const { jobQueue } = require("../queues/jobQueue");
const Job = require("../models/Job"); // 

const parser = new xml2js.Parser({ explicitArray: false });

const transformJob = (item, sourceUrl) => {
  const guid = typeof item.guid === "string" ? item.guid : item.guid?.[0];
  const link = typeof item.link === "string" ? item.link : item.link?.[0];
  const title = typeof item.title === "string" ? item.title : item.title?.[0];

  return {
    externalId: guid || link || title,
    title: title || "",
    description: item.description?.[0] || "",
    company: item["job:company"]?.[0] || "",
    location: item["job:location"]?.[0] || "",
    category: item["job:category"]?.[0] || "",
    type: item["job:type"]?.[0] || "",
    url: link || "",
    postedAt: new Date(item.pubDate?.[0]),
    source: "cron-feed",
  };
};

async function fetchAndQueueJobs(url) {
  try {
    const response = await axios.get(url);
    const parsed = await parser.parseStringPromise(response.data);
    const items = parsed.rss.channel.item;

    const jobs = Array.isArray(items) ? items : [items];

    let totalQueued = 0;

    for (const item of jobs) {
      const job = transformJob(item, url);
      if (!job.externalId) {
        console.warn(`Skipping job with missing externalId: ${job.title}`);
        continue;
      }
      await jobQueue.add("importJob", { job, source: url });
      totalQueued++;
    }

    console.log(`Queued ${totalQueued} jobs from: ${url}`);
    return { total: totalQueued, source: url };
  } catch (err) {
    console.error(`Failed to fetch jobs from ${url}:`, err.message);
    return { total: 0, failed: true, source: url };
  }
}

async function processJob(jobData) {
  const existingJob = await Job.findOne({ externalId: jobData.externalId });

  if (existingJob) {
    await Job.updateOne({ externalId: jobData.externalId }, jobData);
    return "updated";
  } else {
    await Job.create(jobData);
    return "new";
  }
}

module.exports = {
  fetchAndQueueJobs,
  processJob,
};
