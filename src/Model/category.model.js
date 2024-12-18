const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    subcategory: [
      {
        type: Types.ObjectId,
        ref: "subcategory",
      },
    ],

    product: [
      {
        type: Types.ObjectId,
        ref: "product",
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("category", categorySchema);
