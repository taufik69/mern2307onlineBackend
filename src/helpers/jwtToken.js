const jwt = require("jsonwebtoken");
const generateToken = async (payload) => {
  try {
    const token = await jwt.sign(payload, process.env.JWTSECTECT, {
      expiresIn: "10h",
    });
    return token;
  } catch (error) {
    console.log("Error from Generate web token", error);
  }
};

module.exports = { generateToken };
