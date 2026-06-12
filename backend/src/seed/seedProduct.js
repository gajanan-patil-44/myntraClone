import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();

// console.log(process.env.MONGO_URI);

await connectDB();


const men = [
{
  name: "Nike Dry Fit T-Shirt",
  description: "Breathable gym t-shirt for workouts and running.",
  category: "Men",
  subCategory: "T-Shirts",
  brand: "Nike",
  price: 1499,
  discountPrice: 999,
  stock: 50,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Black", "White"],
  images: ["m1.jpg"]
},
{
  name: "Adidas Classic Tee",
  description: "Soft cotton t-shirt for daily casual wear.",
  category: "Men",
  subCategory: "T-Shirts",
  brand: "Adidas",
  price: 1299,
  discountPrice: 899,
  stock: 45,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Blue"],
  images: ["m2.jpg"]
},
{
  name: "Levi's Casual Shirt",
  description: "Premium cotton shirt for office and outings.",
  category: "Men",
  subCategory: "Shirts",
  brand: "Levis",
  price: 1999,
  discountPrice: 1499,
  stock: 35,
  sizes: ["S", "M", "L", "XL"],
  colors: ["White"],
  images: ["m3.jpg"]
},
{
  name: "Zara Slim Fit Shirt",
  description: "Modern slim fit formal shirt.",
  category: "Men",
  subCategory: "Shirts",
  brand: "Zara",
  price: 2499,
  discountPrice: 1799,
  stock: 30,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Black", "Blue"],
  images: ["m4.jpg"]
},
{
  name: "Puma Blue Jeans",
  description: "Comfortable stretchable denim jeans.",
  category: "Men",
  subCategory: "Jeans",
  brand: "Puma",
  price: 2999,
  discountPrice: 2199,
  stock: 25,
  sizes: ["30", "32", "34", "36"],
  colors: ["Blue"],
  images: ["m5.jpg"]
},
{
  name: "Levi's Black Jeans",
  description: "Classic black slim fit jeans.",
  category: "Men",
  subCategory: "Jeans",
  brand: "Levis",
  price: 3299,
  discountPrice: 2499,
  stock: 28,
  sizes: ["30", "32", "34", "36"],
  colors: ["Black"],
  images: ["m6.jpg"]
},
{
  name: "Nike Hoodie",
  description: "Warm fleece hoodie for winter.",
  category: "Men",
  subCategory: "Jackets",
  brand: "Nike",
  price: 3999,
  discountPrice: 2799,
  stock: 20,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Grey", "Black"],
  images: ["m7.jpg"]
},
{
  name: "Adidas Sweatshirt",
  description: "Comfortable winter sweatshirt.",
  category: "Men",
  subCategory: "Jackets",
  brand: "Adidas",
  price: 3499,
  discountPrice: 2499,
  stock: 18,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Black"],
  images: ["m8.jpg"]
},
{
  name: "Puma Track Pants",
  description: "Lightweight sports track pants.",
  category: "Men",
  subCategory: "Sports Wear",
  brand: "Puma",
  price: 1299,
  discountPrice: 899,
  stock: 60,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Grey", "Black"],
  images: ["m9.jpg"]
},
{
  name: "Nike Running Shorts",
  description: "Quick-dry shorts for running.",
  category: "Men",
  subCategory: "Sports Wear",
  brand: "Nike",
  price: 999,
  discountPrice: 699,
  stock: 65,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Black"],
  images: ["m10.jpg"]
},
{
  name: "Roadster Casual Tee",
  description: "Stylish everyday t-shirt.",
  category: "Men",
  subCategory: "T-Shirts",
  brand: "Roadster",
  price: 899,
  discountPrice: 599,
  stock: 70,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Red", "Black"],
  images: ["m11.jpg"]
},
{
  name: "Allen Solly Formal Shirt",
  description: "Office wear premium shirt.",
  category: "Men",
  subCategory: "Shirts",
  brand: "Allen Solly",
  price: 2199,
  discountPrice: 1599,
  stock: 40,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Blue", "White"],
  images: ["m12.jpg"]
},
{
  name: "H&M Basic Tee",
  description: "Soft cotton basic t-shirt.",
  category: "Men",
  subCategory: "T-Shirts",
  brand: "H&M",
  price: 799,
  discountPrice: 499,
  stock: 80,
  sizes: ["S", "M", "L", "XL"],
  colors: ["White", "Black"],
  images: ["m13.jpg"]
},
{
  name: "Nike Gym Jacket",
  description: "Training jacket for workouts.",
  category: "Men",
  subCategory: "Jackets",
  brand: "Nike",
  price: 4599,
  discountPrice: 3299,
  stock: 15,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Black"],
  images: ["m14.jpg"]
},
{
  name: "Puma Training Shorts",
  description: "Comfortable training shorts.",
  category: "Men",
  subCategory: "Sports Wear",
  brand: "Puma",
  price: 1099,
  discountPrice: 749,
  stock: 55,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Blue", "Black"],
  images: ["m15.jpg"]
}
];

