const { ApiResponse } = require("../Utils/Apiresponse");
const { apiError } = require("../Utils/ApiErrorResponse");
const productModel = require("../Model/product.model");
const categoryModel = require("../Model/category.model");
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
      findCategory.product.pop(findproduct._id);
      await findCategory.save();
    }
    return;
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

module.exports = {
  createProduct,
  getAllproduct,
  categoryWiseProduct,
  updateProductinfo,
};
