const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchmea = new Schema(
  {
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
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    adress1: {
      type: String,

      trim: true,
    },
    adress2: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "marchant"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
    },
    otpExpireTime: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const usermodel = mongoose.model("user", userSchmea);
module.exports = usermodel;
