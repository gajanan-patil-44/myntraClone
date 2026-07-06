import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminOrders } from "../../../store/slices/adminOrderThunks";
import { useNavigate } from "react-router-dom";

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading } = useSelector((state) => state.adminOrder);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading orders...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between p-5 border-b">
        <h1 className="text-2xl font-bold">Order Management</h1>

        <span className="text-gray-500">Total Orders: {orders.length}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>

              <th className="px-4 py-3 text-left">Customer</th>

              <th className="px-4 py-3 text-center">Items</th>

              <th className="px-4 py-3 text-center">Total</th>

              <th className="px-4 py-3 text-center">Payment</th>

              <th className="px-4 py-3 text-center">Payment Status</th>

              <th className="px-4 py-3 text-center">Order Status</th>

              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    #{order._id}
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-medium">{order.userId?.email}</div>

                    <div className="text-sm text-gray-500">
                      {`${order.userId?.firstName || ""} ${order.userId?.lastName || ""}`.trim() ||
                        "N/A"}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {order.orderItems.length}
                  </td>

                  <td className="px-4 py-3 text-center font-semibold">
                    ₹{order.totalPrice}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {order.paymentMethod}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.orderStatus === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.orderStatus === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : order.orderStatus === "shipped"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>{" "}
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
