const { pool, TABLE_NAME } = require("../conn");
const fetch = require("node-fetch");

exports.showMethods = (req, res) => {
  return res.status(200).json({
    status: "Success",
    code: 200,
    methods: [
      {
        method: "GET",
        path: "/",
        description: "Returns a page with available methods",
      },
      {
        method: "GET",
        path: "/fetch/all",
        auth: "Password required in header as {Auth: <password>}",
        description: "Returns all the data from the database",
      },
      {
        method: "GET",
        path: "/fetch?page=<page_no>&limit=<limit>",
        auth: "Password required in header as {Auth: <password>}",
        description: "Returns the last <limit> entries from the database",
      },
      {
        method: "GET",
        path: "/fetch/current",
        auth: "Password required in header as {Auth: <password>}",
        description:
          "Fetches the current INR value and stores it in the database",
      },
      {
        method: "GET",
        path: "/stop",
        auth: "Password required in header as {Auth: <password>}",
        description: "Stops the Cron Job",
      },
    ],
  });
};

exports.showAll = async (req, res) => {
  await pool.query(
    `SELECT * FROM ${TABLE_NAME} ORDER BY update_time DESC`,
    (err, result) => {
      if (err) {
        return res.status(500).json({
          status: "Error",
          code: 500,
          error: err,
        });
      }
      return res.status(200).json({
        status: "Success",
        code: 200,
        data: result.rows,
      });
    }
  );
};
exports.showLimit = async (req, res) => {
  const { limit, page } = req.query;
  if (!limit || !page) {
    return res.status(400).json({
      status: "Failure",
      code: 400,
      error: "Limit and page number are required",
    });
  }
  await pool.query(
    `SELECT * FROM ${TABLE_NAME} ORDER BY update_time DESC LIMIT ${limit} OFFSET ${
      (page - 1) * limit
    }`,
    (err, result) => {
      if (err || result.rows.length === 0) {
        // console.log(err);
        return res.status(500).json({
          status: "Failure",
          code: 500,
          error: "No data found for given query",
        });
      }
      return res.status(200).json({
        status: "Success",
        code: 200,
        data: result.rows,
      });
    }
  );
};
exports.fetchAndSend = async (req, res) => {
  // console.log("Fetching price...");
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
      })
      .catch((err) => {
        return res.status(400).json({
          status: "Error",
          code: 400,
          error: err,
        });
      });
  }
};
