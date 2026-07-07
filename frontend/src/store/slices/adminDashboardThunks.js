import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchDashboardStats = createAsyncThunk(
  "adminDashboard/fetchDashboardStats",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/orders/admin/dashboard/stats");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats."
      );
    }
  }
);