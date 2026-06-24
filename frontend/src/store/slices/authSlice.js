import { createSlice } from "@reduxjs/toolkit";
import {fetchUserProfile,loginUser, registerUser, logoutUser} from "./authThunks";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
  setLoading: (state, action) => {
    state.loading = action.payload;
  },

  setUser: (state, action) => {
    state.user = action.payload;
    state.isAuthenticated = !!action.payload;
    state.error = null;
  },

  setError: (state, action) => {
    state.error = action.payload;
  },

  clearAuth: (state) => {
    state.user = null;
    state.isAuthenticated = false;
    state.loading = false;
    state.error = null;
  },
},
extraReducers: (builder) => {
  builder

    // LOGIN
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // REGISTER
    .addCase(registerUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    })
    .addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // PROFILE
    .addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    })

    // LOGOUT
    .addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });
},
});

export default authSlice.reducer;
export const { setLoading, setUser, setError, clearAuth } = authSlice.actions;