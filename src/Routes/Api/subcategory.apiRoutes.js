const express = require("express");
const _ = express.Router();
const {
  createSubCategory,
  getAllSubCategory,
  singleSubCategory,
  updateSubCategory,
  delteSubCategory,
} = require("../../Controller/subcategory.controller");

_.route("/subcategory").post(createSubCategory).get(getAllSubCategory);
_.route("/subcategory/:name")
  .get(singleSubCategory)
  .put(updateSubCategory)
  .delete(delteSubCategory);

module.exports = _;
