const ProductCard = ({ product }) => {
  const discountPercentage =
    product.discountPrice > 0
      ? Math.round(
          ((product.price - product.discountPrice) /
            product.price) *
            100
        )
      : 0;

  const imageUrl =
    product.images?.[0]?.startsWith("http")
      ? product.images[0]
      : null;

  return (
    <div className="cursor-pointer">
      {/* Image Area */}
      <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
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
      </div>

      {/* Product Info */}
      <div className="pt-3">
        <h3 className="font-bold text-sm uppercase">
          {product.brand}
        </h3>

        <p className="text-sm text-gray-600 truncate">
          {product.name}
        </p>

        <div className="mt-1 flex items-center gap-2 flex-wrap">
          <span className="font-bold">
            ₹
            {product.discountPrice > 0
              ? product.discountPrice
              : product.price}
          </span>

          {product.discountPrice > 0 && (
            <>
              <span className="text-gray-500 line-through text-sm">
                ₹{product.price}
              </span>

              <span className="text-orange-500 text-sm font-medium">
                ({discountPercentage}% OFF)
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;