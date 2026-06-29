import User from "../models/User.js";
import Product from "../models/Product.js";

/**
 * TOGGLE WISHLIST (Add / Remove)
 */
export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(userId);

    const exists = user.wishlistItems.includes(productId);

    if (exists) {
      user.wishlistItems = user.wishlistItems.filter(
        (id) => id.toString() !== productId
      );

      await user.save();

      return res.json({
        success: true,
        message: "Removed from wishlist",
      });
    } else {
      user.wishlistItems.push(productId);

      await user.save();

      return res.json({
        success: true,
        message: "Added to wishlist",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * GET WISHLIST
 */
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "wishlistItems",
      select: "name price discountPrice images brand category subCategory sizes colors stock isActive",
    });

    const wishlist = user.wishlistItems.map((p) => ({
  _id: p._id,
  name: p.name,
  price: p.price,
  discountPrice: p.discountPrice,
  image: p.images?.[0] || null,
  brand: p.brand,
  category: p.category,
  subCategory: p.subCategory,
  sizes: p.sizes || [],
  colors: p.colors || [],
  stock: p.stock,
  isActive: p.isActive,
}));

    res.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * MOVE TO CART
 */
export const moveToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity = 1, size = null, color = null } = req.body;

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: "User or Product not found" });
    }

    // remove from wishlist
    user.wishlistItems = user.wishlistItems.filter(
      (id) => id.toString() !== productId
    );

    // check cart
    const existingItem = user.cartItems.find(
      (item) =>
        item.productId.toString() === productId &&
        item.size === (size || null) &&
        item.color === (color || null)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cartItems.push({
        productId,
        quantity,
        size,
        color,
        image: product.images?.[0] || null,
      });
    }

    await user.save();

    res.json({
      success: true,
      message: "Moved to cart successfully",
      cart: user.cartItems,
      wishlist: user.wishlistItems,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};