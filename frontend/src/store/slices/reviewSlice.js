import { createSlice } from "@reduxjs/toolkit";
import { updateRating, saveReview , fetchMyReviews} from "./reviewThunks";

const initialState = {
  loading: false,
  error: null,
  ratings: {},
  reviews: {},
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // ---------------- UPDATE RATING ----------------

      .addCase(updateRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateRating.fulfilled, (state, action) => {
        state.loading = false;

        const review = action.payload;

        state.ratings[review.productId] = review.rating;
      })

      .addCase(updateRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- SAVE REVIEW ----------------

      .addCase(saveReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(saveReview.fulfilled, (state, action) => {
        state.loading = false;

        const review = action.payload;

        state.ratings[review.productId] = review.rating;
      })

      .addCase(saveReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
            // ---------------- FETCH MY REVIEWS ----------------

      .addCase(fetchMyReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.loading = false;

        action.payload.forEach((review) => {
          state.ratings[review.productId] = review.rating;

          state.reviews[review.productId] = review;
        });
      })

      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;