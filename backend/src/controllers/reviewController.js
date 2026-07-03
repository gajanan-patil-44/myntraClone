import Review from "../models/Review.js";
import Product from "../models/Product.js";

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate("userId", "firstName lastName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createOrUpdateReview = async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId, rating, comment } = req.body;

    let review = await Review.findOne({
      userId,
      productId,
    });

    if (review) {
      review.rating = rating;
      review.comment = comment;

      await review.save();
    } else {
      review = await Review.create({
        userId,
        productId,
        rating,
        comment,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review saved successfully",
      review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateRating = async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId, rating } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Product ID and rating are required",
      });
    }

    let review = await Review.findOne({
      userId,
      productId,
    });

    if (review) {
      review.rating = rating;
      await review.save();
    } else {
      review = await Review.create({
        userId,
        productId,
        rating,
        comment: "",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rating updated successfully",
      review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      userId: req.user._id,
    });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};