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
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

export const createProduct = createAsyncThunk(
  "adminProduct/createProduct",
  async (productData, thunkAPI) => {
    try {
      const formData = new FormData();

      formData.append("name", productData.name);
      formData.append("brand", productData.brand);
      formData.append("category", productData.category);
      formData.append("subCategory", productData.subCategory);
      formData.append("price", productData.price);
      formData.append("discountPrice", productData.discountPrice);
      formData.append("stock", productData.stock);
      formData.append("description", productData.description);
      formData.append("isActive", productData.isActive);

      productData.sizes.forEach((size) => {
        formData.append("sizes", size);
      });

      productData.colors.forEach((color) => {
        formData.append("colors", color);
      });

      productData.images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await axios.post("/products", formData);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create product",
      );
    }
  },
);

export const updateProduct = createAsyncThunk(
  "adminProduct/updateProduct",
  async ({ id, productData }, thunkAPI) => {
    try {
      const formData = new FormData();

      formData.append("name", productData.name);
      formData.append("brand", productData.brand);
      formData.append("category", productData.category);
      formData.append("subCategory", productData.subCategory);
      formData.append("price", productData.price);
      formData.append("discountPrice", productData.discountPrice);
      formData.append("stock", productData.stock);
      formData.append("description", productData.description);
      formData.append("isActive", productData.isActive);

      productData.sizes.forEach((size) => {
        formData.append("sizes", size);
      });

      productData.colors.forEach((color) => {
        formData.append("colors", color);
      });

      productData.existingImages.forEach((image) => {
        formData.append("existingImages", image);
      });

      productData.images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await axios.patch(`/products/${id}`, formData);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update product",
      );
    }
  },
);

export const toggleProductStatus = createAsyncThunk(
  "adminProduct/toggleProductStatus",
  async (id, thunkAPI) => {
    try {
      const response = await axios.patch(`/products/${id}/toggle-status`);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update product status",
      );
    }
  },
);
export const deleteProduct = createAsyncThunk(
  "adminProduct/deleteProduct",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`/products/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete product",
      );
    }
  },
);