const women = [
{
  name: "H&M Stylish Top",
  description: "Trendy casual top for daily wear and outings.",
  category: "Women",
  subCategory: "Tops",
  brand: "H&M",
  price: 999,
  discountPrice: 699,
  stock: 60,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Pink", "White"],
  images: ["w1.jpg"]
},
{
  name: "Zara Party Dress",
  description: "Elegant party wear dress with premium finish.",
  category: "Women",
  subCategory: "Dresses",
  brand: "Zara",
  price: 2999,
  discountPrice: 2199,
  stock: 25,
  sizes: ["S", "M", "L"],
  colors: ["Black", "Red"],
  images: ["w2.jpg"]
},
{
  name: "Biba Kurta Set",
  description: "Traditional ethnic kurta set for festive occasions.",
  category: "Women",
  subCategory: "Kurtas",
  brand: "Biba",
  price: 2499,
  discountPrice: 1799,
  stock: 30,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Yellow", "Orange"],
  images: ["w3.jpg"]
},
{
  name: "Libas Printed Kurta",
  description: "Elegant printed ethnic kurta.",
  category: "Women",
  subCategory: "Kurtas",
  brand: "Libas",
  price: 1999,
  discountPrice: 1299,
  stock: 28,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Red", "Blue"],
  images: ["w4.jpg"]
},
{
  name: "Levi's Skinny Jeans",
  description: "Comfortable stretchable skinny jeans.",
  category: "Women",
  subCategory: "Jeans",
  brand: "Levis",
  price: 3199,
  discountPrice: 2299,
  stock: 32,
  sizes: ["26", "28", "30", "32"],
  colors: ["Blue", "Black"],
  images: ["w5.jpg"]
},
{
  name: "Nike Yoga Leggings",
  description: "High comfort leggings for yoga and gym.",
  category: "Women",
  subCategory: "Ethnic Wear",
  brand: "Nike",
  price: 1499,
  discountPrice: 999,
  stock: 45,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Black", "Grey"],
  images: ["w6.jpg"]
},
{
  name: "Adidas Sports Top",
  description: "Lightweight sports training top.",
  category: "Women",
  subCategory: "Tops",
  brand: "Adidas",
  price: 1599,
  discountPrice: 1099,
  stock: 50,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Blue", "Black"],
  images: ["w7.jpg"]
},
{
  name: "H&M Summer Dress",
  description: "Comfortable summer dress for casual wear.",
  category: "Women",
  subCategory: "Dresses",
  brand: "H&M",
  price: 1899,
  discountPrice: 1299,
  stock: 38,
  sizes: ["S", "M", "L"],
  colors: ["Pink", "White"],
  images: ["w8.jpg"]
},
{
  name: "Zara Casual Top",
  description: "Stylish casual wear top.",
  category: "Women",
  subCategory: "Tops",
  brand: "Zara",
  price: 1299,
  discountPrice: 899,
  stock: 55,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Yellow", "White"],
  images: ["w9.jpg"]
},
{
  name: "Biba Festive Kurta",
  description: "Festive ethnic kurta with embroidery.",
  category: "Women",
  subCategory: "Kurtas",
  brand: "Biba",
  price: 2799,
  discountPrice: 1999,
  stock: 30,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Green", "Gold"],
  images: ["w10.jpg"]
},
{
  name: "Libas Ethnic Dress",
  description: "Modern ethnic style dress.",
  category: "Women",
  subCategory: "Dresses",
  brand: "Libas",
  price: 2199,
  discountPrice: 1599,
  stock: 22,
  sizes: ["S", "M", "L"],
  colors: ["Blue", "Pink"],
  images: ["w11.jpg"]
},
{
  name: "Nike Yoga Pants",
  description: "Stretchable yoga pants for fitness.",
  category: "Women",
  subCategory: "Ethnic Wear",
  brand: "Nike",
  price: 1799,
  discountPrice: 1299,
  stock: 30,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Grey", "Black"],
  images: ["w12.jpg"]
},
{
  name: "H&M Basic Tee",
  description: "Simple everyday cotton t-shirt.",
  category: "Women",
  subCategory: "Tops",
  brand: "H&M",
  price: 899,
  discountPrice: 599,
  stock: 70,
  sizes: ["S", "M", "L", "XL"],
  colors: ["White", "Black"],
  images: ["w13.jpg"]
},
{
  name: "Zara Mini Dress",
  description: "Trendy mini party dress.",
  category: "Women",
  subCategory: "Dresses",
  brand: "Zara",
  price: 2499,
  discountPrice: 1799,
  stock: 20,
  sizes: ["S", "M", "L"],
  colors: ["Red", "Black"],
  images: ["w14.jpg"]
},
{
  name: "Levi's Women Jeans",
  description: "Classic denim jeans for women.",
  category: "Women",
  subCategory: "Jeans",
  brand: "Levis",
  price: 2999,
  discountPrice: 1999,
  stock: 25,
  sizes: ["26", "28", "30", "32"],
  colors: ["Blue", "Black"],
  images: ["w15.jpg"]
}
];

