import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdminOrders,
  updateOrderStatus,
  fetchAdminOrderById,
  updateOrderItemStatus,
} from "./adminOrderThunks";

const initialState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // Fetch Orders
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })

      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload.order;

        const index = state.orders.findIndex(
          (order) => order._id === updatedOrder._id,
        );

        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })

      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchAdminOrderById.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
      })
      .addCase(updateOrderItemStatus.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;

        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id,
        );

        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export default adminOrderSlice.reducer;
