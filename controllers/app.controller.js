const { pool, TABLE_NAME } = require("../conn");

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
        auth: "Password required",
        description: "Returns all the data from the database",
      },
      {
        method: "GET",
        path: "/fetch?limit=<limit>",
        auth: "Password required",
        description: "Returns the last <limit> entries from the database",
      },
    ],
  });
};

exports.showAll = async (req, res) => {
  //   console.log("showAll");
  await pool.query(`SELECT * FROM ${TABLE_NAME}`, (err, result) => {
    if (err) {
      // console.log(err);
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
  });
};
exports.showLimit = async (req, res) => {
  const { limit, page } = req.query;
  //   console.log(limit, page);
  await pool.query(
    `SELECT * FROM ${TABLE_NAME} LIMIT ${limit} OFFSET ${page}`,
    (err, result) => {
      if (err || result.rows.length === 0) {
        console.log(err);
        return res.status(500).json({
          status: "Failure",
          code: 500,
          error: err || "No data found",
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
  var inr_val;
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
          inr_value: result.rates.inr,
        };
        pool.query(
          `INSERT INTO ${TABLE_NAME}(_id, update_time, inr_value) VALUES($1, $2, $3)`,
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
              data: "Data inserted...",
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
