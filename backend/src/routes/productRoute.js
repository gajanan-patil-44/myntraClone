import express from "express";

import { getAllProducts, getProductById, createProduct, updateProduct,toggleProductStatus,deleteProduct, getAllProductsAdmin} from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// GET ALL PRODUCTS - ADMIN
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  getAllProductsAdmin
);

router.get("/", getAllProducts);
router.get("/:id", getProductById);

//CREATE PRODUCT - ONLY ADMIN
router.post("/",authMiddleware, adminMiddleware, upload.array("images", 10) ,createProduct); // This route protected and only accessible by admin.

// (patch) UPDATE PRODUCT - ONLY ADMIN
router.patch("/:id", authMiddleware, adminMiddleware, updateProduct); // This route protected and only accessible by admin.

// PATCH TOGGLE PRODUCT ACTIVE STATUS - ONLY ADMIN

router.patch("/:id/toggle-status", authMiddleware, adminMiddleware, toggleProductStatus); // This route protected and only accessible by admin.

// DELETE PRODUCT - ONLY ADMIN
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;