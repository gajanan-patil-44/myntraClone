import bcrypt from "bcryptjs";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
    } = req.body;

    // Required fields validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory.",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "Email already registered. Please login or use a different email.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    // Generate JWT
    const token = generateToken(
      user._id,
      user.role
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax", 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login user code
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    //UPDATE ADRESS



    // 2. Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found. Please register first.",
      });
    }

    // 3. Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is disabled. Contact support.",
      });
    }

    // 4. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 5. Generate JWT
    const token = generateToken(user._id, user.role);

    // store in cookie
      res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax", // important for frontend-backend
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    // 6. Send response
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const { firstName, lastName, phone, address } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    
    // 1. Basic fields update
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;

    // 2. Nested address update 
  
    if (address) {
      if (
      address.pincode !== undefined &&
      !/^[0-9]{6}$/.test(address.pincode)
    ) {
      return res.status(400).json({
        success: false,
        message: "Pincode must be 6 digits",
      });
    }
      user.address = {
        street:
          address.street !== undefined
            ? address.street
            : user.address?.street,

        city:
          address.city !== undefined
            ? address.city
            : user.address?.city,

        state:
          address.state !== undefined
            ? address.state
            : user.address?.state,

        pincode:
          address.pincode !== undefined
            ? address.pincode
            : user.address?.pincode,
      };
    }
      if (
      phone !== undefined &&
      !/^[0-9]{10}$/.test(phone)
    ) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10 digits",
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Logout user code
export const logoutUser = (req, res) => {
  res.clearCookie("token");

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};