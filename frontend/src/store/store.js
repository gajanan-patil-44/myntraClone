import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import wishlistReducer from "./slices/wishlistSlice";
import cartReducer from "./slices/cartSlice";
import addressReducer from "./slices/addressSlice";
import orderReducer from "./slices/orderSlice";
import reviewReducer from "./slices/reviewSlice";
import adminProductReducer from "./slices/adminProductSlice";
import adminOrderReducer from "./slices/adminOrderSlice";
import adminDashboardReducer from "./slices/adminDashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    address: addressReducer,
    order: orderReducer,
    review: reviewReducer,
    adminProduct: adminProductReducer,
    adminOrder: adminOrderReducer,
    adminDashboard: adminDashboardReducer,
  },
});