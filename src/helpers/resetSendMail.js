const nodemailer = require("nodemailer");
const { resetPasswordTemplate } = require("../helpers/Template");
// configure node mailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.HOST_MAIL,
    pass: process.env.APP_PASSWORD,
  },
});

// make a emailSend functionn

const resetEmail = async (email, firstName) => {
  try {
    const info = await transporter.sendMail({
      from: "Es MERN 2307  👻",
      to: email,
      subject: "Reset Your Password ✔",
      html: resetPasswordTemplate(
        `http://localhost:5173/resetpassword/${email}`,
        firstName
      ),
    });

    const { accepted } = info;
    return accepted;
  } catch (error) {
    console.log("Error from node mailer sendEmail Function", error);
  }
};

module.exports = { resetEmail };
