const express = require("express");
const _ = express.Router();
const { upload } = require("../../Middleware/multer.middleware");
const {
  createProduct,
  getAllproduct,
  categoryWiseProduct,
  updateProductinfo,
  updateImage,
  singleproduct,
} = require("../../Controller/product.controller");
_.route("/product")
  .post(upload.fields([{ name: "image", maxCount: 10 }]), createProduct)
  .get(getAllproduct);

_.route("/categoryproduct/:categoryId").get(categoryWiseProduct);
_.route("/updateProduct/:id").put(updateProductinfo);
_.route("/updateimage/:id").put(
  upload.fields([{ name: "image", maxCount: 10 }]),
  updateImage
);

_.route("/singleproduct/:id").get(singleproduct);

module.exports = _;
