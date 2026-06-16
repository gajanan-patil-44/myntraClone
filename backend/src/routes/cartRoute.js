import express from "express";
import { addToCart } from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ADD TO CART
router.post("/add", authMiddleware, addToCart);

export default router;