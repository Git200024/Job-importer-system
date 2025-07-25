const cron = require("node-cron");
const { fetchAndQueueJobs } = require("../services/jobService");

const jobFeeds = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
  "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
  "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
  "https://jobicy.com/?feed=job_feed&job_categories=business",
  "https://jobicy.com/?feed=job_feed&job_categories=management",
];

cron.schedule("0 * * * *", async () => {
  console.log("Starting hourly job import...");

  for (const url of jobFeeds) {
    await fetchAndQueueJobs(url);
  }

  console.log("Job import finished.");
});
