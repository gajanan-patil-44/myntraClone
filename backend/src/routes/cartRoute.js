import express from "express";
import { addToCart,getCart } from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ADD TO CART
router.post("/add", authMiddleware, addToCart);

// GET CART
router.get("/", authMiddleware, getCart);

export default router;