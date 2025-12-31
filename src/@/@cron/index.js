const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const { log } = require("../utils/logger");

function registerCronJobs() {
  log("Registering Cron Jobs...");

  const jobsDir = path.join(__dirname, "jobs");
  const files = fs.readdirSync(jobsDir);

  const registeredJobs = [];

  for (const file of files) {
    const jobDef = require(path.join(jobsDir, file));

    const job = cron.schedule(jobDef.schedule, jobDef.task, {
      scheduled: true,
      timezone: jobDef.timezone || "Asia/Kolkata",
    });

    registeredJobs.push(job);

    log(`✔ Cron Registered: ${jobDef.name} → (${jobDef.schedule})`);
  }

  log("All cron jobs registered successfully.");

  return registeredJobs;
}

module.exports = { registerCronJobs };
