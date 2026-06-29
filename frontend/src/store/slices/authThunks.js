import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// ================= FETCH LOGGED-IN USER PROFILE =================
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/users/profile");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile."
      );
    }
  }
);

// ================= LOGIN WITH EMAIL + PASSWORD =================
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, thunkAPI) => {
    try {
      const response = await api.post("/users/login", loginData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  }
);

// ================= REGISTER USER =================
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (registerData, thunkAPI) => {
    try {
      const response = await api.post("/users/register", registerData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  }
);

// ================= SEND OTP =================
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async ({ email }, thunkAPI) => {
    try {
      const response = await api.post("/auth/send-otp", { email });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send OTP."
      );
    }
  }
);

// ================= VERIFY OTP LOGIN =================
export const verifyOtpLogin = createAsyncThunk(
  "auth/verifyOtpLogin",
  async ({ email, otp }, thunkAPI) => {
    try {
      const response = await api.post("/auth/verify-otp", { email, otp });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "OTP verification failed."
      );
    }
  }
);

// ================= LOGOUT USER =================
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      const response = await api.post("/users/logout");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Logout failed."
      );
    }
  }
);