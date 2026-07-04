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

    const platformFee = cartItems.length > 0 ? 20 : 0;
    const shippingPrice = 0;
    const taxPrice = 0;
    const totalPrice = subtotal + platformFee;

    // Check if user already has a pending Razorpay order
    if (paymentMethod === "Razorpay") {
      const existingOrder = await Order.findOne({
        userId,
        paymentMethod: "Razorpay",
        paymentStatus: "pending",
      });

      if (existingOrder) {
        const sameCart =
          existingOrder.orderItems.length === orderItems.length &&
          existingOrder.orderItems.every((orderItem) =>
            orderItems.some(
              (cartItem) =>
                cartItem.productId.toString() ===
                  orderItem.productId.toString() &&
                cartItem.quantity === orderItem.quantity &&
                cartItem.size === orderItem.size &&
                cartItem.color === orderItem.color,
            ),
          );

        const sameAddress =
          existingOrder.shippingAddress.address === address.address &&
          existingOrder.shippingAddress.pincode === address.pincode &&
          existingOrder.shippingAddress.phone === address.phone;

        const canReuseOrder = sameCart && sameAddress;

        if (!canReuseOrder) {
          await existingOrder.deleteOne();
        } else {
          let razorpayOrder;

          try {
            razorpayOrder = await razorpay.orders.fetch(
              existingOrder.razorpayOrderId,
            );
          } catch (error) {
            // Razorpay order no longer exists, remove stale pending order
            await existingOrder.deleteOne();
          }

          if (razorpayOrder) {
            return res.status(200).json({
              success: true,
              paymentType: "Razorpay",
              key: process.env.RAZORPAY_KEY_ID,
              order: existingOrder,
              razorpayOrder,
              customer: {
                name: user.name,
                email: user.email,
                contact: address.phone,
              },
            });
          }

          return res.status(200).json({
            success: true,
            paymentType: "Razorpay",
            key: process.env.RAZORPAY_KEY_ID,
            order: existingOrder,
            razorpayOrder,
            customer: {
              name: user.name,
              email: user.email,
              contact: address.phone,
            },
          });
        }
      }
    }
    // 3. Create MongoDB order
    const order = {
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
      platformFee,
      shippingPrice,
      totalPrice,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
    };

    // =======================
    // COD FLOW
    // =======================
    if (paymentMethod === "COD") {
      const createdOrder = await Order.create(order);
      for (const item of createdOrder.orderItems) {
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
        order: createdOrder,
      });
    }

    // =======================
    // RAZORPAY FLOW
    // =======================

    const createdOrder = await Order.create(order);

    const razorpayOrder = await razorpay.orders.create({
      amount: createdOrder.totalPrice * 100,
      currency: "INR",
      receipt: createdOrder._id.toString(),
    });

    createdOrder.razorpayOrderId = razorpayOrder.id;
    await createdOrder.save();

    return res.status(201).json({
      success: true,
      paymentType: "Razorpay",
      key: process.env.RAZORPAY_KEY_ID,
      order: createdOrder,
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
  const orders = await Order.find({
    userId: req.user.id,
    $or: [
      { paymentMethod: "COD" },
      { paymentMethod: "Razorpay", paymentStatus: "paid" },
    ],
  }).sort({
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
