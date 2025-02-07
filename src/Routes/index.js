const express = require("express");
const _ = express.Router();
const userRoutes = require("./Api/user.apiRoutes");
const categoryRoutes = require("./Api/category.apiRoutes");
const subcategoryRoutes = require("./Api/subcategory.apiRoutes");
const productRoutes = require("./Api/product.apiRoutes");
const bannerRoutes = require("./Api/banner.apoRoutes");
const cartRoutes = require("./Api/cart.apiRoutes");
const OrderRoutes = require("./Api/order.apiRoutes");
const paymentRoutes = require("./Api/payment.apiRoutes");
_.use("/api/v1", userRoutes);
_.use("/api/v1", categoryRoutes);
_.use("/api/v1", subcategoryRoutes);
_.use("/api/v1", productRoutes);
_.use("/api/v1", bannerRoutes);
_.use("/api/v1", cartRoutes);
_.use("/api/v1", OrderRoutes);
_.use("/api/v1", paymentRoutes);

_.use("*", (req, res) => {
  res.send("you route is invalid");
});
module.exports = _;
