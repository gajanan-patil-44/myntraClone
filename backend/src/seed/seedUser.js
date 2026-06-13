import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const users = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@myntra.com",
    password: await bcrypt.hash("admin123", 10),
    phone: "1213141516",
    address: {
      street: "M.G. Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
    },
    role: "admin",
  },

  {
    firstName: "Gajanan",
    lastName: "Patil",
    email: "user@myntra.com",
    password: await bcrypt.hash("user123", 10),
    phone: "1122334455",
    address: {
      street: "Shivaji Nagar",
      city: "Kolhapur",
      state: "Maharashtra",
      pincode: "416003",
    },
    role: "user",
  },
  {
  firstName: "First",
  lastName: "User",
  email: "firstuser@myntra.com",
  password: await bcrypt.hash("first123", 10),
  phone: "9876500001",
  address: {
    street: "Street 1",
    city: "Kolhapur",
    state: "Maharashtra",
    pincode: "416001",
  },
  role: "user",
},
{
  firstName: "Second",
  lastName: "User",
  email: "seconduser@myntra.com",
  password: await bcrypt.hash("second123", 10),
  phone: "9876500002",
  address: {
    street: "Street 2",
    city: "Kolhapur",
    state: "Maharashtra",
    pincode: "416002",
  },
  role: "user",
},
{
  firstName: "Third",
  lastName: "User",
  email: "thirduser@myntra.com",
  password: await bcrypt.hash("third123", 10),
  phone: "9876500003",
  address: {
    street: "Street 3",
    city: "Kolhapur",
    state: "Maharashtra",
    pincode: "416003",
  },
  role: "user",
},
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany();

    await User.insertMany(users);

    console.log("Users seeded successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();