import { useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {fetchWishlist,toggleWishlistItem} from "../store/slices/wishlistThunks";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(fetchWishlist());
  }, [dispatch, isAuthenticated, navigate]);

  const handleRemove = async (productId) => {
    const resultAction = await dispatch(toggleWishlistItem(productId));

    if (toggleWishlistItem.fulfilled.match(resultAction)) {
      dispatch(fetchWishlist());
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          My Wishlist
        </h1>
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
            Save items you like in your wishlist. Review them anytime and easily move them to bag later.
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
              ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
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
                    ✕
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
                    className="w-full mt-4 border border-pink-500 text-pink-600 font-semibold py-2 rounded-md hover:bg-pink-50 transition"
                  >
                    MOVE TO CART
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default WishlistPage;