import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserProfile,
  loginUser,
  registerUser,
  logoutUser,
  sendOtp,
  verifyOtpLogin,
} from "./authThunks";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  authChecked: false,
  error: null,
  otpSent: false,
  otpVerified: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },

    resetOtpState: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
    },

    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.otpSent = false;
      state.otpVerified = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= LOGIN WITH PASSWORD =================
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= REGISTER =================
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= SEND OTP =================
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpSent = false;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
        state.error = null;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.otpSent = false;
      })

      // ================= VERIFY OTP LOGIN =================
      .addCase(verifyOtpLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.otpVerified = true;
        state.error = null;
      })
      .addCase(verifyOtpLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.otpVerified = false;
      })

      // ================= FETCH PROFILE =================
      .addCase(fetchUserProfile.pending, (state) => {
         console.log("PROFILE PENDING");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
          console.log("PROFILE FULFILLED", action.payload.user);

        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
          console.log("PROFILE REJECTED");

        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
        state.error = action.payload || null;
      })

      // ================= LOGOUT =================
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.otpSent = false;
        state.otpVerified = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthError, resetOtpState, clearAuth } = authSlice.actions;
export default authSlice.reducer;