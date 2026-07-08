import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboardStats } from "./adminDashboardThunks";

const initialState = {
  stats: null,
  recentOrders: [],
  loading: false,
  error: null,
};

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.recentOrders = action.payload.recentOrders;
      })

      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminDashboardSlice.reducer;