const jwt = require("jsonwebtoken");

/**
 * Utility class for JWT token operations
 */
class JwtUtil {
  static sign(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });
  }

  static verify(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  static getAuth(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    const split = token.split(" ");

    if (split.length !== 2) {
      return res.status(401).send("Unauthorized");
    }

    const user = JwtUtil.verify(split[1]);

    req.email = user.email;

    next();
  }
}

module.exports = JwtUtil;
