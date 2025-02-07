const express = require("express");
const {
  success,
  Cancle,
  failed,
} = require("../../Controller/Payment.controller");
const _ = express.Router();
_.post("/success", success);
_.post("/fail", Cancle);
_.post("/cancel", failed);
module.exports = _;
