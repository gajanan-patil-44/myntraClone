import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    // console.log(req.headers.authorization);

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

// console.log("URL:", req.originalUrl);
// console.log("TOKEN:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
  console.error(error);

  return res.status(401).json({
    success: false,
    message: "Invalid or expired token.",
  });
  }
}
export default authMiddleware;