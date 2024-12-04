const jwt = require("jsonwebtoken");
const generateToken = async (payload) => {
  try {
    const token = await jwt.sign(payload, "mern2307Online", {
      expiresIn: "1h",
    });
    return token;
  } catch (error) {
    console.log("Error from Generate web token", error);
  }
};

module.exports = { generateToken };
