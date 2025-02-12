const { ApiResponse } = require("../Utils/Apiresponse");
const { apiError } = require("../Utils/ApiErrorResponse");
const cartModel = require("../Model/cart.model");

// add to cart controoler
const addtoCart = async (req, res) => {
  try {
    const { product, qunatity } = req.body;
    if (!product || !qunatity) {
      return res
        .status(401)
        .json(new apiError(false, `add to cart credential Missing`, 401, null));
    }

    const isAlreadyExist = await cartModel.find({ product: product });
    if (isAlreadyExist?.length) {
      return res
        .status(401)
        .json(new apiError(false, `Already Add to cart`, 401, null));
    }

    // / now save the cart item into database
    const cart = await cartModel.create({
      user: req.user.id,
      product,
      qunatity,
    });
    if (!cart) {
      return res
        .status(401)
        .json(new apiError(false, `Failed to create add to cart`, 401, null));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(false, "Add to cart Create Successfull", 200, cart)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Error from add to cart controller  ${error}`,
          501,
          null
        )
      );
  }
};

// get all cart item

const getAllCartItem = async (req, res) => {
  try {
    const allcartitem = await cartModel
      .find({})
      .populate({
        path: "user",
        select:
          "-password -role -isVerified -otp -otpExpireTime -createdAt -updatedAt",
      })
      .populate({
        path: "product",
      });
    if (!allcartitem) {
      return res
        .status(401)
        .json(new apiError(false, `Order not found`, 401, null));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          false,
          "Add to cart Create Successfull",
          200,
          allcartitem
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Error from get all cart controller  ${error}`,
          501,
          null
        )
      );
  }
};

// delete cart item
const deltecartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await cartModel.findOneAndDelete({ _id: id });
    if (!cart) {
      res.status(401).jons({ error: "Cart Item not Found" });
    }
    return res
      .status(200)
      .json(
        new ApiResponse(false, "Add to cart delted Successfull", 200, cart)
      );
  } catch (error) {}
};

// user cart item

const usercartitem = async (req, res) => {
  try {
    const { id } = req.user;
    const specificuserCartitem = await cartModel
      .find({ user: id })
      .populate({
        path: "user",
        select:
          "-password -role -isVerified -otp -otpExpireTime -createdAt -updatedAt",
      })
      .populate({
        path: "product",
      });
    if (!specificuserCartitem) {
      return res
        .status(401)
        .json(new apiError(false, `cart item not found`, 401, null));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          false,
          "Add to cart retrive Successfull",
          200,
          specificuserCartitem
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Error from get user cart controller  ${error}`,
          501,
          null
        )
      );
  }
};
module.exports = { addtoCart, getAllCartItem, deltecartItem, usercartitem };
