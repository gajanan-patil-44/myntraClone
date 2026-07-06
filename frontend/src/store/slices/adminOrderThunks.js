import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchAdminOrders = createAsyncThunk(
  "adminOrder/fetchAdminOrders",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/orders/admin/all");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders.",
      );
    }
  },
);

export const updateOrderStatus = createAsyncThunk(
  "adminOrder/updateOrderStatus",
  async ({ id, orderStatus }, thunkAPI) => {
    try {
      const response = await api.patch(`/orders/admin/${id}/status`, {
        orderStatus,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update order status.",
      );
    }
  },
);

export const fetchAdminOrderById = createAsyncThunk(
  "adminOrder/fetchAdminOrderById",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/orders/admin/${id}`);
      return response.data.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch order.",
      );
    }
  },
);
export const updateOrderItemStatus = createAsyncThunk(
  "adminOrder/updateOrderItemStatus",
  async ({ orderId, itemId, orderStatus }, thunkAPI) => {
    try {
      const response = await api.patch(
        `/orders/admin/${orderId}/items/${itemId}/status`,
        { orderStatus },
      );

      return response.data.order;
    } catch (error) {
      // console.log(error);
      // console.log(error.response);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update order item status.",
      );
    }
  },
);
