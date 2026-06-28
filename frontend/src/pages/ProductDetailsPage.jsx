import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { FiStar } from "react-icons/fi";

const ProductDetailsPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");

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
              <div
                key={index}
                className="aspect-[3/4] bg-[#f5f5f6] overflow-hidden"
              >
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {product.brand}
            </h1>
            <p className="text-xl text-gray-500 mt-1">{product.name}</p>
          </div>
          <div className="mt-4">
            {product.averageRating > 0 && (
              <div className="inline-flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 text-sm font-medium">
                <span className="flex items-center gap-1">
                  <span>{Number(product.averageRating).toFixed(1)}</span>

                  <FiStar size={13} className="fill-[#14958F] text-[#14958F]" />
                </span>

                <span className="text-gray-300">|</span>

                <span className="text-gray-600">
                  {product.reviewsCount} Ratings
                </span>
              </div>
            )}
          </div>

          {/* //2. price section  */}

          <div className="mt-5 border-t border-gray-200 pt-5">
            <div className="flex items-end gap-3">
              <span className="text-[28px] font-bold text-gray-900">
                ₹{product.discountPrice || product.price}
              </span>

              {product.discountPrice > 0 && (
                <>
                  <span className="text-lg text-gray-500 mr-0 pr-0">MRP</span>
                  <span className="text-lg text-gray-500 line-through ml-0 pl-0">
                    ₹{product.price}
                  </span>

                  <span className="text-lg font-semibold text-[#ff905a]">
                    (
                    {Math.round(
                      ((product.price - product.discountPrice) /
                        product.price) *
                        100,
                    )}
                    % OFF)
                  </span>
                </>
              )}
            </div>

            <p className="mt-1 text-sm font-medium text-[#03a685]">
              inclusive of all taxes
            </p>
          </div>
          {/* //<size section> */}

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm tracking-wide">SELECT SIZE</h3>

              {/* <button
                type="button"
                className="text-[#ff3f6c] font-semibold text-sm"
              >
                SIZE CHART
              </button> */}
            </div>

            <div className="flex flex-wrap gap-3 mt-5">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-14 rounded-full border font-semibold transition-all
          ${
            selectedSize === size
              ? "border-[#ff3f6c] bg-pink-50 text-[#ff3f6c]"
              : "border-gray-300 hover:border-gray-900"
          }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          {/* //</size section> */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
