import api from "../../api/axios";
import { clearAuth, setError, setLoading, setUser } from "./authSlice";

export const fetchUserProfile = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await api.get("/users/profile");

    dispatch(setUser(response.data.user));
  } catch (error) {
    dispatch(clearAuth());
  } finally {
    dispatch(setLoading(false));
  }
};

export const loginUser = (loginData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await api.post("/users/login", loginData);

    dispatch(setUser(response.data.user));

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const message =
      error.response?.data?.message || "Login failed. Please try again.";

    dispatch(setError(message));

    return {
      success: false,
      message,
    };
  } finally {
    dispatch(setLoading(false));
  }
};

export const registerUser = (registerData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await api.post("/users/register", registerData);

    dispatch(setUser(response.data.user));

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const message =
      error.response?.data?.message || "Registration failed. Please try again.";

    dispatch(setError(message));

    return {
      success: false,
      message,
    };
  } finally {
    dispatch(setLoading(false));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await api.post("/users/logout");
    dispatch(clearAuth());
  } catch (error) {
    dispatch(clearAuth());
  } finally {
    dispatch(setLoading(false));
  }
};