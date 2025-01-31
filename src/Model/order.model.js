const mongoose = require("mongoose");
const { Types, model, Schema } = mongoose;
const orderSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "user",
  },
  cartItem: [{ type: Types.ObjectId, ref: "cart" }],
  customerInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      trim: true,
    },
    adress1: {
      type: String,
      required: true,
      trim: true,
    },
    adress2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    postcode: {
      type: Number,
      trim: true,
    },
  },
  payemntinfo: {
    payementmethod: {
      type: String,
      required: true,
      trim: true,
      default: "cash on delivery",
    },
    paymentStatus: {
      type: Boolean,
      default: false,
    },
    trans_id: {
      type: String,
      trim: true,
    },
    val_id: {
      type: String,
      trim: true,
    },
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "cancle", "failed", "delivered", "processing"],
  },
  totalPrice: {
    type: Number,
  },
  totalitem: {
    type: Number,
  },
});

module.exports = model("order", orderSchema);
