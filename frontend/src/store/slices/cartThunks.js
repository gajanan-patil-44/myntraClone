import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// ================= FETCH CART =================
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart."
      );
    }
  }
);

// ================= ADD TO CART =================
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1, size = null, color = null }, thunkAPI) => {
    try {
      const response = await api.post("/cart/add", {
        productId,
        quantity,
        size,
        color,
      });

      // addToCart API currently returns raw user.cartItems only.
      // So after add, fetch full cart again for normalized UI data.
      await thunkAPI.dispatch(fetchCart());

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add item to cart."
      );
    }
  }
);

// ================= UPDATE CART QUANTITY =================
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ cartItemId, action }, thunkAPI) => {
    try {
      const response = await api.patch(`/cart/${cartItemId}`, { action });

      await thunkAPI.dispatch(fetchCart());

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update cart quantity."
      );
    }
  }
);

// ================= UPDATE CART ITEM VARIANT =================
export const updateCartItemVariant = createAsyncThunk(
  "cart/updateCartItemVariant",
  async ({ cartItemId, size, color }, thunkAPI) => {
    try {
      const response = await api.patch(`/cart/${cartItemId}/variant`, {
        size,
        color,
      });

      // Refresh normalized cart data
      await thunkAPI.dispatch(fetchCart());

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to update cart item."
      );
    }
  }
);

// ================= REMOVE CART ITEM =================
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (cartItemId, thunkAPI) => {
    try {
      const response = await api.delete(`/cart/${cartItemId}`);

      await thunkAPI.dispatch(fetchCart());

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove cart item."
      );
    }
  }
);

// ================= MOVE WISHLIST ITEM TO CART =================
export const moveWishlistItemToCart = createAsyncThunk(
  "cart/moveWishlistItemToCart",
  async ({ productId, quantity = 1, size = null, color = null }, thunkAPI) => {
    try {
      const response = await api.post(`/wishlist/move-to-cart/${productId}`, {
        quantity,
        size,
        color,
      });

      await thunkAPI.dispatch(fetchCart());

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to move item to cart."
      );
    }
  }
);