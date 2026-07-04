import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/verify", authMiddleware, verifyPayment);

export default router;