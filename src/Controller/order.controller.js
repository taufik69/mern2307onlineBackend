const { ApiResponse } = require("../Utils/Apiresponse");
const { apiError } = require("../Utils/ApiErrorResponse");
const ordermodel = require("../Model/order.model");
const cartModel = require("../Model/cart.model");
const { OrderedBulkOperation } = require("mongodb");
// place order controller
const placeorder = async (req, res) => {
  try {
    const { customerInfo, payemntinfo } = req.body;

    const { adress1, city, district } = customerInfo;
    const { payementmethod } = payemntinfo;
    if (!adress1 || !city || !district) {
      return res
        .status(401)
        .json(new apiError(false, `Order Crendential  missing!!`, 401, null));
    }
    // take id from token
    const { id, email, phone } = req.user;
    // search cartmodel
    const userCartItem = await cartModel
      .find({ user: id })
      .populate({
        path: "user",
        select:
          "-password -role -isVerified  -otp -otpExpireTime -createdAt -updatedAt",
      })
      .populate({
        path: "product",
      });
    //  userCartItem
    const cartItem = userCartItem.reduce(
      (initailvalue, item) => {
        const { product } = item;
        initailvalue.cart.push(item._id);
        initailvalue.totalprice += product.price * item.qunatity;
        initailvalue.totalitem += item.qunatity;
        return initailvalue;
      },
      {
        cart: [],
        totalprice: 0,
        totalitem: 0,
      }
    );

    if (payementmethod === "cash") {
      // now save the order
      const order = new ordermodel({
        user: id,
        cartItem: cartItem.cart,
        customerInfo,
        payemntinfo,
        totalPrice: cartItem.totalprice,
        totalitem: cartItem.totalitem,
      }).save();
    }else{
        
    }
    res.send(cartItem);
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          false,
          `Error from place order   controller  ${error}`,
          501,
          null
        )
      );
  }
};

module.exports = { placeorder };
