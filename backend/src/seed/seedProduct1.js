import axios from "axios";
import Product from "../models/Product.js";

const sizeOptions = ["S", "M", "L", "XL"];
const colorOptions = ["Black", "White", "Blue", "Red"];

function mapCategory(dummyCategory) {
  switch (dummyCategory) {

    case "smartphones":
      return {
        category: "Electronics",
        subCategory: "Mobiles",
      };

    case "laptops":
      return {
        category: "Electronics",
        subCategory: "Laptops",
      };

    case "mens-shirts":
      return {
        category: "Men",
        subCategory: "T-Shirts",
      };

    case "mens-shoes":
      return {
        category: "Men",
        subCategory: "Sports Wear",
      };

    case "womens-dresses":
      return {
        category: "Women",
        subCategory: "Dresses",
      };

    case "womens-shoes":
      return {
        category: "Women",
        subCategory: "Ethnic Wear",
      };

    case "beauty":
      return {
        category: "Beauty",
        subCategory: "Skincare",
      };

    case "fragrances":
      return {
        category: "Beauty",
        subCategory: "Haircare",
      };

    case "furniture":
      return {
        category: "Home",
        subCategory: "Decor",
      };

    default:
      return {
        category: "Home",
        subCategory: "Kitchen",
      };
  }
}

export async function seedProducts() {
  try {

    const { data } = await axios.get(
      "https://dummyjson.com/products?limit=194"
    );

    const products = data.products.map((product) => {

      const { category, subCategory } =
        mapCategory(product.category);

      return {
        name: product.title,
        description: product.description,
        category,
        subCategory,
        brand: product.brand || "Generic",

        price: product.price,

        discountPrice: Math.round(
          product.price *
            (1 - product.discountPercentage / 100)
        ),

        stock: product.stock,

        sizes:
          category === "Men" || category === "Women"
            ? sizeOptions
            : [],

        colors:
          category === "Electronics"
            ? ["Black", "White"]
            : colorOptions,

        images: product.images,

        averageRating: product.rating,

        reviewsCount: Math.floor(
          Math.random() * 500
        ),

        isActive: true,
      };
    });

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log(`${products.length} products inserted`);

  } catch (error) {
    console.log(error.message);
  }
}