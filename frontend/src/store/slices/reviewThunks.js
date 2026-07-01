import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

/*
|--------------------------------------------------------------------------
| Update only rating
|--------------------------------------------------------------------------
*/

export const updateRating = createAsyncThunk(
  "review/updateRating",
  async ({ productId, rating }, thunkAPI) => {
    try {
      const response = await axios.patch("/reviews/rating", {
        productId,
        rating,
      });

      return response.data.review;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update rating"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Create / Update Review
|--------------------------------------------------------------------------
*/

export const saveReview = createAsyncThunk(
  "review/saveReview",
  async ({ productId, rating, comment }, thunkAPI) => {
    try {
      const response = await axios.post("/reviews", {
        productId,
        rating,
        comment,
      });

      return response.data.review;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to save review"
      );
    }
  }
);

export const fetchMyReviews = createAsyncThunk(
  "review/fetchMyReviews",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/reviews/my");

      return response.data.reviews;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);