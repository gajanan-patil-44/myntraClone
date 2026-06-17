import express from "express";
import { addToCart,getCart,updateCartQuantity,removeCartItem } from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ADD TO CART
router.post("/add", authMiddleware, addToCart,);

// GET CART
router.get("/", authMiddleware, getCart);

// UPDATE CART QUANTITY
router.patch("/:productId", authMiddleware, updateCartQuantity)
export default router;

// REMOVE CART ITEM
router.delete("/:productId", authMiddleware, removeCartItem,);