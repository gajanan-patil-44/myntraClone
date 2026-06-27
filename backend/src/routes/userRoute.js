import express from "express";

import {registerUser,loginUser,updateProfile, logoutUser,addAddress, getAddresses, updateAddress, deleteAddress,} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/profile", authMiddleware, updateProfile);
router.post("/logout", authMiddleware, logoutUser);
router.get("/addresses", authMiddleware, getAddresses);
router.post("/addresses", authMiddleware, addAddress);
router.patch("/addresses/:addressId", authMiddleware, updateAddress);
router.delete("/addresses/:addressId", authMiddleware, deleteAddress);

// get user profile
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
