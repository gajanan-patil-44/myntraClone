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
    // console.log("USER ID:", user._id);
    // console.log("CART ITEMS FROM DB:", user.cartItems);

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

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 });
    // console.log(JSON.stringify(orders[0], null, 2));
    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.orderStatus = orderStatus;

    // Update COD payment status
    if (order.paymentMethod === "COD") {
      order.paymentStatus = orderStatus === "delivered" ? "paid" : "pending";
    }

    order.orderItems = order.orderItems.map((item) => ({
      ...item.toObject(),
      orderStatus,
      deliveredAt: orderStatus === "delivered" ? new Date() : item.deliveredAt,
    }));

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAdminOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("userId", "firstName lastName email")
      .populate("orderItems.productId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderItemStatus = async (req, res) => {
  // console.log("===== updateOrderItemStatus called =====");
  try {
    const { orderId, itemId } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const item = order.orderItems.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Order item not found.",
      });
    }

    item.orderStatus = orderStatus;

    if (orderStatus === "delivered") {
      item.deliveredAt = new Date();
    }
    const statuses = order.orderItems.map((item) => item.orderStatus);

// Calculate overall order status
if (statuses.every((status) => status === "delivered")) {
  order.orderStatus = "delivered";
} else if (statuses.every((status) => status === "cancelled")) {
  order.orderStatus = "cancelled";
} else if (statuses.some((status) => status === "shipped")) {
  order.orderStatus = "shipped";
} else if (statuses.some((status) => status === "processing")) {
  order.orderStatus = "processing";
} else {
  order.orderStatus = "pending";
}

// COD payment status
if (order.paymentMethod === "COD") {
  if (order.orderStatus === "delivered") {
    order.paymentStatus = "paid";
    order.paidAt = new Date();
  } else {
    order.paymentStatus = "pending";
    order.paidAt = null;
  }
}
    await order.save();
    const updatedOrder = await Order.findById(orderId);
    const updatedItem = updatedOrder.orderItems.id(itemId);

    // console.log("After save:", updatedItem.orderStatus);
    return res.status(200).json({
      success: true,
      message: "Order item updated successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [
  totalProducts,
  totalOrders,
  totalUsers,
  revenueResult,
  recentOrders,
] = await Promise.all([
  Product.countDocuments(),

  Order.countDocuments(),

  User.countDocuments({ role: "user" }),

  Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
  ]),

  Order.find()
    .populate("userId", "firstName lastName email")
    .sort({ createdAt: -1 })
    .limit(5),
]);

const totalRevenue =
  revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

return res.status(200).json({
  success: true,

  stats: {
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue,
  },

  recentOrders,
});

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};