import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "./addressThunks";

const initialState = {
  addresses: [],
  loading: false,
  actionLoading: false,
  error: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddressError: (state) => {
      state.error = null;
    },

    clearAddressState: (state) => {
      state.addresses = [];
      state.loading = false;
      state.actionLoading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addAddress.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(addAddress.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateAddress.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateAddress.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteAddress.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteAddress.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAddressError,
  clearAddressState,
} = addressSlice.actions;

export default addressSlice.reducer;