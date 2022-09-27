const express = require("express");
const router = express.Router();
const {
  showMethods,
  showAll,
  showLimit,
} = require("../controllers/app.controller");
router.get("/", showMethods);
router.get("/fetch/all", showAll);
router.get("/fetch", showLimit);
module.exports = router;
