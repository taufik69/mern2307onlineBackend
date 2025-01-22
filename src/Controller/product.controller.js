const { ApiResponse } = require("../Utils/Apiresponse");
const { apiError } = require("../Utils/ApiErrorResponse");
const productModel = require("../Model/product.model");
const categoryModel = require("../Model/category.model");
const subcategorModel = require("../Model/subcategory.model");
const {
  uploadImageCloudinary,
  deleteCloudinaryImage,
} = require("../helpers/cloudinary");

// upload or create product

const createProduct = async (req, res) => {
  try {
    const { name, description, rating, price, stock, category, subCategory } =
      req.body;
    if (
      !name ||
      !description ||
      !rating ||
      !price ||
      !stock ||
      !category ||
      !subCategory
    ) {
      return res
        .status(401)
        .json(new apiError(false, `Product information Missing`, 401, null));
    }

    if (!req.files) {
      return res
        .status(401)
        .json(new apiError(false, `Image information Missing`, 401, null));
    }

    // check is product already exist in db
    const isExist = await productModel.find({ name: name });
    if (isExist?.length) {
      return res
        .status(401)
        .json(new apiError(false, `${name} Product Already Exist`, 401, null));
    }

    // now upload the image on cloudinary
    let cloudinaryImage = [];
    for (let image of req.files?.image) {
      const { url } = await uploadImageCloudinary(image.path);
      cloudinaryImage.push(url);
    }

    const saveData = await productModel.create({
      name,
      description,
      rating,
      price,
      stock,
      category,
      subCategory,
      image: cloudinaryImage,
    });
    if (saveData) {
      const searchCategory = await categoryModel.findById(category);
      searchCategory.product.push(saveData._id);
      await searchCategory.save();

      // now save the prouct in to subcategory
      const findsubcategory = await subcategorModel.findById(subCategory);
      findsubcategory.product.push(saveData._id);
      await findsubcategory.save();
      return res
        .status(200)
        .json(
          new ApiResponse(false, `${name} create  Successfull`, 200, saveData)
        );
    }
    return res
      .status(401)
      .json(new apiError(false, `${name} Product upload Failed !!`, 401, null));

    // now save the prodcut information into database
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Product create controller  controller error : ${error} !!`,
          501,
          null
        )
      );
  }
};

// get all product

const getAllproduct = async (req, res) => {
  try {
    const allproduct = await productModel
      .find({})
      .populate({
        path: "category",
        select: "-subcategory -product -createdAt -updatedAt ",
      })
      .populate({
        path: "subCategory",
        select: "-category -createdAt -updatedAt ",
      });
    if (!allproduct) {
      return res
        .status(401)
        .json(new apiError(false, `Product Not  Found !!`, 401, null));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          false,
          "allproduct Retrive Successfull",
          200,
          allproduct
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          ` Get Product controller error : ${error}`,
          501,
          null
        )
      );
  }
};

// category wise filter product

const categoryWiseProduct = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const categorProduct = await productModel
      .find({ category: categoryId })
      .select("-category -subCategory");

    if (!categorProduct) {
      return res
        .status(501)
        .json(
          new apiError(
            false,
            ` category wise  Productd not Found !!`,
            501,
            null
          )
        );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          false,
          "allproduct Retrive Successfull",
          200,
          categorProduct
        )
      );
  } catch (error) {
    {
      return res
        .status(501)
        .json(
          new apiError(
            false,
            ` category wise  controller error : ${error}`,
            501,
            null
          )
        );
    }
  }
};

// const updateproduct

const updateProductinfo = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.category) {
      const findproduct = await productModel.findById(id);
      const findCategory = await categoryModel.findById(findproduct.category);
      findCategory.product.pull(findproduct._id);
      await findCategory.save();

      // now update the category productid
      const updateCategory = await categoryModel.findById(req.body.category);

      updateCategory.product.push(findproduct._id);
      await updateCategory.save();
    }
    const product = await productModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!product) {
      return res
        .status(501)
        .json(new apiError(false, ` Update Product info Failed`, 501, null));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(false, "product updated Successfull", 200, product)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          ` Update Product info controller error : ${error}`,
          501,
          null
        )
      );
  }
};

// update image
const updateImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files?.image) {
      return res
        .status(401)
        .json(new apiError(false, `Image information Missing`, 401, null));
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(501)
        .json(new apiError(false, `Product not found`, 501, null));
    }
    if (!req.body.imageUrl) {
      return res
        .status(501)
        .json(new apiError(false, `Imgae Link Missing`, 501, null));
    }
    for (let image of req.body.imageUrl) {
      const item = image.split("/");
      const lastitem = item[item.length - 1];
      const actualClodinaryUrl = lastitem.split(".")[0];
      await deleteCloudinaryImage(actualClodinaryUrl);
    }

    // now delte the image url in database
    product.image.pull(...req.body.imageUrl);
    await product.save();

    // now upload the new image
    let coludinaryImage = [];
    for (let image of req.files?.image) {
      const { url } = await uploadImageCloudinary(image.path);
      coludinaryImage.push(url);
    }

    // now update the image in database
    product.image.push(...coludinaryImage);
    await product.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          false,
          "Product Image Updated Successfull",
          200,
          product
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Image Update controller error : ${error}`,
          501,
          null
        )
      );
  }
};

// single product controller
const singleproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id).populate({
      path: "category",
      select: "-createdAt -updatedAt",
      populate: {
        path: "product",
      },
    });
    if (!product) {
      return res
        .status(501)
        .json(new apiError(false, `Product not found`, 501, null));
    }
    return res
      .status(200)
      .json(new ApiResponse(false, "Product Found", 200, product));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Single Product controller error : ${error}`,
          501,
          null
        )
      );
  }
};

module.exports = {
  createProduct,
  getAllproduct,
  categoryWiseProduct,
  updateProductinfo,
  updateImage,
  singleproduct,
};
