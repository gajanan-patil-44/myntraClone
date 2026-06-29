import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCart,
  addToCart,
  updateCartQuantity,
  updateCartItemVariant,
  removeCartItem,
  moveWishlistItemToCart,
} from "./cartThunks";
import { logoutUser } from "./authThunks";

const initialState = {
  items: [],
  totalItems: 0,
  cartTotal: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },

    clearCartState: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.cartTotal = 0;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ================= FETCH CART =================
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cartItems || [];
        state.totalItems = action.payload.totalItems || 0;
        state.cartTotal = action.payload.cartTotal || 0;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.totalItems = 0;
        state.cartTotal = 0;
        state.error = action.payload || null;
      })

      // ================= ADD TO CART =================
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= UPDATE QUANTITY =================
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= UPDATE CART ITEM VARIANT =================
      .addCase(updateCartItemVariant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemVariant.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCartItemVariant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= REMOVE CART ITEM =================
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= MOVE WISHLIST ITEM TO CART =================
      .addCase(moveWishlistItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(moveWishlistItemToCart.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(moveWishlistItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= LOGOUT CLEANUP =================
      .addCase(logoutUser.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.cartTotal = 0;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearCartError, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
