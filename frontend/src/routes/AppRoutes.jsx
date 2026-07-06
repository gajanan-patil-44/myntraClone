import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import WishlistPage from "../pages/WishlistPage";
import CartPage from "../pages/CartPage";
import AddressPage from "../pages/AddressPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import PaymentPage from "../pages/PaymentPage";
import MyOrdersPage from "../pages/MyOrdersPage";
import OrderDetailsPage from "../pages/OrderDetailsPage";

import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminLayout from "../pages/admin/layout/AdminLayout";
import AdminDashboard from "../pages/admin/pages/AdminDashboard";
import ProductListPage from "../pages/admin/pages/ProductListPage";
import AddProductPage from "../pages/admin/pages/AddProductPage";
import EditProductPage from "../pages/admin/pages/EditProductPage";
import AdminOrdersPage from "../pages/admin/pages/AdminOrdersPage";
import AdminOrderDetailsPage from "../pages/admin/pages/AdminOrderDetailsPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:category" element={<ProductsPage />} />
          <Route
            path="/products/:category/:subCategory"
            element={<ProductsPage />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/address" element={<AddressPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
        </Route>

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="products/add" element={<AddProductPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
            <Route path="users" element={<div>Admin Users</div>} />
            <Route path="products/edit/:id" element={<EditProductPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
