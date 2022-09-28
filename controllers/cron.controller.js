const { pool, TABLE_NAME } = require("../conn");
var CronJob = require("cron").CronJob;
const axios = require("axios");
exports.job = new CronJob("*/30 * * * *", () => {
  console.log("Fetching price every 30 minute...");
  apiCall();
});

const apiCall = async () => {
  let val = await axios
    .get("https://api.coingecko.com/api/v3/exchange_rates")
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
  if (val.status === 200) {
    const data = {
      _id: "INR" + Math.floor(Math.random() * 899999 + 100000),
      update_time: new Date().toString(),
      inr_value: val.data.rates.inr.value,
    };
    pool.query(
      `INSERT INTO ${TABLE_NAME} (_id, update_time, inr_value) VALUES($1, $2, $3)`,
      [data._id, data.update_time, data.inr_value],
      (err) => {
        if (err) {
          return res.status(500).json({
            status: "Failure",
            code: 500,
            error: err,
          });
        }
        return res.status(200).json({
          status: "Success",
          code: 200,
          data: data,
        });
      }
    );
  } else {
    return res.status(500).json({
      status: "Failure",
      code: 500,
      error: "Error fetching data",
    });
  }
};
