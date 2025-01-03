const { ApiResponse } = require("../Utils/Apiresponse");
const { apiError } = require("../Utils/ApiErrorResponse");
const categoryModel = require("../Model/category.model");
const { uploadImageCloudinary } = require("../helpers/cloudinary");
// create category controller
const categorycontroller = async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.files?.image || !name) {
      return res
        .status(401)
        .json(
          new apiError(false, `category Image or name missing!!`, 401, null)
        );
    }

    // is already exist category in database
    const isAlreadyExist = await categoryModel.find({ name: name });
    if (isAlreadyExist?.length) {
      return res
        .status(401)
        .json(new apiError(false, "Already Exist in this Category", 401, null));
    }

    let imagePath = req.files?.image[0]?.path;
    const cloudinaryFile = await uploadImageCloudinary(imagePath);

    // now save the category information into database
    const saveCategory = await categoryModel.create({
      name,
      image: cloudinaryFile.secure_url,
    });

    if (!saveCategory) {
      return res
        .status(501)
        .json(new apiError(false, "Category Create Failed", 501, null));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(false, "Category Create Successfull", 200, saveCategory)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Error from create category  controller  ${error}`,
          501,
          null
        )
      );
  }
};

// get all category
const getAllCategory = async (req, res) => {
  try {
    const allCategory = await categoryModel.find({}).populate("subcategory");
    if (!allCategory) {
      return res
        .status(401)
        .json(new apiError(false, `Category Not Found`, 401, null));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          false,
          "Category Retrive  Successfull",
          200,
          allCategory
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Error from get All category  controller  ${error}`,
          501,
          null
        )
      );
  }
};

// delete category
const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const deleltedCategory = await categoryModel.findOneAndDelete({ _id: id });
    if (!deleltedCategory) {
      return res
        .status(501)
        .json(new apiError(false, `Category Deleted Failed`, 501, null));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          false,
          "Category Deleted Successfull",
          200,
          deleltedCategory
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Error from delete category  controller  ${error}`,
          501,
          null
        )
      );
  }
};

// get single Category
const getsingleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const singleCategory = await categoryModel.findById(id);
    if (!singleCategory) {
      return res
        .status(401)
        .json(new apiError(false, `Category Not Found`, 401, null));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          false,
          "Category Retrive Successfull",
          200,
          singleCategory
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Error from get single category  controller  ${error}`,
          501,
          null
        )
      );
  }
};

module.exports = {
  categorycontroller,
  getAllCategory,
  deleteCategory,
  getsingleCategory,
};
