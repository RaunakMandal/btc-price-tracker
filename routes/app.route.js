const express = require("express");
const router = express.Router();
const {
  showMethods,
  showAll,
  showLimit,
  fetchAndSend,
} = require("../controllers/app.controller");
router.get("/", showMethods);
router.get("/fetch/all", showAll);
router.get("/fetch", showLimit);

router.get("/sandbox/test", fetchAndSend);
module.exports = router;
