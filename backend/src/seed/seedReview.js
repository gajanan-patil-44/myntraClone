import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

dotenv.config();

const seedReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing reviews
    await Review.deleteMany();

    // Users
    const gajanan = await User.findOne({
      email: "user@myntra.com",
    });

    const firstUser = await User.findOne({
      email: "firstuser@myntra.com",
    });

    const secondUser = await User.findOne({
      email: "seconduser@myntra.com",
    });

    const thirdUser = await User.findOne({
      email: "thirduser@myntra.com",
    });

    // Products
    const nike = await Product.findOne({
      name: "Nike Dry Fit T-Shirt",
      brand: "Nike",
    });

    const adidas = await Product.findOne({
      name: "Adidas Classic Tee",
      brand: "Adidas",
    });

    const levis = await Product.findOne({
      name: "Levi's Casual Shirt",
      brand: "Levis",
    });

    const zara = await Product.findOne({
      name: "Zara Slim Fit Shirt",
      brand: "Zara",
    });

    const puma = await Product.findOne({
      name: "Puma Blue Jeans",
      brand: "Puma",
    });

    const reviews = [
      {
        userId: gajanan._id,
        productId: nike._id,
        rating: 5,
        comment: "Excellent quality and very comfortable for workouts.",
      },
      {
        userId: firstUser._id,
        productId: adidas._id,
        rating: 4,
        comment: "Soft fabric and perfect fitting for daily wear.",
      },
      {
        userId: secondUser._id,
        productId: levis._id,
        rating: 5,
      },
      {
        userId: thirdUser._id,
        productId: zara._id,
        rating: 4,
      },
      {
        userId: gajanan._id,
        productId: puma._id,
        rating: 5,
      },
    ];

    await Review.insertMany(reviews);

    console.log("Reviews seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding reviews:", error);
    process.exit(1);
  }
};

seedReviews();