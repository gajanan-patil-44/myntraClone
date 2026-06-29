import express from "express";
import { addToCart,getCart,updateCartQuantity,removeCartItem,updateCartItemVariant } from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ADD TO CART
router.post("/add", authMiddleware, addToCart,);

// GET CART
router.get("/", authMiddleware, getCart);

// UPDATE CART QUANTITY
router.patch("/:cartItemId", authMiddleware, updateCartQuantity)

// UPDATE CART ITEM VARIANT (SIZE / COLOR)
router.patch("/:cartItemId/variant",authMiddleware,updateCartItemVariant);

// REMOVE CART ITEM
router.delete("/:cartItemId", authMiddleware, removeCartItem,);


export default router;
