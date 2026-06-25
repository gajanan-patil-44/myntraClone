import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/wishlist");
      return response.data.wishlist;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist."
      );
    }
  }
);

export const toggleWishlistItem = createAsyncThunk(
  "wishlist/toggleWishlistItem",
  async (productId, thunkAPI) => {
    try {
      const response = await api.post(`/wishlist/${productId}`);
      return {
        productId,
        message: response.data.message,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update wishlist."
      );
    }
  }
);