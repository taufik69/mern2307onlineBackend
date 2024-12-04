const express = require("express");
const {
  registration,
  login,
  verifyOtp,
  resendOpt,
  resetPassword,
} = require("../../Controller/user.controller");
const { Router } = express;
const _ = Router();
_.route("/registration").post(registration);
_.route("/login").post(login);
_.route("/verifyotp").post(verifyOtp);
_.route("/resendOtp").post(resendOpt);
_.route("/resetpassword").post(resetPassword);
module.exports = _;
