const express = require("express");
const router = express.Router();
const {
  showMethods,
  showAll,
  showLimit,
  fetchAndSend,
} = require("../controllers/app.controller");
const { isAuthenticated } = require("../controllers/auth.controller");
const { job } = require("../controllers/cron.controller");

router.get("/", showMethods);
router.get("/fetch/all", isAuthenticated, showAll);
router.get("/fetch", isAuthenticated, showLimit);
router.get("/fetch/current", isAuthenticated, fetchAndSend);
router.get("/start", isAuthenticated, (req, res) => {
  job.start();
  return res.status(200).json({
    status: "Success",
    code: 200,
    message: "Job started",
  });
});
router.get("/stop", isAuthenticated, (req, res) => {
  job.stop();
  return res.status(200).json({
    status: "Success",
    code: 200,
    message: "Job stopped",
  });
});
router.all("*", (req, res) => {
  return res.status(404).json({
    status: "Failure",
    code: 404,
    error: "Page not found",
  });
});
module.exports = router;
