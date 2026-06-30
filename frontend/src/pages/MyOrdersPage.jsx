import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Package,
  ChevronRight,
  Star,
  User,
  TicketPercent,
  CreditCard,
  MapPin,
  Crown,
  Wallet,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { fetchMyOrders } from "../store/slices/orderThunks";

const MyOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  // =========================
  // Status Helpers
  // =========================

  const getStatusConfig = (status) => {
    switch (status) {
      case "delivered":
        return {
          dot: "bg-green-600",
          title: "Delivered",
          subtitle: "Your order has been delivered",
        };

      case "shipped":
        return {
          dot: "bg-blue-500",
          title: "Shipped",
          subtitle: "Your order is on the way",
        };

      case "processing":
        return {
          dot: "bg-orange-500",
          title: "Processing",
          subtitle: "Seller is preparing your order",
        };

      case "cancelled":
        return {
          dot: "bg-red-500",
          title: "Cancelled",
          subtitle: "This order was cancelled",
        };

      default:
        return {
          dot: "bg-yellow-500",
          title: "Order Confirmed",
          subtitle: "Your order has been placed",
        };
    }
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="max-w-[1280px] mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-[#282c3f]">My Orders</h1>

          <div className="mt-8 space-y-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-44 rounded-md border border-[#eaeaec] animate-pulse bg-gray-100"
              />
            ))}
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // =========================
  // Empty
  // =========================

  if (!loading && orders.length === 0) {
    return (
      <>
        <Navbar />

        <div className="max-w-[1200px] mx-auto py-24 text-center">
          <Package size={70} className="mx-auto text-gray-400" />

          <h2 className="mt-6 text-2xl font-bold text-[#282c3f]">
            No Orders Yet
          </h2>

          <p className="mt-2 text-[#696b79]">
            Looks like you haven't placed an order yet.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-8 bg-[#ff3f6c] hover:bg-[#ff527b] text-white px-8 py-3 rounded font-semibold"
          >
            Continue Shopping
          </button>
        </div>

        <Footer />
      </>
    );
  }

  // =========================
  // Main UI
  // =========================

  return (
    <>
      <Navbar />

      <div className="max-w-[1000px] mx-auto px-6 py-24">
        <div className="grid grid-cols-[200px_1fr] gap-6 ">
          {/* ================= Sidebar ================= */}

          <aside className="border-r border-[#eaeaec] pr-8 ">
            {/* Account */}

            <div className="pb-6 w-5xl border-b border-[#eaeaec] ">
              <h2 className="text-[15px] font-bold text-[#282c3f]">Account</h2>

              <p className="text-[13px] text-[#282c3f]">Myntra User</p>
            </div>

            {/* Overview */}

            <div className="py-8 border-b border-[#eaeaec]">
              <h3 className="text-[11px] uppercase text-[#94969f] font-bold mb-5">
                Overview
              </h3>

              <button className="text-[16px] text-[#282c3f] hover:text-[#ff3f6c]">
                Dashboard
              </button>
            </div>

            {/* Orders */}

            <div className="py-8 border-b border-[#eaeaec]">
              <h3 className="text-[11px] uppercase text-[#94969f] font-bold mb-5">
                Orders
              </h3>

              <div className="border-l-[3px] border-[#14cda8] pl-4">
                <button className="text-[16px] font-semibold text-[#14cda8]">
                  Orders & Returns
                </button>
              </div>
            </div>

            {/* Credits */}

            <div className="py-8 border-b border-[#eaeaec]">
              <h3 className="text-[11px] uppercase text-[#94969f] font-bold mb-5">
                Credits
              </h3>

              <div className="space-y-3 text-[16px]">
                <p className="cursor-pointer hover:text-[#ff3f6c]">Coupons</p>

                <p className="cursor-pointer hover:text-[#ff3f6c]">
                  Myntra Credit
                </p>

                <p className="cursor-pointer hover:text-[#ff3f6c]">MynCash</p>
              </div>
            </div>

            {/* Account */}

            <div className="py-8">
              <h3 className="text-[11px] uppercase text-[#94969f] font-bold mb-5">
                Account
              </h3>

              <div className="space-y-3 text-[16px]">
                <p className="cursor-pointer hover:text-[#ff3f6c]">Profile</p>

                <p className="cursor-pointer hover:text-[#ff3f6c]">
                  Saved Cards
                </p>

                <p className="cursor-pointer hover:text-[#ff3f6c]">Addresses</p>

                <p className="cursor-pointer hover:text-[#ff3f6c]">
                  Myntra Insider
                </p>
              </div>
            </div>
          </aside>

          {/* ================= Right Side ================= */}

          <section className="pt-20">
            {/* INSIDER BANNER */}

            <div className="bg-gradient-to-r from-[#e8ecff] to-[#f7d8ff] rounded-sm px-6 py-2 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-bold tracking-wide text-[#282c3f]">
                  MYNTRA INSIDER
                </h3>

                <p className="text-[14px] text-[#282c3f] mt-1">
                  Earn 10 SuperCoins for every ₹100 purchase
                </p>
              </div>

              <button className="bg-[#ff3f6c] hover:bg-[#ff527b] text-white px-7 py-3 rounded font-semibold text-[14px]">
                Enroll Now
              </button>
            </div>

            {/* HEADER */}

            <div className="flex items-start justify-between mt-6">
              <div>
                <h1 className="text-[18px] font-semibold text-[#282c3f]">
                  All Orders
                </h1>

                <p className="text-[15px] text-[#535766]">from anytime</p>
              </div>

              <div className="flex gap-3">
                {/* Search */}

                <input
                  type="text"
                  placeholder="Search"
                  className="w-[260px] h-[42px] rounded-full border border-[#d4d5d9] px-5 text-[14px] outline-none focus:border-[#b5b6bb]"
                />

                {/* Filter */}

                <button className="h-[42px] px-6 rounded-full border border-[#d4d5d9] text-[14px] font-medium hover:bg-[#fafafa]">
                  Filters
                </button>
              </div>
            </div>

            {/* RESTOCK */}

            <div className="mt-8 bg-[#f7f8fc] rounded-sm p-5">
              <h3 className="font-semibold text-[18px] text-[#282c3f]">
                Restock These Products
              </h3>

              <div className="grid grid-cols-2 gap-4 mt-5">
                {orders.slice(0, 2).map((order) => {
                  const item = order.orderItems[0];

                  return (
                    <div
                      key={order._id}
                      onClick={() =>
                        navigate(
                          `/product/${item.productId._id || item.productId}`,
                        )
                      }
                      className="bg-white rounded-lg p-3 flex gap-4 items-center border border-[#ececec]"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 object-cover rounded"
                      />

                      <div>
                        <h4 className="font-semibold text-[15px] line-clamp-2">
                          {item.name}
                        </h4>

                        <p className="mt-2 text-[16px] font-bold">
                          ₹{item.priceAtPurchase}
                        </p>

                        {item.size && (
                          <div className="inline-block mt-2 bg-[#f3f3f3] rounded px-3 py-1 text-[13px]">
                            {item.size}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ORDERS */}

            <div className="mt-8 space-y-6">
              {" "}
              {orders.map((order) => {
                const firstItem = order.orderItems[0];

                const status = getStatusConfig(order.orderStatus);

                return (
                  <div
                    key={order._id}
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="bg-[#f5f5f6] p-4 rounded-sm cursor-pointer hover:bg-[#f1f2f4] transition"
                  >
                    {/* White Card */}

                    <div className="bg-white rounded-sm border border-[#eaeaec] overflow-hidden">
                      {/* Status */}

                      <div className="px-6 pt-5 pb-4">
                        <div className="flex items-start gap-3">
                          <Package
                            size={22}
                            className="text-[#03a685] mt-[2px]"
                          />

                          <div>
                            <h3 className="text-[22px] font-semibold text-[#03a685] capitalize leading-none">
                              {status.title}
                            </h3>

                            <p className="text-[14px] text-[#696b79] mt-1">
                              On{" "}
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Product */}

                      <div className="px-6 pb-5">
                        <div className=" rounded-xl border border-[#ececec] p-5 flex justify-between items-center hover:bg-[#f7f7f7]">
                          <div className="flex gap-5">
                            <img
                              src={firstItem.image}
                              alt={firstItem.name}
                              className="w-[72px] h-[92px] rounded-lg object-cover bg-white"
                            />

                            <div>
                              <h2 className="font-semibold text-[18px] text-[#282c3f]">
                                {firstItem.name}
                              </h2>

                              <p className="mt-2 text-[14px] text-[#696b79]">
                                Size: {firstItem.size || "-"}
                              </p>

                              <p className="text-[14px] text-[#696b79]">
                                Qty: {firstItem.quantity}
                              </p>

                              {firstItem.color && (
                                <p className="text-[14px] text-[#696b79]">
                                  Color: {firstItem.color}
                                </p>
                              )}

                              <p className="mt-3 text-[13px] text-[#94969f]">
                                Exchange / Return available as per policy
                              </p>
                            </div>
                          </div>

                          <ChevronRight size={24} className="text-[#94969f]" />
                        </div>
                      </div>

                      {/* Review */}

                      <div className="bg-[#fbf3fb] border-t border-[#f1e6f1] px-6 py-4 flex items-center justify-between">
                        <div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((i) => (
                              <Star
                                key={i}
                                size={18}
                                fill="#ff3f6c"
                                className="text-[#ff3f6c]"
                              />
                            ))}

                            <Star size={18} className="text-[#c7c7c7]" />
                          </div>

                          <p className="mt-2 text-[13px] text-[#696b79]">
                            Review & get a chance to win MynCash!
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/products/${firstItem.productId}`);
                          }}
                          className="text-[#ff3f6c] font-semibold text-[14px] hover:underline"
                        >
                          Write Review
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}{" "}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MyOrdersPage;