const kids = [
{
  name: "Kids Cartoon T-Shirt",
  description: "Soft cotton t-shirt with fun cartoon print for daily wear.",
  category: "Kids",
  subCategory: "Boys Clothing",
  brand: "H&M",
  price: 599,
  discountPrice: 399,
  stock: 80,
  sizes: ["2Y", "4Y", "6Y", "8Y"],
  colors: ["Red", "Blue"],
  images: ["k1.jpg"]
},
{
  name: "Girls Floral Dress",
  description: "Beautiful floral party dress for girls.",
  category: "Kids",
  subCategory: "Girls Clothing",
  brand: "Zara",
  price: 1299,
  discountPrice: 899,
  stock: 50,
  sizes: ["2Y", "4Y", "6Y", "8Y"],
  colors: ["Pink", "White"],
  images: ["k2.jpg"]
},
{
  name: "Kids Denim Jacket",
  description: "Stylish denim jacket for winter protection.",
  category: "Kids",
  subCategory: "Boys Clothing",
  brand: "Levis",
  price: 1499,
  discountPrice: 1099,
  stock: 45,
  sizes: ["4Y", "6Y", "8Y", "10Y"],
  colors: ["Blue"],
  images: ["k3.jpg"]
},
{
  name: "Kids Sports Shoes",
  description: "Comfortable running shoes for active kids.",
  category: "Kids",
  subCategory: "Footwear",
  brand: "Nike",
  price: 1799,
  discountPrice: 1299,
  stock: 60,
  sizes: ["10C", "11C", "12C", "13C"],
  colors: ["White", "Black"],
  images: ["k4.jpg"]
},
{
  name: "Kids Hoodie Set",
  description: "Warm hoodie set for winter season.",
  category: "Kids",
  subCategory: "Boys Clothing",
  brand: "Adidas",
  price: 1599,
  discountPrice: 1199,
  stock: 40,
  sizes: ["4Y", "6Y", "8Y", "10Y"],
  colors: ["Grey", "Black"],
  images: ["k5.jpg"]
},
{
  name: "Kids Cotton Shorts",
  description: "Lightweight cotton shorts for summer.",
  category: "Kids",
  subCategory: "Boys Clothing",
  brand: "Puma",
  price: 799,
  discountPrice: 499,
  stock: 70,
  sizes: ["2Y", "4Y", "6Y", "8Y"],
  colors: ["Blue", "Green"],
  images: ["k6.jpg"]
},
{
  name: "Girls Casual Top",
  description: "Comfortable casual top for everyday wear.",
  category: "Kids",
  subCategory: "Girls Clothing",
  brand: "H&M",
  price: 699,
  discountPrice: 499,
  stock: 65,
  sizes: ["2Y", "4Y", "6Y", "8Y"],
  colors: ["Pink", "Yellow"],
  images: ["k7.jpg"]
},
{
  name: "Kids Sneakers",
  description: "Durable sneakers for daily activities.",
  category: "Kids",
  subCategory: "Footwear",
  brand: "Nike",
  price: 1499,
  discountPrice: 1099,
  stock: 55,
  sizes: ["10C", "11C", "12C", "13C"],
  colors: ["White", "Blue"],
  images: ["k8.jpg"]
},
{
  name: "Kids Jeans",
  description: "Soft denim jeans for boys.",
  category: "Kids",
  subCategory: "Boys Clothing",
  brand: "Levis",
  price: 999,
  discountPrice: 699,
  stock: 50,
  sizes: ["4Y", "6Y", "8Y", "10Y"],
  colors: ["Blue"],
  images: ["k9.jpg"]
},
{
  name: "Kids Formal Shirt",
  description: "Smart formal shirt for special occasions.",
  category: "Kids",
  subCategory: "Boys Clothing",
  brand: "Zara",
  price: 899,
  discountPrice: 599,
  stock: 60,
  sizes: ["4Y", "6Y", "8Y", "10Y"],
  colors: ["White", "Light Blue"],
  images: ["k10.jpg"]
}
];

