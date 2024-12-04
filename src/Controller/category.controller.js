const { ApiResponse } = require("../Utils/Apiresponse");
const { apiError } = require("../Utils/ApiErrorResponse");
const categoryModel = require("../Model/category.model");

// create category controller
const categorycontroller = async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.files?.image || !name) {
      return res
        .status(401)
        .json(new apiError(false, `category Image or name missing!!`, 401, null));
    }
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

module.exports = { categorycontroller };
