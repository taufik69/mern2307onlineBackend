const express = require("express");
const _ = express.Router();
const { categorycontroller } = require("../../Controller/category.controller");
const { upload } = require("../../Middleware/multer.middleware");
_.route("/category").post(
  upload.fields([{ name: "image", maxCount: 1 }]),
  categorycontroller
);

module.exports = _;
