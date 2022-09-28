var CronJob = require("cron").CronJob;
exports.job = new CronJob("* * * * * *", () => {
  console.log("You will see this message every second");
});
