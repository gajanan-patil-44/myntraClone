import express from "express";
import { getProductReviews, createOrUpdateReview, updateRating,getMyReviews } from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

// Public
router.get("/product/:productId", getProductReviews);
router.post("/", authMiddleware, createOrUpdateReview);
router.patch("/rating", authMiddleware, updateRating);
router.get("/my", authMiddleware, getMyReviews);

export default router;