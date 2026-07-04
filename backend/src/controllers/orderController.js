import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import razorpay from "../config/razorpay.js";

/**
 * CREATE ORDER
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId, paymentMethod } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItems = user.cartItems;
    // const cartItems = user.cartItems.map(item => item.toObject());
    console.log("USER ID:", user._id);
    console.log("CART ITEMS FROM DB:", user.cartItems);

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let orderItems = [];
    let subtotal = 0;

    // 1. Validate products + stock
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);

      if (!product || !product.isActive) {
        return res.status(400).json({
          message: `Product not available`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const price =
        product.discountPrice > 0 ? product.discountPrice : product.price;

      subtotal += price * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        image: product.images?.[0],
        priceAtPurchase: price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        orderStatus: "pending",
        deliveredAt: null,
      });
    }

    // 2. Address validation
    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const shippingPrice = subtotal > 999 ? 0 : 50;
    const taxPrice = Math.round(subtotal * 0.18);
    const totalPrice = subtotal + shippingPrice + taxPrice;

    // 3. Create MongoDB order
    const order = await Order.create({
      userId,
      orderItems,
      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        pincode: address.pincode,
        locality: address.locality,
        address: address.address,
        city: address.city,
        state: address.state,
        landmark: address.landmark,
        alternatePhone: address.alternatePhone,
        addressType: address.addressType,
      },
      subtotal,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    // =======================
    // COD FLOW
    // =======================
    if (paymentMethod === "COD") {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.productId);

        if (!product) continue;

        product.stock -= item.quantity;
        await product.save();
      }

      user.cartItems = [];
      await user.save();

      return res.status(201).json({
        success: true,
        paymentType: "COD",
        message: "Order placed successfully",
        order,
      });
    }

    // =======================
    // RAZORPAY FLOW
    // =======================
    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalPrice * 100,
      currency: "INR",
      receipt: order._id.toString(),
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.status(201).json({
      success: true,
      paymentType: "Razorpay",
      key: process.env.RAZORPAY_KEY_ID,
      order,
      razorpayOrder,
      customer: {
        name: user.name,
        email: user.email,
        contact: address.phone,
      },
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });

  res.json({ success: true, orders });
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  res.json({ success: true, order });
};
