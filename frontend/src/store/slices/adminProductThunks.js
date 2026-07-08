import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const fetchAdminProducts = createAsyncThunk(
  "adminProduct/fetchAdminProducts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/products/admin/all");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "adminProduct/createProduct",
  async (productData, thunkAPI) => {
    try {
      const response = await axios.post("/products", productData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "adminProduct/updateProduct",
  async ({ id, productData }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/products/${id}`,
        productData
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const toggleProductStatus = createAsyncThunk(
  "adminProduct/toggleProductStatus",
  async (id, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/products/${id}/toggle-status`
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to update product status"
      );
    }
  }
);
export const deleteProduct = createAsyncThunk(
  "adminProduct/deleteProduct",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`/products/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);