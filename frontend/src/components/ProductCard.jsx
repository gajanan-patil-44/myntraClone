import { useEffect, useState } from "react";
import { FiStar,FiHeart } from "react-icons/fi";

const ProductCard = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const discountPercentage =
    product.discountPrice > 0
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100,
        )
      : 0;

  useEffect(() => {
    if (!isHovering || !product.images || product.images.length <= 1) {
      setCurrentImage(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % product.images.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [isHovering, product.images]);

  const imageUrl = product.images?.[currentImage]?.startsWith("http")
    ? product.images[currentImage]
    : null;

  return (
    <div
      className="cursor-pointer bg-white transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image Section */}

      <div className="relative aspect-3/4 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
            Product Image
          </div>
        )}
      

        {/* Rating Badge */}

        {product.averageRating > 0 && (
          <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded flex items-center gap-1 text-xs font-semibold shadow">
            <FiStar size={12} />
            {product.averageRating}
            <span className="text-gray-400">|</span>
            {product.reviewsCount}
          </div>
        )}
      </div>

      {/* Product Info */}

      <div className="p-3 h-30 flex flex-col justify-between">
  {!isHovering ? (
    <>
      <h3 className="font-bold text-sm uppercase truncate">
        {product.brand}
      </h3>

      <p className="text-sm text-gray-500 truncate mt-1">
        {product.name}
      </p>

      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <span className="font-bold text-sm">
          ₹
          {product.discountPrice > 0
            ? product.discountPrice
            : product.price}
        </span>

        {product.discountPrice > 0 && (
          <>
            <span className="text-gray-400 line-through text-xs">
              ₹{product.price}
            </span>

            <span className="text-orange-500 text-xs font-semibold">
              {discountPercentage}% OFF
            </span>
          </>
        )}
      </div>
    </>
  ) : (
    <>
      {/* Wishlist Button */}

      <button
        className="w-full border border-gray-300 py-2 flex items-center justify-center gap-2 font-semibold text-sm hover:border-gray-500 transition"
      >
        <FiHeart size={18} />
        WISHLIST
      </button>

      {/* Sizes */}

      {product.sizes?.length > 0 && (
        <div className="mt-4 text-sm">
          <span className="font-medium">
            Sizes:
          </span>{" "}
          {product.sizes.join("  ")}
        </div>
      )}

      {/* Price */}

      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span className="font-bold text-sm">
          ₹
          {product.discountPrice > 0
            ? product.discountPrice
            : product.price}
        </span>

        {product.discountPrice > 0 && (
          <>
            <span className="text-gray-400 line-through text-xs">
              ₹{product.price}
            </span>

            <span className="text-orange-500 text-xs font-semibold">
              {discountPercentage}% OFF
            </span>
          </>
        )}
      </div>
    </>
  )}
</div>
    </div>
  );
};

export default ProductCard;
