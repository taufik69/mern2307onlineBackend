const subcategoryModel = require("../Model/subcategory.model");
const categoryModel = require("../Model/category.model");
const { ApiResponse } = require("../Utils/Apiresponse");
const { apiError } = require("../Utils/ApiErrorResponse");

const createSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    if (!name || !category) {
      return res
        .status(501)
        .json(
          new apiError(false, `Subcategory Creditail Missing !!`, 501, null)
        );
    }

    // check already exist this subcategory in database
    const isExist = await subcategoryModel.find({ name: name });
    if (isExist?.length) {
      return res
        .status(501)
        .json(
          new apiError(
            false,
            `${name} Already Exist Try another One `,
            501,
            null
          )
        );
    }

    // save the subcategory information in database
    const saveSubCategory = await subcategoryModel.create({
      name: name,
      category: category,
    });

    if (!saveSubCategory) {
      return res
        .status(501)
        .json(new apiError(false, `Subcategory Creare Failed`, 501, null));
    }
    // find the category
    const findCategory = await categoryModel.findOne({ _id: category });
    findCategory.subcategory.push(saveSubCategory._id);
    await findCategory.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          false,
          "SubCategory created Successfull",
          200,
          saveSubCategory
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Error from createSubCaregory  controller  ${error}`,
          501,
          null
        )
      );
  }
};

const getAllSubCategory = async (req, res) => {
  try {
    const allSubCategory = await subcategoryModel.find().populate({
      path: "category",
      select: "-subcategory -createdAt -updatedAt",
    });
    if (!allSubCategory) {
      return res
        .status(401)
        .json(new apiError(false, `SubCategory Not Found !!`, 401, null));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          false,
          "allSubCategory Retrive Successfull",
          200,
          allSubCategory
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `get all  Subcategory  controller error : ${error} !!`,
          501,
          null
        )
      );
  }
};

// get single sub category
const singleSubCategory = async (req, res) => {
  try {
    const { name } = req.params;
    const singleItem = await subcategoryModel
      .findOne({ _id: name })
      .populate("category");
    if (!singleItem) {
      return res
        .status(501)
        .json(
          new apiError(false, ` single  Subcategory  Not Found !!`, 501, null)
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(false, "single Retrive Successfull", 200, singleItem)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `get single  Subcategory  controller error : ${error} !!`,
          501,
          null
        )
      );
  }
};

// update subcategory
const updateSubCategory = async (req, res) => {
  try {
    const { name } = req.params;

    const updateSubCategory = await subcategoryModel.findOneAndUpdate(
      {
        _id: name,
      },
      { ...req.body },
      {
        new: true,
      }
    );

    if (!updateSubCategory) {
      return res
        .status(501)
        .json(new apiError(false, `update  Subcategory  Failed`, 501, null));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          false,
          "update SubCategory  Successfull",
          200,
          updateSubCategory
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Update  Subcategory  controller error : ${error} !!`,
          501,
          null
        )
      );
  }
};
// delte sub catgory
const delteSubCategory = async (req, res) => {
  try {
    const { name } = req.params;
    const deltedSubCategory = await subcategoryModel.findOneAndDelete({
      _id: name,
    });

    if (!deltedSubCategory) {
      return res
        .status(501)
        .json(new apiError(false, `  Subcategory Delted Failed`, 501, null));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          false,
          "SubCategory Deleted Successfull",
          200,
          deltedSubCategory
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `delte Subcategory  controller error : ${error} !!`,
          501,
          null
        )
      );
  }
};
module.exports = {
  createSubCategory,
  getAllSubCategory,
  singleSubCategory,
  updateSubCategory,
  delteSubCategory
};
