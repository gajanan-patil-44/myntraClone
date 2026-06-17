import User from "../models/User.js";
import Product from "../models/Product.js";

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity,size,color } = req.body;

    // 1. Validate input
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Invalid productId or quantity",
      });
    }

    // 2. Check product exists
    const product = await Product.findById(productId);

    // Size validation
    if (
      product.sizes.length > 0 &&
      !size
    ) {
      return res.status(400).json({
        message: "Size is required for this product",
      });
    }

    if (size && !product.sizes.includes(size)) 
      {
    return res.status(400).json({
    message: "Invalid size selected",
  });
}

// Color validation
    if (
      product.colors.length > 0 &&
      !color
    ) {
      return res.status(400).json({
        message: "Color is required for this product",
      });
    }

    if (color && !product.colors.includes(color)) 
      {
    return res.status(400).json({
    message: "Invalid color selected",
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

    // 4.1 Validate size and color
    if (!size || !color) {
       return res.status(400).json({
    message: "Size and color are required",
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
    const existingItem = user.cartItems.find((item) =>
    item.productId.toString() === productId &&
    item.size === (size || null) &&
    item.color === (color || null)
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
        size: size || null,
        color: color || null,
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
        cartItemId: item._id,
        productId: product._id,
        name: product.name,
        image: product.images[0],

        size: item.size,
        color: item.color,

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

// UPDATE CART QUANTITY
export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { action } = req.body;

    // Validate action
    if (
      action !== "increase" &&  action !== "decrease") 
      {
        return res.status(400).json({
        message: "Invalid action",
      });
    }

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Find cart item
    const cartItem = user.cartItems.find(
      (item) =>
        item.productId.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    // Increase
    if (action === "increase") {
      if (cartItem.quantity >= product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} items available in stock`,
        });
      }

      cartItem.quantity += 1;
    }

    // Decrease
    if (action === "decrease") {
      if (cartItem.quantity <= 1) {
        return res.status(400).json({
          message:
            "Quantity cannot be less than 1. Remove item instead.",
        });
      }

      cartItem.quantity -= 1;
    }

    await user.save();

    return res.status(200).json({
      message: "Cart updated successfully",
      cartItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// REMOVE ITEM FROM CART
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const itemExists = user.cartItems.some(
      (item) =>
        item.productId.toString() === productId
    );

    if (!itemExists) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    user.cartItems = user.cartItems.filter(
      (item) =>
        item.productId.toString() !== productId
    );

    await user.save();

    return res.status(200).json({
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};