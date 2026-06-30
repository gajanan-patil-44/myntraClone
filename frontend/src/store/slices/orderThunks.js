import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async ({ addressId, paymentMethod }, thunkAPI) => {
    try {
      const response = await axios.post("/orders", {
        addressId,
        paymentMethod,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to place order"
      );
    }
  }
);