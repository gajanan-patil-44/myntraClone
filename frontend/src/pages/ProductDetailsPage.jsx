import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

const ProductDetailsPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.product);
      } catch (error) {
        console.error(error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto py-10 px-4">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4">Product not found.</div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-black">
          Home
        </Link>

        <span> / </span>

        <Link
          to={`/products/${product.category.toLowerCase()}`}
          className="hover:text-black"
        >
          {product.category}
        </Link>

        <span> / </span>

        <Link
          to={`/products/${product.category.toLowerCase()}/${product.subCategory.toLowerCase()}`}
          className="hover:text-black"
        >
          {product.subCategory}
        </Link>

        <span> / </span>

        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>
      <div className="grid grid-cols-12 gap-10">
        {/* Left Section */}
        <div className="col-span-7">
          <div className="grid grid-cols-2 gap-4">
            {product.images?.map((image, index) => (
              <div key={index} className="aspect-[3/4] bg-[#f5f5f6] overflow-hidden">
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="col-span-5">
          <div className="bg-gray-100 h-[700px] rounded p-6">
            Product Information
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
