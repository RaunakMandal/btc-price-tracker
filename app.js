require("dotenv").config();

const express = require("express");
const { pool } = require("./conn");
const app = express();

const routes = require("./routes/app.route");
app.use("/", routes);

pool.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected");
  }
});

app.listen(8080, () => {
  console.log("Server started on port 3000");
});