const electronics = [
{
  name: "iPhone 15",
  description: "Apple smartphone with A16 Bionic chip and advanced camera system.",
  category: "Electronics",
  subCategory: "Mobiles",
  brand: "Apple",
  price: 79999,
  discountPrice: 74999,
  stock: 20,
  sizes: [],
  colors: ["Black", "Blue", "Pink"],
  images: ["e1.jpg"]
},
{
  name: "Samsung Galaxy S24",
  description: "Flagship Android phone with high-performance processor.",
  category: "Electronics",
  subCategory: "Mobiles",
  brand: "Samsung",
  price: 69999,
  discountPrice: 64999,
  stock: 25,
  sizes: [],
  colors: ["Black", "Silver"],
  images: ["e2.jpg"]
},
{
  name: "OnePlus 12",
  description: "Fast and smooth performance smartphone.",
  category: "Electronics",
  subCategory: "Mobiles",
  brand: "OnePlus",
  price: 64999,
  discountPrice: 59999,
  stock: 30,
  sizes: [],
  colors: ["Black", "Green"],
  images: ["e3.jpg"]
},
{
  name: "Sony Headphones WH-1000XM5",
  description: "Noise cancelling wireless headphones.",
  category: "Electronics",
  subCategory: "Audio",
  brand: "Sony",
  price: 29999,
  discountPrice: 24999,
  stock: 40,
  sizes: [],
  colors: ["Black", "Silver"],
  images: ["e4.jpg"]
},
{
  name: "Boat Airdopes 141",
  description: "Wireless earbuds with deep bass sound.",
  category: "Electronics",
  subCategory: "Audio",
  brand: "Boat",
  price: 1999,
  discountPrice: 1299,
  stock: 100,
  sizes: [],
  colors: ["Black", "White"],
  images: ["e5.jpg"]
},
{
  name: "HP Laptop 15s",
  description: "Lightweight laptop for office and study use.",
  category: "Electronics",
  subCategory: "Laptops",
  brand: "HP",
  price: 54999,
  discountPrice: 49999,
  stock: 15,
  sizes: [],
  colors: ["Silver"],
  images: ["e6.jpg"]
},
{
  name: "Dell Inspiron 14",
  description: "Powerful performance laptop for professionals.",
  category: "Electronics",
  subCategory: "Laptops",
  brand: "Dell",
  price: 62999,
  discountPrice: 57999,
  stock: 18,
  sizes: [],
  colors: ["Black"],
  images: ["e7.jpg"]
},
{
  name: "Samsung 55 Inch Smart TV",
  description: "4K Ultra HD Smart LED TV.",
  category: "Electronics",
  subCategory: "TV",
  brand: "Samsung",
  price: 45999,
  discountPrice: 39999,
  stock: 10,
  sizes: [],
  colors: ["Black"],
  images: ["e8.jpg"]
},
{
  name: "Canon DSLR Camera",
  description: "Professional DSLR camera for photography.",
  category: "Electronics",
  subCategory: "Camera",
  brand: "Canon",
  price: 59999,
  discountPrice: 54999,
  stock: 12,
  sizes: [],
  colors: ["Black"],
  images: ["e9.jpg"]
},
{
  name: "Apple AirPods Pro",
  description: "Premium wireless earbuds with ANC.",
  category: "Electronics",
  subCategory: "Audio",
  brand: "Apple",
  price: 24999,
  discountPrice: 21999,
  stock: 35,
  sizes: [],
  colors: ["White"],
  images: ["e10.jpg"]
}
];


