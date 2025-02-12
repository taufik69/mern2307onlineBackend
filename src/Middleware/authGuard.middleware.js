const jwt = require("jsonwebtoken");

// invalid token - synchronous
const authGuard = async (req, res, next) => {
  try {
    if (req.headers.cookie) {
      const cookie = req.headers.cookie;
      const token = cookie.replace("token=", "").trim();
      const decoded = jwt.verify(token, process.env.JWTSECTECT);

      if (!decoded) {
        return res.status(401).josn({ msg: "Your Token is Invalid " });
      }
      req.user = decoded;
      next();
    } else if (req.headers.authorization) {
      const Bearartoken = req.headers.authorization;
      const token = Bearartoken.replace("Bearar", "").trim();
      const decoded = jwt.verify(token, process.env.JWTSECTECT);
      if (!decoded) {
        return res.status(401).josn({ msg: "Your Token is Invalid " });
      }
      req.user = decoded;
      next();
    } else {
      res.status(401).josn({ msg: "Your Token is Missing " });
    }
  } catch (error) {
    console.error("from authguard middleware", error.message);
  }
};

module.exports = { authGuard };
