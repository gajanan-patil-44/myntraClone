import { createSlice } from "@reduxjs/toolkit";
import { fetchWishlist, toggleWishlistItem } from "./wishlistThunks";

const initialState = {
  items: [],
  loading: false,
  actionLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlistState: (state) => {
      state.items = [];
      state.loading = false;
      state.actionLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH WISHLIST
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // TOGGLE WISHLIST
      .addCase(toggleWishlistItem.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        state.actionLoading = false;

        const { productId, message } = action.payload;
        const existingIndex = state.items.findIndex(
          (item) => item._id === productId
        );

        if (message === "Removed from wishlist") {
          if (existingIndex !== -1) {
            state.items.splice(existingIndex, 1);
          }
          return;
        }

        // For "Added to wishlist", we do NOT push partial product here,
        // because ProductCard only knows productId.
        // We immediately refetch wishlist after toggle from UI.
      })
      .addCase(toggleWishlistItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;