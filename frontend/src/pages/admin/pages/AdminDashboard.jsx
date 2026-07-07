import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../../store/slices/adminDashboardThunks";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { stats, recentOrders, loading } = useSelector(
  (state) => state.adminDashboard
);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#282c3f] mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Products */}
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-pink-500">
          <p className="text-gray-500 text-sm">Total Products</p>

          <h2 className="text-3xl font-bold mt-2">
            {stats?.totalProducts || 0}
          </h2>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Orders</p>

          <h2 className="text-3xl font-bold mt-2">
            {stats?.totalOrders || 0}
          </h2>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Total Users</p>

          <h2 className="text-3xl font-bold mt-2">
            {stats?.totalUsers || 0}
          </h2>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm">Revenue</p>

          <h2 className="text-3xl font-bold mt-2">
            ₹{stats?.totalRevenue || 0}
          </h2>
        </div>

      </div>

      {/* Recent Orders */}
<div className="mt-10 bg-white rounded-xl shadow">
  <div className="flex items-center justify-between px-6 py-4 border-b">
    <h2 className="text-xl font-semibold text-[#282c3f]">
      Recent Orders
    </h2>

    <button
      onClick={() => navigate("/admin/orders")}
      className="text-pink-500 hover:underline font-medium"
    >
      View All
    </button>
  </div>

  <div className="overflow-x-auto">
    <table className="min-w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left">Order ID</th>
          <th className="px-6 py-3 text-left">Customer</th>
          <th className="px-6 py-3 text-center">Amount</th>
          <th className="px-6 py-3 text-center">Payment</th>
          <th className="px-6 py-3 text-center">Status</th>
          <th className="px-6 py-3 text-center">Action</th>
        </tr>
      </thead>

      <tbody>
        {recentOrders.map((order) => (
          <tr
            key={order._id}
            className="border-b hover:bg-gray-50"
          >
            <td className="px-6 py-4 font-medium">
              #{order._id.slice(-6).toUpperCase()}
            </td>

            <td className="px-6 py-4">
              <div className="font-medium">
                {`${order.userId?.firstName || ""} ${
                  order.userId?.lastName || ""
                }`.trim() || "N/A"}
              </div>

              <div className="text-sm text-gray-500">
                {order.userId?.email}
              </div>
            </td>

            <td className="px-6 py-4 text-center font-semibold">
              ₹{order.totalPrice}
            </td>

            <td className="px-6 py-4 text-center">
              {order.paymentMethod}
            </td>

            <td className="px-6 py-4 text-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
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

            <td className="px-6 py-4 text-center">
              <button
                onClick={() =>
                  navigate(`/admin/orders/${order._id}`)
                }
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
              >
                View
              </button>
            </td>
          </tr>
        ))}

        {recentOrders.length === 0 && (
          <tr>
            <td
              colSpan="6"
              className="text-center py-8 text-gray-500"
            >
              No recent orders found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
    </div>
  );
};

export default AdminDashboard;