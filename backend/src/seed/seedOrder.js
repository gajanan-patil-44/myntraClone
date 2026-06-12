import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

dotenv.config();

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Order.deleteMany();

    // Users
    const gajanan = await User.findOne({
      email: "user@myntra.com",
    });

    const firstUser = await User.findOne({
      email: "firstuser@myntra.com",
    });

    // Products
    const nike = await Product.findOne({
      name: "Nike Dry Fit T-Shirt",
      brand: "Nike",
    });

    const puma = await Product.findOne({
      name: "Puma Blue Jeans",
      brand: "Puma",
    });

    const adidas = await Product.findOne({
      name: "Adidas Classic Tee",
      brand: "Adidas",
    });

    const zara = await Product.findOne({
      name: "Zara Slim Fit Shirt",
      brand: "Zara",
    });

    const orders = [
      {
        userId: gajanan._id,

        orderItems: [
          {
            productId: nike._id,
            name: nike.name,
            image: nike.images[0],
            priceAtPurchase: nike.discountPrice,
            quantity: 2,
          },
          {
            productId: puma._id,
            name: puma.name,
            image: puma.images[0],
            priceAtPurchase: puma.discountPrice,
            quantity: 1,
          },
        ],

        shippingAddress: {
          street: "Shivaji Nagar",
          city: "Kolhapur",
          state: "Maharashtra",
          pincode: "416003",
        },

        paymentMethod: "Razorpay",
        paymentStatus: "completed",
        orderStatus: "delivered",

        subtotal: 4197,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: 4197,
      },

      {
        userId: firstUser._id,

        orderItems: [
          {
            productId: adidas._id,
            name: adidas.name,
            image: adidas.images[0],
            priceAtPurchase: adidas.discountPrice,
            quantity: 1,
          },
          {
            productId: zara._id,
            name: zara.name,
            image: zara.images[0],
            priceAtPurchase: zara.discountPrice,
            quantity: 1,
          },
        ],

        shippingAddress: {
          street: "Street 1",
          city: "Kolhapur",
          state: "Maharashtra",
          pincode: "416001",
        },

        paymentMethod: "Razorpay",
        paymentStatus: "completed",
        orderStatus: "processing",

        subtotal: 2698,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: 2698,
      },
    ];

    await Order.insertMany(orders);

    console.log("Orders seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding orders:", error);
    process.exit(1);
  }
};

seedOrders();