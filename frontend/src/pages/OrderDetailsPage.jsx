import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { fetchOrderById } from "../store/slices/orderThunks";

import StarRating from "../components/review/StarRating";
import ReviewModal from "../components/review/ReviewModal";
import OrderItemTracker from "../components/orders/OrderItemTracker";
import { toast } from "react-hot-toast";

import {
  fetchMyReviews,
  updateRating,
  saveReview,
} from "../store/slices/reviewThunks";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedOrder, loading, error } = useSelector((state) => state.order);

  const {
    ratings,
    reviews,
    loading: reviewLoading,
  } = useSelector((state) => state.review);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchOrderById(id));
    dispatch(fetchMyReviews());
  }, [dispatch, id]);

  const handleSubmitReview = async ({ rating, comment }) => {
    if (!comment.trim()) {
  toast.error("Please write a review.");
  return;
}
    await dispatch(
      saveReview({
        productId: selectedProduct.productId,
        rating,
        comment,
      }),
    );

    dispatch(fetchMyReviews());

    setShowReviewModal(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-[1100px] mx-auto py-10">Loading order...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="max-w-[1100px] mx-auto py-10 text-red-500">{error}</div>
      </>
    );
  }

  if (!selectedOrder) {
    return (
      <>
        <Navbar />
        <div className="max-w-[1100px] mx-auto py-10">Order not found.</div>
      </>
    );
  }
  const orderStatuses = selectedOrder.orderItems.map(
    (item) => item.orderStatus,
  );

  const allSameStatus = orderStatuses.every(
    (status) => status === orderStatuses[0],
  );

  return (
    <>
      <Navbar />

      <div className="max-w-[1100px] mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Order Details</h1>

        {/* Order Status */}

        <div className="border border-[#eaeaec] rounded-lg bg-white p-6">
          {allSameStatus && (
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  orderStatuses[0] === "delivered"
                    ? "bg-green-500"
                    : orderStatuses[0] === "cancelled"
                      ? "bg-red-500"
                      : "bg-orange-500"
                }`}
              />

              <h2 className="text-xl font-semibold capitalize text-[#282c3f]">
                {orderStatuses[0]}
              </h2>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-[#696b79]">Order ID</p>

              <p className="font-semibold break-all">{selectedOrder._id}</p>
            </div>

            <div>
              <p className="text-sm text-[#696b79]">Ordered On</p>

              <p className="font-semibold">
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#696b79]">Payment</p>

              <p className="font-semibold">{selectedOrder.paymentMethod}</p>
            </div>
          </div>
          {/* Ordered Products */}

          <div className="mt-8 border border-[#eaeaec] rounded-lg bg-white p-6">
            <h2 className="text-xl font-semibold text-[#282c3f] mb-6">
              Ordered Products
            </h2>

            <div className="space-y-6">
              {selectedOrder.orderItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-5 border-b border-[#f2f2f2] pb-6 last:border-b-0 last:pb-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-36 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#282c3f]">
                      {item.name}
                    </h3>

                    <p className="mt-2 text-[#696b79]">
                      Size: {item.size || "-"}
                    </p>

                    <p className="mt-1 text-[#696b79]">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-3 font-semibold text-lg">
                      ₹{item.priceAtPurchase}
                    </p>
                    {/* // status tracker component */}
                    <OrderItemTracker
                      status={item.orderStatus}
                      deliveredAt={item.deliveredAt}
                    />

                    {/* Review Section */}
                    {item.orderStatus === "delivered" && (
                      <div className="mt-5">
                        <StarRating
                          value={ratings[item.productId] || 0}
                          onChange={(rating) => {
                            dispatch(
                              updateRating({
                                productId: item.productId,
                                rating,
                              }),
                            );
                          }}
                        />

                        <button
                          onClick={() => {
                            // console.log("Review button clicked");

                            setSelectedProduct({
                              ...item,
                              existingReview: reviews[item.productId] || null,
                            });

                            setShowReviewModal(true);
                          }}
                          className="mt-3 text-[#ff3f6c] font-semibold hover:underline"
                        >
                          {ratings[item.productId]
                            ? "Edit Review"
                            : "Write Review"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Delivery Address */}

          <div className="mt-8 border border-[#eaeaec] rounded-lg bg-white p-6">
            <h2 className="text-xl font-semibold text-[#282c3f] mb-6">
              Delivery Address
            </h2>

            <div className="space-y-2">
              <h3 className="font-semibold text-[#282c3f]">
                {selectedOrder.shippingAddress.fullName}
              </h3>

              <p className="text-[#696b79]">
                {selectedOrder.shippingAddress.address}
              </p>

              <p className="text-[#696b79]">
                {selectedOrder.shippingAddress.locality}
              </p>

              <p className="text-[#696b79]">
                {selectedOrder.shippingAddress.city},{" "}
                {selectedOrder.shippingAddress.state} -{" "}
                {selectedOrder.shippingAddress.pincode}
              </p>

              {selectedOrder.shippingAddress.landmark && (
                <p className="text-[#696b79]">
                  Landmark: {selectedOrder.shippingAddress.landmark}
                </p>
              )}

              <p className="pt-3">
                <span className="text-[#696b79]">Mobile: </span>

                <span className="font-semibold">
                  {selectedOrder.shippingAddress.phone}
                </span>
              </p>

              {selectedOrder.shippingAddress.alternatePhone && (
                <p>
                  <span className="text-[#696b79]">Alternate Mobile: </span>

                  <span className="font-semibold">
                    {selectedOrder.shippingAddress.alternatePhone}
                  </span>
                </p>
              )}
            </div>
          </div>
          {/* Payment & Price Summary */}

          <div className="mt-8 border border-[#eaeaec] rounded-lg bg-white p-6">
            <h2 className="text-xl font-semibold text-[#282c3f] mb-6">
              Payment Details
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-[#696b79]">Payment Method</span>
                <span className="font-semibold">
                  {selectedOrder.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#696b79]">Payment Status</span>

                <span
                  className={`font-bold capitalize ${
                    selectedOrder.paymentStatus === "paid"
                      ? "text-green-600"
                      : selectedOrder.paymentStatus === "failed"
                        ? "text-red-600"
                        : "text-orange-500"
                  }`}
                >
                  {selectedOrder.paymentStatus}
                </span>
              </div>

              <hr />

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹{selectedOrder.platformFee}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>

                <span>
                  {selectedOrder.shippingPrice === 0 ? (
                    <span className="text-[#03a685]">FREE</span>
                  ) : (
                    `₹${selectedOrder.shippingPrice}`
                  )}
                </span>
              </div>

              <hr />

              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span>₹{selectedOrder.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReviewModal
        open={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        loading={reviewLoading}
        onSubmit={handleSubmitReview}
      />
    </>
  );
};

export default OrderDetailsPage;
