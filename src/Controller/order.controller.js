const { ApiResponse } = require("../Utils/Apiresponse");
const { apiError } = require("../Utils/ApiErrorResponse");
const ordermodel = require("../Model/order.model");
const cartModel = require("../Model/cart.model");
const SSLCommerzPayment = require("sslcommerz-lts");

const store_id = "mern2679ce7f723dc3";
const store_passwd = "mern2679ce7f723dc3@ssl";
const is_live = false; //true for live, false for sandbox
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
      const order = await new ordermodel({
        user: id,
        cartItem: cartItem.cart,
        customerInfo,
        payemntinfo,
        totalPrice: cartItem.totalprice,
        totalitem: cartItem.totalitem,
      }).save();

      if (!order) {
        return res
          .status(501)
          .json(new ApiResponse(false, "Order placed failed", 501, null));
      }
      return res
        .status(200)
        .json(new ApiResponse(false, "Order placed Sucessfullly", 200, order));
    } else {
      const data = {
        total_amount: cartItem.totalprice,
        currency: "BDT",
        tran_id: "12325454",
        success_url: "http://localhost:4000/api/v1/success",
        fail_url: "http://localhost:4000/api/v1/fail",
        cancel_url: "http://localhost:4000/api/v1/cancel",
        ipn_url: "http://localhost:4000/api/v1/ipn",
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: "Customer Name",
        cus_email: "customer@example.com",
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
      };
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      sslcz.init(data).then((apiResponse) => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL;
        if (!GatewayPageURL) {
          throw new Error("gatewayPageUrl not provided");
        }
        new ordermodel({
          user: id,
          cartItem: cartItem.cart,
          customerInfo,
          payemntinfo,
          totalPrice: cartItem.totalprice,
          totalitem: cartItem.totalitem,
        }).save();

        console.log("Redirecting to: ", GatewayPageURL);
        res.status(200).json({ sslUrl: GatewayPageURL });
      });
    }
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
