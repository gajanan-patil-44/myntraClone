import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import WishlistPage from "../pages/WishlistPage";
import CartPage from "../pages/CartPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:category" element={<ProductsPage />} />
          <Route path="/products/:category/:subCategory" element={<ProductsPage />}/>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;