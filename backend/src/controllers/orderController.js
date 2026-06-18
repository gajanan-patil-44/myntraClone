import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

/**
 * CREATE ORDER
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItems = user.cartItems;

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

      const price = product.discountPrice > 0 ? product.discountPrice : product.price;

      subtotal += price * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        image: product.images?.[0],
        priceAtPurchase: price,
        quantity: item.quantity,
      });

      // reduce stock immediately (reservation logic)
      product.stock -= item.quantity;
      await product.save();
    }

    // 2. Address validation
    const address = user.address;

    if (!address || !address.street || !address.city || !address.state || !address.pincode) {
      return res.status(400).json({
        message: "Shipping address incomplete",
      });
    }

    const shippingPrice = subtotal > 999 ? 0 : 50;
    const taxPrice = Math.round(subtotal * 0.18);
    const totalPrice = subtotal + shippingPrice + taxPrice;

    // 3. Create order
    const order = await Order.create({
      userId,
      orderItems,
      shippingAddress: address,
      subtotal,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentMethod: "COD",
      paymentStatus: "pending",
      orderStatus: "processing",
    });

    // 4. Clear cart
    user.cartItems = [];
    await user.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

