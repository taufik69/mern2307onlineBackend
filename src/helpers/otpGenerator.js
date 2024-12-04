const { aleaRNGFactory } = require("number-generator");

const OtpGenerator = () => {
  try {
    const otp = aleaRNGFactory(new Date());
    return otp.uInt32().toString().slice(0, 4);
  } catch (error) {
    console.log("Error from otpGenerator fucntion ", error);
  }
};

module.exports = { OtpGenerator };
