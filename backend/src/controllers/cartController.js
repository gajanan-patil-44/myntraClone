import User from "../models/User.js";
import Product from "../models/Product.js";

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    // 1. Validate input
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Invalid productId or quantity",
      });
    }

    // 2. Check product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // 3. Check product active
    if (!product.isActive) {
      return res.status(400).json({
        message: "Product is not active",
      });
    }

    // 4. Stock validation (STRICT RULE)
    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} items available in stock`,
      });
    }

    // 5. Get user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 6. Check if product already in cart
    const existingItem = user.cartItems.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      // stock validation again
      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: `Cannot add more than ${product.stock} items`,
        });
      }

      existingItem.quantity = newQuantity;
    } else {
      user.cartItems.push({
        productId,
        quantity,
      });
    }

    // 7. Save user
    await user.save();

    return res.status(200).json({
      message: "Product added to cart successfully",
      cart: user.cartItems,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET CART
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("cartItems.productId");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let totalItems = 0;
    let cartTotal = 0;

    const cartItems = user.cartItems.map((item) => {
      const product = item.productId;

      const effectivePrice =
        product.discountPrice > 0
          ? product.discountPrice
          : product.price;

      const subtotal = effectivePrice * item.quantity;

      totalItems += item.quantity;
      cartTotal += subtotal;

      return {
        productId: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        discountPrice: product.discountPrice,
        effectivePrice,
        quantity: item.quantity,
        subtotal,
        isActive: product.isActive,
      };
    });

    return res.status(200).json({
      cartItems,
      totalItems,
      cartTotal,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};