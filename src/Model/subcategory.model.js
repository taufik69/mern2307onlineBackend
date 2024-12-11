const mongoose = require("mongoose");
const { Schema } = mongoose;

const subcategorySchmea = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("subcategory", subcategorySchmea);
