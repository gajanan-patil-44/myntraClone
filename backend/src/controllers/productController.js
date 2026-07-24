import Product from "../models/Product.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

//for all active products (public)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all products for admin (includes active + inactive)
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//for single product (public)

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id, isActive: true });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// admin routes for create, update, delete products will be implemented in adminController.js
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subCategory,
      brand,
      price,
      discountPrice,
      stock,
      sizes,
      colors,
      isActive,
    } = req.body;
    const uploadedImages = [];
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);
        uploadedImages.push(result.secure_url);
      }
    }
    console.log("uploadedImages:", uploadedImages);
    // Required fields validation
    if (
      !name ||
      !description ||
      !category ||
      !subCategory ||
      !brand ||
      price === undefined ||
      price < 0 ||
      stock === undefined ||
      stock < 0 ||
      uploadedImages.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory.",
      });
    }

    const product = await Product.create({
      name,
      description,
      category,
      subCategory,
      brand,
      price,
      discountPrice,
      stock,
      sizes,
      colors,
      images: uploadedImages,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update product - a  dmin only
export const updateProduct = async (req, res) => {
  try {
    // console.log('UPDATE PRODUCT HIT');

    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (
      req.body.averageRating !== undefined ||
      req.body.reviewsCount !== undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "averageRating and reviewsCount cannot be updated manually.",
      });
    }

    const updateData = { ...req.body };
    // Existing image URLs coming from frontend
    let existingImages = req.body.existingImages || [];

    // If only one image was sent, convert it to an array
    if (!Array.isArray(existingImages)) {
      existingImages = [existingImages];
    }

    // Upload newly selected images
    const uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);
        uploadedImages.push(result.secure_url);
      }
    }
// Delete removed Cloudinary images
const removedImages = product.images.filter(
  (image) => !existingImages.includes(image)
);

for (const image of removedImages) {
  await deleteFromCloudinary(image);
}
    // Merge existing + newly uploaded images
    updateData.images = [...existingImages, ...uploadedImages];
    if (updateData.stock !== undefined && Number(updateData.stock) === 0) {
      updateData.isActive = false;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// toggle product active status - admin only
export const toggleProductStatus = async (req, res) => {
  // console.log('TOGGLE HIT');

  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    product.isActive = !product.isActive;

    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product ${
        product.isActive ? "activated" : "deactivated"
      } successfully.`,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete product = admin only

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Delete Cloudinary images
for (const image of product.images) {
  await deleteFromCloudinary(image);
}

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Inventory Alerts

export const getInventoryAlerts = async (req, res) => {
  try {
    const products = await Product.find({
      stock: { $lte: 5 },
      // isActive: true,
    })
      .select("_id name stock images")
      .sort({ stock: 1 });

    const notifications = products.map((product) => ({
      _id: product._id,
      name: product.name,
      stock: product.stock,
      image: product.images?.[0] || "",
      status: product.stock === 0 ? "out_of_stock" : "low_stock",
    }));
console.log("Notifications:", notifications);
    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Get Inventory Alerts Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory alerts.",
    });
  }
};