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

dotenv.config();

const app = express();

await connectDB();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,}
));

app.use(express.json());

app.use(cookieParser());

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api", wishlistRoute);

app.get("/", (req, res) => {
  res.json({
    message: "Myntra Clone API Running",
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});