const { ApiResponse } = require("../Utils/Apiresponse");
const { apiError } = require("../Utils/ApiErrorResponse");
const usermodel = require("../Model/User.model");
const { resetEmail } = require("../helpers/resetSendMail");
const {
  emailValidator,
  passwordChecker,
  numberCheker,
} = require("../helpers/helper");
const { encryptPassword, decreptedPassword } = require("../helpers/brypt");
const { sendEmail } = require("../helpers/nodemailer");
const { OtpGenerator } = require("../helpers/otpGenerator");
const { generateToken } = require("../helpers/jwtToken");

const registration = async (req, res) => {
  try {
    const { firstName, email, phoneNumber, password } = req.body;

    if (!firstName || !email || !phoneNumber || !password) {
      return res
        .status(401)
        .json(
          new apiError(false, `Registration Credential Missing !!`, 401, null)
        );
    }

    if (
      !emailValidator(email) ||
      !passwordChecker(password) ||
      !numberCheker(phoneNumber)
    ) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            `Email format or password or Phone number invalid !!`,
            401,
            null
          )
        );
    }

    const hashPassword = await encryptPassword(password);
    const Otp = OtpGenerator();

    // send a verification to user
    const sendEmailInfo = await sendEmail(email, Otp, firstName);
    if (!sendEmailInfo?.length) {
      return res
        .status(501)
        .json(
          new apiError(false, "Failed to send Verification Eamil", 501, null)
        );
    }
    const otpExpireTime = new Date().getTime() + 10 * 60 * 1000;

    // save the user info of database
    const saveUserInfo = await usermodel.create({
      firstName: firstName,
      email: email,
      phoneNumber: phoneNumber,
      password: hashPassword,
      otp: Otp,
      otpExpireTime: otpExpireTime,
    });
    if (saveUserInfo) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            false,
            "User Registration Sucessfull",
            200,
            saveUserInfo
          )
        );
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Error from registraion controller  ${error}`,
          501,
          null
        )
      );
  }
};

// login controller
const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    const isRegisterUser = await usermodel.findOne({
      $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
    });
    if (!isRegisterUser) {
      return res
        .status(401)
        .json(
          new apiError(false, `You are not SignUP First Sign Up!!`, 401, null)
        );
    }

    const isPasswordRight = await decreptedPassword(
      password,
      isRegisterUser.password
    );
    if (!isPasswordRight) {
      return res
        .status(401)
        .json(new apiError(false, `Your password or email Wrong!!`, 401, null));
    }
    const tokenPaylod = {
      id: isRegisterUser._id,
      phone: isRegisterUser.phoneNumber,
      email: isRegisterUser.email,
    };

    // make toknen
    const token = await generateToken(tokenPaylod);
    if (token) {
      return res
        .status(200)
        .cookie("token", token, { httpOnly: true, secure: false })
        .json(
          new ApiResponse(false, "User Login Sucessfull", 200, {
            token: `Bearar ${token}`,
            name: isRegisterUser.firstName,
            email: isRegisterUser.email,
          })
        );
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, `Error from login controller  ${error}`, 501, null)
      );
  }
};

// verify otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(401)
        .json(new apiError(false, `Your email or Otp Missing!!`, 401, null));
    }

    const checkIsUserAlradyRegister = await usermodel.findOne({ email: email });

    if (checkIsUserAlradyRegister) {
      if (
        checkIsUserAlradyRegister.otp === parseInt(otp) &&
        new Date().getTime() <= checkIsUserAlradyRegister.otpExpireTime
      ) {
        // remove otp and otpExpireTime removed from database
        checkIsUserAlradyRegister.otp = null;
        checkIsUserAlradyRegister.otpExpireTime = null;
        checkIsUserAlradyRegister.isVerified = true;
        await checkIsUserAlradyRegister.save();

        return res
          .status(200)
          .json(new ApiResponse(false, "User Verified Sucessfull", 200, null));
      }
      // else {
      //   // remove otp and otpExpireTime removed from database
      //   checkIsUserAlradyRegister.otp = null;
      //   checkIsUserAlradyRegister.otpExpireTime = null;
      //   await checkIsUserAlradyRegister.save();
      return res
        .status(401)
        .json(new ApiResponse(false, "Otp Not Match ", 200, null));
      // }
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Error from verifyOtp controller  ${error}`,
          501,
          null
        )
      );
  }
};

// resend otp
const resendOpt = async (req, res) => {
  try {
    const { email } = req.body;
    const isRegisterUser = await usermodel.findOne({ email });
    if (!isRegisterUser) {
      return res
        .status(501)
        .json(new apiError(false, `Email Not Found `, 501, null));
    }
    // generate new Otp
    const otp = OtpGenerator();
    // now send mail
    const sendemail = await sendEmail(email, otp, "ResendOtp");
    if (sendemail) {
      isRegisterUser.otp = otp;
      isRegisterUser.otpExpireTime = new Date().getTime() + 10 * 60 * 60 * 1000;
      await isRegisterUser.save();
      return res
        .status(200)
        .json(
          new ApiResponse(false, "Otp Resend Sucessfull Check email", 200, null)
        );
    }
    return res
      .status(501)
      .json(new apiError(false, `Otp Resend Failed !!`, 501, null));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Error from resendOpt controller  ${error}`,
          501,
          null
        )
      );
  }
};

// forgot password
const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            `forgotpassword password  credential Missing!! `,
            401,
            null
          )
        );
    }

    const finduser = await usermodel.findOne({ email: email });
    if (!finduser) {
      return res.status(301).redirect("http://localhost:5173/login");
    }

    // send a verification to user
    const resetEmailinfo = await resetEmail(email, finduser.firstName);
    if (!resetEmailinfo?.length) {
      return res
        .status(501)
        .json(
          new apiError(false, "Failed to send Verification Eamil", 501, null)
        );
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Error from forgot password controller  ${error}`,
          501,
          null
        )
      );
  }
};
// reset password controller
const resetPassword = async (req, res) => {
  try {
    const { email, password, confrimPassword } = req.body;
    // validatoin the user input
    if (!email || !password || !confrimPassword) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            `Reset password  credential Missing!! `,
            401,
            null
          )
        );
    }
    if (password !== confrimPassword) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            `Password and confrim password does not match Try agian!! `,
            401,
            null
          )
        );
    }

    // check is email is right or wrong
    if (!emailValidator(email)) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            `Reset password  credential Missing!! `,
            401,
            null
          )
        );
    }

    // now search the email in database
    const user = await usermodel.findOne({ email: email });
    if (!user) {
      return res
        .status(401)
        .json(
          new apiError(false, `User Not found Try actual email!! `, 401, null)
        );
    }

    //  now encrypt the new password
    const newEncryptedPassword = await encryptPassword(password);
    user.password = newEncryptedPassword;
    user.save();
    return res
      .status(200)
      .json(new ApiResponse(false, "Reset pasword Sucesfully", 200, null));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Error from resetPassword controller  ${error}`,
          501,
          null
        )
      );
  }
};

module.exports = {
  registration,
  login,
  verifyOtp,
  resendOpt,
  resetPassword,
  forgotpassword,
};
