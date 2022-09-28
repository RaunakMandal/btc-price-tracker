const { Pool } = require("pg");
exports.TABLE_NAME = "btctoinr";
exports.pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

this.pool.query(
  "CREATE TABLE btctoinr(_id text PRIMARY KEY, inr_value text,update_time text);",
  (err, res) => {
    if (err) {
      console.log("Table already exists");
    } else {
      console.log("Table created");
    }
    this.pool.end();
  }
);
