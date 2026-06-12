import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();

console.log(process.env.MONGO_URI);

await connectDB();

const products = [
  {
    name: "Nike Sports T-Shirt",
    description: "Comfortable cotton sports t-shirt.",
    category: "Men",
    subCategory: "T-Shirts",
    brand: "Nike",
    price: 1499,
    discountPrice: 999,
    stock: 50,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White"],
    images: ["nike-tshirt.jpg"],
  },

  {
    name: "Puma Round Neck T-Shirt",
    description: "Casual everyday wear t-shirt.",
    category: "Men",
    subCategory: "T-Shirts",
    brand: "Puma",
    price: 1299,
    discountPrice: 899,
    stock: 40,
    sizes: ["M", "L", "XL"],
    colors: ["Blue"],
    images: ["puma-tshirt.jpg"],
  },

  {
    name: "Levis Slim Fit Jeans",
    description: "Slim fit denim jeans.",
    category: "Men",
    subCategory: "Jeans",
    brand: "Levis",
    price: 2499,
    discountPrice: 1899,
    stock: 35,
    sizes: ["30", "32", "34", "36"],
    colors: ["Blue"],
    images: ["levis-jeans.jpg"],
  },

  {
    name: "Allen Solly Formal Shirt",
    description: "Formal office wear shirt.",
    category: "Men",
    subCategory: "Shirts",
    brand: "Allen Solly",
    price: 1999,
    discountPrice: 1499,
    stock: 25,
    sizes: ["M", "L", "XL"],
    colors: ["White"],
    images: ["formal-shirt.jpg"],
  },

  {
    name: "Adidas Hoodie",
    description: "Warm and comfortable hoodie.",
    category: "Men",
    subCategory: "Shirts",
    brand: "Adidas",
    price: 2999,
    discountPrice: 2299,
    stock: 20,
    sizes: ["M", "L", "XL"],
    colors: ["Grey"],
    images: ["adidas-hoodie.jpg"],
  },

  {
    name: "H&M Women's Top",
    description: "Stylish casual top.",
    category: "Women",
    subCategory: "Tops",
    brand: "H&M",
    price: 1199,
    discountPrice: 799,
    stock: 45,
    sizes: ["S", "M", "L"],
    colors: ["Pink"],
    images: ["hm-top.jpg"],
  },

  {
    name: "Biba Printed Dress",
    description: "Traditional printed dress.",
    category: "Women",
    subCategory: "Dresses",
    brand: "Biba",
    price: 2499,
    discountPrice: 1799,
    stock: 30,
    sizes: ["S", "M", "L"],
    colors: ["Red"],
    images: ["biba-dress.jpg"],
  },

  {
    name: "Apple iPhone 16",
    description: "Latest Apple smartphone.",
    category: "Electronics",
    subCategory: "Mobile",
    brand: "Apple",
    price: 89999,
    discountPrice: 84999,
    stock: 15,
    colors: ["Black", "Blue"],
    images: ["iphone16.jpg"],
  },

  {
    name: "Samsung Galaxy S25",
    description: "Flagship Samsung smartphone.",
    category: "Electronics",
    subCategory: "Mobile",
    brand: "Samsung",
    price: 79999,
    discountPrice: 74999,
    stock: 18,
    colors: ["Black"],
    images: ["galaxy-s25.jpg"],
  },

  {
    name: "Boat Rockerz 550",
    description: "Wireless Bluetooth headphones.",
    category: "Electronics",
    subCategory: "Headphones",
    brand: "Boat",
    price: 3999,
    discountPrice: 2499,
    stock: 60,
    colors: ["Black"],
    images: ["boat-rockerz.jpg"],
  },
];

try {
  await Product.deleteMany();

  await Product.insertMany(products);

  console.log("Products Seeded Successfully");
  process.exit();
} catch (error) {
  console.error(error);
  process.exit(1);
}