const { ApiResponse } = require("../Utils/Apiresponse");
const { apiError } = require("../Utils/ApiErrorResponse");
const OrderModel = require("../Model/order.model");

const success = async (req, res) => {
  try {
    res.redirect("http://localhost:5173/paymentSucess");
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Error from success  controller  ${error}`,
          501,
          null
        )
      );
  }
};

const failed = async (req, res) => {
  try {
    return res
      .status(200)
      .json(new ApiResponse(false, "payement failed", 200, null));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Error from success  controller  ${error}`,
          501,
          null
        )
      );
  }
};
const Cancle = async (req, res) => {
  try {
    return res
      .status(200)
      .json(new ApiResponse(false, "payement Cancle", 200, null));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Error from success  controller  ${error}`,
          501,
          null
        )
      );
  }
};

module.exports = { success, Cancle, failed };
