const { pool, TABLE_NAME } = require("../conn");

var CronJob = require("cron").CronJob;
exports.job = new CronJob("30 * * * * *", () => {
  console.log("Fetching price every 30 minute...");
  apiCall();
});

const apiCall = async () => {
  let val = await fetch("https://api.coingecko.com/api/v3/exchange_rates")
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
  if (val.status === 200) {
    val
      .json()
      .then((result) => {
        const data = {
          _id: "INR" + Math.floor(Math.random() * 899999 + 100000),
          update_time: new Date().toString(),
          inr_value: result.rates.inr.value,
        };
        pool.query(
          `INSERT INTO ${TABLE_NAME} (_id, update_time, inr_value) VALUES($1, $2, $3)`,
          [data._id, data.update_time, data.inr_value],
          (err) => {
            if (err) {
              console.log("Error: " + err);
            }
          }
        );
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  }
};
