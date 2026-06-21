import { useEffect } from "react";
import api from "../api/axios";

const ProductsPage = () => {
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");

        console.log("Products Response:", response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold">
          All Products
        </h1>
      </div>
    </>
  );
};

export default ProductsPage;