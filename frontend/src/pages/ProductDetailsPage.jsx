import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { FiStar, FiHeart, FiTruck } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCart } from "../store/slices/cartThunks";
import { fetchAddresses } from "../store/slices/addressThunks";
import DeliveryAddressModal from "../components/product/DeliveryAddressModal";
import { getProductReviews } from "../api/reviewApi";
import { toast } from "react-hot-toast";

import {
  fetchWishlist,
  toggleWishlistItem,
} from "../store/slices/wishlistThunks";

const ProductDetailsPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sizeError, setSizeError] = useState("");

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.some((item) => item._id === product?._id);
  const { items: cartItems } = useSelector((state) => state.cart);
  const [selectedColor, setSelectedColor] = useState("");
  // console.log(cartItems);
  // const isInCart = cartItems.some(
  //   (item) => item.productId === product?._id && item?.size === selectedSize
  // );

  const { addresses } = useSelector((state) => state.address);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [reviews, setReviews] = useState([]);

  const hasSizes = product?.sizes?.length > 0;
  const hasColors = product?.colors?.length > 0;
  const isInCart = cartItems.some((item) => {
    if (item.productId !== product?._id) return false;

    if (hasSizes && item.size !== selectedSize) return false;

    if (hasColors && item.color !== selectedColor) return false;

    return true;
  });
  //add to bag
  const handleAddToBag = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isInCart) {
      navigate("/cart");
      return;
    }

    if (hasSizes && !selectedSize) {
      setSizeError("Please select a size");
      return;
    }

    if (hasColors && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    setSizeError("");

    const resultAction = await dispatch(
      addToCart({
        productId: product._id,
        quantity: 1,
        size: hasSizes ? selectedSize : null,
        color: hasColors ? selectedColor : null,
      }),
    );

    if (addToCart.fulfilled.match(resultAction)) {
      dispatch(fetchCart());
    }
  };

  //wishlist
  const handleWishlist = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const resultAction = await dispatch(toggleWishlistItem(product._id));

    if (toggleWishlistItem.fulfilled.match(resultAction)) {
      dispatch(fetchWishlist());
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAddresses());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.product);
        const reviewData = await getProductReviews(response.data.product._id);
        // console.log(reviewData);

        setReviews(reviewData);
      } catch (error) {
        console.error(error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0]._id);
    }
  }, [addresses, selectedAddressId]);

  if (loading) {
    return <div className="max-w-7xl mx-auto py-10 px-4">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4">Product not found.</div>
    );
  }

  const selectedAddress =
    addresses.find((address) => address._id === selectedAddressId) ||
    addresses[0] ||
    null;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  const formattedDate = deliveryDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
  });

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">Loading...</div>
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
                  className={`w-12 h-8 rounded-full border font-medium transition-all
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
          {sizeError && (
            <p className="mt-3 text-sm text-red-500 font-medium">{sizeError}</p>
          )}
          {/* //</size section> */}
          {/* Color Section */}
          {/* Color Section */}
          {product?.colors?.length > 0 && (
            <div className="mt-8">
              <h3 className="font-bold text-sm tracking-wide mb-4">
                SELECT COLOR
              </h3>

              <div className="flex flex-wrap gap-4">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    className={`w-8 h-8 rounded-full border-1 transition-all flex items-center justify-center ${
                      selectedColor === color
                        ? "border-[#ff3f6c]"
                        : "border-gray-300"
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                  </button>
                ))}
              </div>

              {selectedColor && (
                <p className="mt-3 text-sm text-gray-600">
                  Selected:{" "}
                  <span className="font-semibold">{selectedColor}</span>
                </p>
              )}
            </div>
          )}

          {/* //<addToCart and wishlist> */}
          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={handleAddToBag}
              className="cursor-pointer flex-1 h-14 bg-[#ff3f6c] hover:bg-[#ff527b] text-white font-bold rounded-md uppercase transition-colors"
            >
              {isInCart ? "GO TO BAG" : "ADD TO BAG"}{" "}
            </button>

            <button
              type="button"
              onClick={handleWishlist}
              className={`cursor-pointer w-44 h-14 border rounded-md font-bold uppercase flex items-center justify-center gap-2 transition-colors
      ${
        isWishlisted
          ? "border-[#ff3f6c] text-[#ff3f6c]"
          : "border-gray-300 hover:border-black"
      }`}
            >
              <FiHeart size={20} />

              {isWishlisted ? "WISHLISTED" : "WISHLIST"}
            </button>
          </div>
          {/* //</addToBag and wishlist> */}

          <hr className="my-8 border-gray-200" />
          <div>
            <h3 className="flex items-center gap-2 font-bold uppercase text-[15px] text-[#282c3f] mb-5">
              DELIVERY OPTIONS
              <FiTruck size={18} className="text-[#282c3f]" />
            </h3>

            <div className="border border-[#d4d5d9] rounded px-4 py-3 flex items-center justify-between max-w-[320px]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[15px]">
                  {selectedAddress
                    ? `${selectedAddress.pincode} (${selectedAddress.fullName})`
                    : "No Address"}
                </span>

                {selectedAddress && (
                  <span className="text-[#03a685] text-lg">✓</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowDeliveryModal(true)}
                className="text-[#ff3f6c] font-semibold text-sm cursor-pointer"
              >
                CHANGE
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <p className="text-[15px] font-semibold text-[#282c3f]">
                Get it by <span className="font-bold">{formattedDate}</span>
              </p>

              <p className="text-[15px] text-[#282c3f]">
                Pay on delivery not available
              </p>

              <div className="flex items-center justify-between">
                <p className="text-[15px] text-[#282c3f]">
                  Easy 14 days return & exchange available
                </p>

                <button
                  type="button"
                  className="text-[#ff3f6c] text-xs font-bold cursor-pointer"
                >
                  MORE INFO
                </button>
              </div>
            </div>
          </div>
          {/* //</deliveryOption moreinfo> */}

          <hr className="my-10 border-[#eaeaec]" />

          <section>
            <h2 className="text-[16px] font-bold uppercase text-[#282c3f] mb-6">
              PRODUCT DETAILS
            </h2>

            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-[#282c3f]">Description</h3>

                <p className="mt-2 text-[15px] leading-7 text-[#535766]">
                  {product.description}
                </p>
              </div>
            </div>
          </section>
          {/* //RATING SECTION */}
          <div className="flex gap-12">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-5xl font-bold text-[#282c3f]">
                  {product.averageRating.toFixed(1)}
                </span>

                <span className="text-[#03a685] text-3xl">★</span>
              </div>

              <p className="mt-2 text-[#535766]">
                {product.reviewsCount} Ratings
              </p>
            </div>

            <div className="flex-1 max-w-md space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm w-6">{star}★</span>

                  <div className="flex-1 h-2 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-[#03a685] rounded"
                      style={{
                        width:
                          star <= Math.round(product.averageRating)
                            ? "90%"
                            : star === Math.ceil(product.averageRating)
                              ? "50%"
                              : "20%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* //review comment  */}
          <hr className="my-10 border-[#eaeaec]" />

          <section>
            <h2 className="text-[16px] font-bold uppercase text-[#282c3f] mb-8">
              CUSTOMER REVIEWS
            </h2>

            {reviews.length === 0 ? (
              <p className="text-[#535766]">No reviews yet.</p>
            ) : (
              <div className="space-y-8">
                {reviews.slice(0, 3).map((review) => (
                  <div
                    key={review._id}
                    className="border-b border-[#eaeaec] pb-6"
                  >
                    {/* Review */}

                    {review.comment && (
                      <div className="mt-4 text-[14px] leading-7 text-[#282c3f]">
                        {/* Rating Badge */}

                        <div className="mr-5 inline-flex items-center gap-1 bg-[#03a685] text-white text-sm font-semibold px-2 py-1 rounded">
                          {review.rating}

                          <span>★</span>
                        </div>
                        {review.comment}
                      </div>
                    )}

                    {/* Name + Date */}

                    <div className="mt-5 flex items-center gap-2 text-[13px] text-[#94969f]">
                      <span className="font-semibold text-[#535766]">
                        {review.userId?.firstName} {review.userId?.lastName}
                      </span>

                      <span>|</span>

                      <span>
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>

                      <span className="text-green-600 font-medium">
                        ✔ Verified Buyer
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <DeliveryAddressModal
        open={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        setSelectedAddressId={setSelectedAddressId}
        onDeliverHere={() => {
          setShowDeliveryModal(false);
        }}
      />
    </div>
  );
};

export default ProductDetailsPage;
