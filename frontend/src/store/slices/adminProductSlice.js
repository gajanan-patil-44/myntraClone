import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdminProducts,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
} from "./adminProductThunks";

const initialState = {
  products: [],
  loading: false,
  createLoading: false,
  error: null,
};

const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // Fetch Products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })

      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // Create Product
    builder
      .addCase(createProduct.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.createLoading = false;

        // Immediately update the table without another API call
        state.products.unshift(action.payload.product);
      })

      .addCase(createProduct.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      });
    // Update Product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        state.createLoading = false;

        const index = state.products.findIndex(
          (product) => product._id === action.payload.product._id,
        );

        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
      })

      .addCase(updateProduct.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      });
    // Toggle Product Status
    builder
      .addCase(toggleProductStatus.pending, (state) => {
        state.error = null;
      })

      .addCase(toggleProductStatus.fulfilled, (state, action) => {
        const updatedProduct = action.payload.product;

        const index = state.products.findIndex(
          (product) => product._id === updatedProduct._id,
        );

        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      })

      .addCase(toggleProductStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
    // Delete Product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.error = null;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p._id !== action.payload.id,
        );
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default adminProductSlice.reducer;
