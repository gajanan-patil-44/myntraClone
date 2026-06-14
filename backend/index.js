import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./src/config/db.js";
import userRoute from "./src/routes/userRoute.js";

dotenv.config();

const app = express();

await connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.json({
    message: "Myntra Clone API Running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});