import crypto from "crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Find Order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Order should belong to logged-in user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Only Razorpay orders should hit this API
    if (order.paymentMethod !== "Razorpay") {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // Prevent duplicate payment
    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already completed",
      });
    }

    // Verify Razorpay Order ID
    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay Order ID",
      });
    }

    // Verify Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      order.paymentStatus = "failed";
      order.paymentFailureReason = "Signature verification failed";

      await order.save();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Check stock before reducing
    for (const item of order.orderItems) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `${item.name} not found`,
        });
      }

      if (product.stock < item.quantity) {
        order.paymentStatus = "failed";
        order.paymentFailureReason = `${item.name} is out of stock`;

        await order.save();

        return res.status(400).json({
          success: false,
          message: `${item.name} is out of stock`,
        });
      }
    }

    // Reduce stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.productId);

      product.stock -= item.quantity;
      await product.save();
    }

    // Clear user's cart
    const user = await User.findById(order.userId);

    if (user) {
      user.cartItems = [];
      await user.save();
    }

    // Update order
    order.paymentStatus = "paid";
    order.orderStatus = "processing";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paidAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};