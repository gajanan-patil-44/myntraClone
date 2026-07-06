import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// ================= GET ALL ADDRESSES =================

export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/users/addresses");
      return response.data.addresses;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch addresses."
      );
    }
  }
);

// ================= ADD ADDRESS =================

export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (addressData, thunkAPI) => {
    // console.log("1. Thunk started");
    // console.log("2. addressData:", addressData);

    try {
      // console.log("3. About to call API");

      const response = await api.post("/users/addresses", addressData);

      // console.log("4. API returned:", response);

      await thunkAPI.dispatch(fetchAddresses());

      return response.data;
    } catch (error) {
      // console.log("5. API error:", error);

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add address."
      );
    }
  }
);

// ================= UPDATE ADDRESS =================

export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ addressId, addressData }, thunkAPI) => {
    try {
      const response = await api.patch(
        `/users/addresses/${addressId}`,
        addressData
      );

      await thunkAPI.dispatch(fetchAddresses());

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update address."
      );
    }
  }
);

// ================= DELETE ADDRESS =================

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (addressId, thunkAPI) => {
    try {
      const response = await api.delete(`/users/addresses/${addressId}`);

      await thunkAPI.dispatch(fetchAddresses());

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete address."
      );
    }
  }
);          