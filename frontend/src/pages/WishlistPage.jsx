import { useEffect, useState } from "react";
import { FiHeart, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchWishlist,
  toggleWishlistItem,
} from "../store/slices/wishlistThunks";
import {
  moveWishlistItemToCart,
  fetchCart,
} from "../store/slices/cartThunks";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items, loading } = useSelector((state) => state.wishlist);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [movingItemId, setMovingItemId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(fetchWishlist());
  }, [dispatch, isAuthenticated, navigate,]);

  const handleRemove = async (productId) => {
    const resultAction = await dispatch(toggleWishlistItem(productId));

    if (toggleWishlistItem.fulfilled.match(resultAction)) {
      dispatch(fetchWishlist());
    }
  };

  const handleMoveToCartClick = async (item) => {
    const hasSizes = item.sizes?.length > 0;
    const hasColors = item.colors?.length > 0;

    // If no variant selection needed → move directly
    if (!hasSizes && !hasColors) {
      setMovingItemId(item._id);

      const resultAction = await dispatch(
        moveWishlistItemToCart({
          productId: item._id,
          quantity: 1,
          size: null,
          color: null,
        })
      );

      setMovingItemId(null);

      if (moveWishlistItemToCart.fulfilled.match(resultAction)) {
        dispatch(fetchWishlist());
        dispatch(fetchCart());
      }

      return;
    }

    // Otherwise open selection modal
    setSelectedItem(item);
    setSelectedSize("");
    setSelectedColor("");
  };

  const handleConfirmMoveToCart = async () => {
    if (!selectedItem) return;

    const hasSizes = selectedItem.sizes?.length > 0;
    const hasColors = selectedItem.colors?.length > 0;

    if (hasSizes && !selectedSize) {
      alert("Please select a size.");
      return;
    }

    if (hasColors && !selectedColor) {
      alert("Please select a color.");
      return;
    }

    setMovingItemId(selectedItem._id);

    const resultAction = await dispatch(
      moveWishlistItemToCart({
        productId: selectedItem._id,
        quantity: 1,
        size: hasSizes ? selectedSize : null,
        color: hasColors ? selectedColor : null,
      })
    );

    setMovingItemId(null);

    if (moveWishlistItemToCart.fulfilled.match(resultAction)) {
      setSelectedItem(null);
      setSelectedSize("");
      setSelectedColor("");
      dispatch(fetchWishlist());
      dispatch(fetchCart());
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-500 mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">
            Loading wishlist...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="flex justify-center mb-4">
              <FiHeart size={40} className="text-gray-400" />
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Your wishlist is empty
            </h2>

            <p className="text-gray-500 mb-6">
              Save items you like in your wishlist and move them to bag later.
            </p>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="px-6 py-3 bg-pink-500 text-white rounded-md font-semibold hover:bg-pink-600 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => {
              const imageUrl =
                item.image && item.image.startsWith("http") ? item.image : null;

              const hasDiscount = item.discountPrice > 0;
              const finalPrice = hasDiscount ? item.discountPrice : item.price;

              const discountPercentage = hasDiscount
                ? Math.round(
                    ((item.price - item.discountPrice) / item.price) * 100
                  )
                : 0;

              return (
                <div
                  key={item._id}
                  className="border border-gray-200 rounded-lg bg-white overflow-hidden group"
                >
                  <div className="relative aspect-3/4 bg-gray-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
                        Product Image
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemove(item._id)}
                      className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white shadow flex items-center justify-center hover:bg-red-50"
                      title="Remove from wishlist"
                    >
                      <FiX size={18} />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-sm uppercase truncate">
                      {item.brand}
                    </h3>

                    <p className="text-sm text-gray-500 truncate mt-1">
                      {item.name}
                    </p>

                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm">₹{finalPrice}</span>

                      {hasDiscount && (
                        <>
                          <span className="text-gray-400 line-through text-xs">
                            ₹{item.price}
                          </span>
                          <span className="text-orange-500 text-xs font-semibold">
                            {discountPercentage}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleMoveToCartClick(item)}
                      disabled={movingItemId === item._id || !item.isActive}
                      className="w-full mt-4 border border-pink-500 text-pink-600 font-semibold py-2 rounded-md hover:bg-pink-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {!item.isActive
                        ? "UNAVAILABLE"
                        : movingItemId === item._id
                        ? "MOVING..."
                        : "MOVE TO BAG"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Variant Selection Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-xl p-6 relative">
            <button
              type="button"
              onClick={() => {
                setSelectedItem(null);
                setSelectedSize("");
                setSelectedColor("");
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Move to Bag
            </h2>

            <p className="text-sm text-gray-500 mb-5">{selectedItem.name}</p>

            {selectedItem.sizes?.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-semibold mb-2">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-full text-sm ${
                        selectedSize === size
                          ? "border-pink-500 text-pink-600 bg-pink-50"
                          : "border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedItem.colors?.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-semibold mb-2">Select Color</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-full text-sm ${
                        selectedColor === color
                          ? "border-pink-500 text-pink-600 bg-pink-50"
                          : "border-gray-300"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleConfirmMoveToCart}
              disabled={movingItemId === selectedItem._id}
              className="w-full bg-pink-500 text-white font-semibold py-3 rounded-md hover:bg-pink-600 transition disabled:opacity-50"
            >
              {movingItemId === selectedItem._id ? "MOVING..." : "CONFIRM"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WishlistPage;