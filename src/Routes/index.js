const express = require("express");
const _ = express.Router();
const userRoutes = require("./Api/user.apiRoutes");
const categoryRoutes = require("./Api/category.apiRoutes");

_.use("/api/v1", userRoutes);
_.use("/api/v1", categoryRoutes);

_.use("*", (req, res) => {
  res.send("you route is invalid");
});
module.exports = _;
