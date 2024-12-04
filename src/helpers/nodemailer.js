const nodemailer = require("nodemailer");
const { emailTemplate } = require("../helpers/Template");
// configure node mailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.HOST_MAIL,
    pass: process.env.APP_PASSWORD,
  },
});

// make a emailSend functionn

const sendEmail = async (email, Otp, firstName) => {
  try {
    const info = await transporter.sendMail({
      from: "Es MERN 2307  👻",
      to: email,
      subject: "Verification Email ✔",
      html: emailTemplate(Otp, "http:localhost:4000/verifyotp", firstName),
    });

    const { accepted } = info;
    return accepted;
  } catch (error) {
    console.log("Error from node mailer sendEmail Function", error);
  }
};

module.exports = { sendEmail };
