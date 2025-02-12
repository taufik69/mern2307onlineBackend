const express = require("express");
const _ = express.Router();
const {
  addtoCart,
  getAllCartItem,
  deltecartItem,
  usercartitem,
} = require("../../Controller/cart.controller");
const { authGuard } = require("../../Middleware/authGuard.middleware");
_.route("/addtocart").post(authGuard, addtoCart);
_.route("/alladdtocart").get(getAllCartItem);
_.route("/addtocart/:id").delete(authGuard, deltecartItem);

_.route("/useritem").get(authGuard, usercartitem);

module.exports = _;
