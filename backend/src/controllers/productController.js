import Product from "../models/Product.js";

//for all active products (public)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({isActive: true});

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

    const product = await Product.findOne(
      { _id: id, isActive: true } );

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
      images,
      isActive,
    } = req.body;

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
      !images ||
      !Array.isArray(images) ||
      images.length === 0
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
      images,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};