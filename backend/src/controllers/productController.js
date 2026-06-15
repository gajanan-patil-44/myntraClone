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