const express = require("express");
const { placeorder } = require("../../Controller/order.controller");
const _ = express.Router();
const { authGuard } = require("../../Middleware/authGuard.middleware");
_.route("/placeorder").post(authGuard, placeorder);

module.exports = _;
