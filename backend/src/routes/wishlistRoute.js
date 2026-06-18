import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {toggleWishlist,getWishlist,moveToCart,} from "../controllers/wishlistController.js";

const router = express.Router();

// Add - Remove wishlist
router.post(
  "/wishlist/:productId",
  authMiddleware,
  toggleWishlist
);

// Get wishlist
router.get(
  "/wishlist",
  authMiddleware,
  getWishlist
);

// Move to cart
router.post(
  "/wishlist/move-to-cart/:productId",
  authMiddleware,
  moveToCart
);

export default router;