const home = [
{
  name: "Cotton Bedsheet Set",
  description: "Soft cotton bedsheet with pillow covers.",
  category: "Home",
  subCategory: "Bedsheets",
  brand: "HomeCentre",
  price: 1999,
  discountPrice: 1299,
  stock: 50,
  sizes: [],
  colors: ["Blue", "Pink"],
  images: ["h1.jpg"]
},
{
  name: "Sofa Cover Set",
  description: "Stretchable sofa cover for protection.",
  category: "Home",
  subCategory: "Furniture Covers",
  brand: "UrbanLadder",
  price: 1499,
  discountPrice: 999,
  stock: 40,
  sizes: [],
  colors: ["Grey"],
  images: ["h2.jpg"]
},
{
  name: "Wall Clock",
  description: "Modern decorative wall clock.",
  category: "Home",
  subCategory: "Decor",
  brand: "Ajanta",
  price: 799,
  discountPrice: 499,
  stock: 70,
  sizes: [],
  colors: ["Black", "Gold"],
  images: ["h3.jpg"]
},
{
  name: "Table Lamp",
  description: "LED table lamp for study and bedroom.",
  category: "Home",
  subCategory: "Lighting",
  brand: "Philips",
  price: 1299,
  discountPrice: 899,
  stock: 45,
  sizes: [],
  colors: ["White"],
  images: ["h4.jpg"]
},
{
  name: "Kitchen Storage Box Set",
  description: "Plastic airtight storage containers.",
  category: "Home",
  subCategory: "Kitchen",
  brand: "Milton",
  price: 999,
  discountPrice: 699,
  stock: 60,
  sizes: [],
  colors: ["Transparent"],
  images: ["h5.jpg"]
}
];


const beauty = [
{
  name: "Lakme Face Cream",
  description: "Moisturizing face cream for daily skincare.",
  category: "Beauty",
  subCategory: "Skincare",
  brand: "Lakme",
  price: 499,
  discountPrice: 349,
  stock: 100,
  sizes: [],
  colors: ["White"],
  images: ["b1.jpg"]
},
{
  name: "Maybelline Lipstick",
  description: "Matte finish long-lasting lipstick.",
  category: "Beauty",
  subCategory: "Makeup",
  brand: "Maybelline",
  price: 399,
  discountPrice: 299,
  stock: 120,
  sizes: [],
  colors: ["Red", "Pink"],
  images: ["b2.jpg"]
},
{
  name: "Nivea Body Lotion",
  description: "Deep moisture body lotion.",
  category: "Beauty",
  subCategory: "Skincare",
  brand: "Nivea",
  price: 299,
  discountPrice: 199,
  stock: 150,
  sizes: [],
  colors: ["White"],
  images: ["b3.jpg"]
},
{
  name: "Lakme Compact Powder",
  description: "Smooth finish compact powder.",
  category: "Beauty",
  subCategory: "Makeup",
  brand: "Lakme",
  price: 350,
  discountPrice: 249,
  stock: 90,
  sizes: [],
  colors: ["Natural"],
  images: ["b4.jpg"]
},
{
  name: "Dove Shampoo",
  description: "Nourishing shampoo for soft hair.",
  category: "Beauty",
  subCategory: "Haircare",
  brand: "Dove",
  price: 450,
  discountPrice: 349,
  stock: 110,
  sizes: [],
  colors: ["White"],
  images: ["b5.jpg"]
}
];


const products = [
  ...men,
  ...women,
  ...kids,
  ...electronics,
  ...home,
  ...beauty 

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