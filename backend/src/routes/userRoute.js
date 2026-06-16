import express from "express";

import {
  registerUser,
  loginUser,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// TEMP TEST USER ROUTE
router.get(
  "/profile",
  authMiddleware,
  (req, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  }
);

// TEMP TEST ADMIN ROUTE
router.get(
  "/admin-test",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

export default router;





// import express from "express";

// import { registerUser, loginUser } from "../controllers/userController.js";

// const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", loginUser);

// export default router;