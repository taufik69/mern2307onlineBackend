const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  rating: {
    type: Number,
    max: 5,
    default: 0,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  reviews: [
    {
      type: String,
      trim: true,
    },
  ],
  category: {
    type: Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: "subcategory",
    required: true,
  },
  image: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("product", productSchema);
