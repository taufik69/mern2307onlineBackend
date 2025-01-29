const mongoose = require("mongoose");
const { Schema, Types, model } = mongoose;

const cartSchmea = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "user",
    required: [true, "user id required"],
  },
  product: {
    type: Types.ObjectId,
    ref: "product",
  },

  qunatity: {
    type: Number,
    required: true,
    default: 1,
  },
});

module.exports = model("cart", cartSchmea);
