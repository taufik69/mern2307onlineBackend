const express = require("express");
const _ = express.Router();
const {
  categorycontroller,
  getAllCategory,
  deleteCategory,
  getsingleCategory,
} = require("../../Controller/category.controller");
const { upload } = require("../../Middleware/multer.middleware");
_.route("/category")
  .post(upload.fields([{ name: "image", maxCount: 1 }]), categorycontroller)
  .get(getAllCategory);

_.route("/category/:id").delete(deleteCategory).get(getsingleCategory);

module.exports = _;
