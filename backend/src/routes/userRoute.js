import express from "express";

import {registerUser,loginUser,updateProfile,updateAdress} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/profile", authMiddleware, updateProfile);
router.put("/address",authMiddleware,updateAddress); // Update user address 
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
