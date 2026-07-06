import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  // updateOrderStatus,
  updateOrderItemStatus,
  getAdminOrderById,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/my", authMiddleware, getMyOrders);
router.get("/admin/all", authMiddleware, adminMiddleware, getAllOrders);

// router.patch(
  //   "/admin/:id/status",
  //   authMiddleware,
  //   adminMiddleware,
  //   updateOrderStatus,
  // );
  router.patch(
    "/admin/:orderId/items/:itemId/status",
    authMiddleware,
    adminMiddleware,
    updateOrderItemStatus
  );
  
  router.get("/admin/:id", authMiddleware, adminMiddleware, getAdminOrderById);
  router.get("/:id", authMiddleware, getOrderById);

export default router;
