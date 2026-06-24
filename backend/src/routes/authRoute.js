import express from "express";
import { sendOtp, verifyOtpLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpLogin);

export default router;