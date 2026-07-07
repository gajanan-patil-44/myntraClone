import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchAdminOrderById,
  // updateOrderStatus,
  updateOrderItemStatus,
} from "../../../store/slices/adminOrderThunks";

const AdminOrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedOrder, loading } = useSelector((state) => state.adminOrder);

  // const [status, setStatus] = useState("");
  const [itemStatuses, setItemStatuses] = useState({});

  useEffect(() => {
    dispatch(fetchAdminOrderById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!selectedOrder) return;
    const statuses = {};
    selectedOrder.orderItems.forEach((item) => {
      statuses[item._id] = item.orderStatus;
    });

    setItemStatuses(statuses);
  }, [selectedOrder]);

  // const handleUpdate = async () => {
  //   await dispatch(
  //     updateOrderStatus({
  //       id,
  //       orderStatus: status,
  //     }),
  //   );

  //   dispatch(fetchAdminOrderById(id));
  // };

  const handleItemStatusUpdate = async (itemId) => {
    // console.log("Before Dispatch");

    const result = await dispatch(
      updateOrderItemStatus({
        orderId: id,
        itemId,
        orderStatus: itemStatuses[itemId],
      }),
    );

    //   console.log("After Dispatch");
    // console.log(JSON.stringify(result, null, 2));
  };

  if (loading || !selectedOrder) {
    return <div className="text-center mt-10 text-lg">Loading Order...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold mb-4">Customer Information</h2>

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {selectedOrder.userId.firstName} {selectedOrder.userId.lastName}
            </p>

            <p>
              <span className="font-medium">Email:</span>{" "}
              {selectedOrder.userId.email}
            </p>

            <p>
              <span className="font-medium">Phone:</span>{" "}
              {selectedOrder.shippingAddress.phone}
            </p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>

          <div className="space-y-2 text-sm">
            <p>{selectedOrder.shippingAddress.fullName}</p>

            <p>{selectedOrder.shippingAddress.address}</p>

            <p>{selectedOrder.shippingAddress.locality}</p>

            <p>
              {selectedOrder.shippingAddress.city},{" "}
              {selectedOrder.shippingAddress.state}
            </p>

            <p>{selectedOrder.shippingAddress.pincode}</p>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold mb-4">Payment Details</h2>

          <div className="space-y-3 text-sm">
            {/* Payment Method */}
            <div className="flex justify-between">
              <span className="font-medium">Method:</span>
              <span>{selectedOrder.paymentMethod}</span>
            </div>

            {/* Payment Status */}
            <div className="flex justify-between">
              <span className="font-medium">Payment Status:</span>

              <span
                className={`font-semibold ${
                  selectedOrder.paymentStatus === "paid"
                    ? "text-green-600"
                    : selectedOrder.paymentStatus === "failed"
                      ? "text-red-600"
                      : "text-yellow-600"
                }`}
              >
                {selectedOrder.paymentStatus}
              </span>
            </div>

            {/* Paid On */}
            <div className="flex justify-between">
              <span className="font-medium">Paid On:</span>

              <span>
                {selectedOrder.paidAt
                  ? new Date(selectedOrder.paidAt).toLocaleString()
                  : "-"}
              </span>
            </div>

            {/* Total Amount */}
            <div className="flex justify-between">
              <span className="font-medium">Total Amount:</span>
              <span>₹{selectedOrder.totalPrice}</span>
            </div>

            {/* Razorpay Order ID */}
            {selectedOrder.paymentMethod === "Razorpay" &&
              selectedOrder.razorpayOrderId && (
                <div className="pt-3 border-t">
                  <p className="font-medium mb-1">Razorpay Order ID</p>

                  <p className="text-xs break-all text-gray-600">
                    {selectedOrder.razorpayOrderId}
                  </p>
                </div>
              )}

            {/* Razorpay Payment ID */}
            {selectedOrder.paymentMethod === "Razorpay" &&
              selectedOrder.razorpayPaymentId && (
                <div>
                  <p className="font-medium mb-1">Razorpay Payment ID</p>

                  <p className="text-xs break-all text-gray-600">
                    {selectedOrder.razorpayPaymentId}
                  </p>
                </div>
              )}

            {/* Payment Failure Reason */}
            {selectedOrder.paymentStatus === "failed" &&
              selectedOrder.paymentFailureReason && (
                <div className="pt-3 border-t">
                  <p className="font-medium text-red-600 mb-1">
                    Payment Failure Reason
                  </p>

                  <p className="text-sm text-red-500">
                    {selectedOrder.paymentFailureReason}
                  </p>
                </div>
              )}
          </div>
        </div>
        {/* <div className="bg-white rounded-lg shadow p-5 mt-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{selectedOrder.subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{selectedOrder.taxPrice}</span>
            </div>

            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span>₹{selectedOrder.platformFee}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{selectedOrder.shippingPrice}</span>
            </div>

            <hr />

            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>₹{selectedOrder.totalPrice}</span>
            </div>
          </div>
        </div> */}
      </div>
      {/* Ordered Products */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold">Ordered Products</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-center">Size</th>
                <th className="px-4 py-3 text-center">Color</th>
                <th className="px-4 py-3 text-center">Price</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {selectedOrder.orderItems.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />

                      <span className="font-medium">{item.name}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center">{item.quantity}</td>

                  <td className="px-4 py-3 text-center">{item.size || "-"}</td>

                  <td className="px-4 py-3 text-center">{item.color || "-"}</td>

                  <td className="px-4 py-3 text-center">
                    ₹{item.priceAtPurchase}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <select
                      value={itemStatuses[item._id] || item.orderStatus}
                      onChange={(e) =>
                        setItemStatuses((prev) => ({
                          ...prev,
                          [item._id]: e.target.value,
                        }))
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleItemStatusUpdate(item._id)}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Status */}
      {/* <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Update Order Status</h2>

        <div className="flex flex-wrap items-center gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={handleUpdate}
            className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded"
          >
            Update Status
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default AdminOrderDetailsPage;
