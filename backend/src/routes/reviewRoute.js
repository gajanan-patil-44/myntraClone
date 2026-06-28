import express from "express";
import { getProductReviews } from "../controllers/reviewController.js";

const router = express.Router();

// Public
router.get("/product/:productId", getProductReviews);

export default router;