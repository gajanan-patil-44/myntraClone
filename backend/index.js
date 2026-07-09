import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./src/config/db.js";
import userRoute from "./src/routes/userRoute.js";
import productRoute from "./src/routes/productRoute.js";
import cartRoute from "./src/routes/cartRoute.js";
import orderRoute from "./src/routes/orderRoute.js";
import wishlistRoute from "./src/routes/wishlistRoute.js";

import authRoute from "./src/routes/authRoute.js";
import reviewRoute from "./src/routes/reviewRoute.js";
import paymentRoute from "./src/routes/paymentRoute.js";
dotenv.config();

const app = express();
await connectDB();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,}
));

app.use(express.json());

app.use(cookieParser());

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api", wishlistRoute);

app.use("/api/auth", authRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/payments", paymentRoute);

app.get("/", (req, res) => {
  res.json({
    message: "Myntra Clone API Running",
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});