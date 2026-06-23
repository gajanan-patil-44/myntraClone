import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import { seedProducts } from "./seedProduct1.js";

await connectDB();

await seedProducts();

process.exit();