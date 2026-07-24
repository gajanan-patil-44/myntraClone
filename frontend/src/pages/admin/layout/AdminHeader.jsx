import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../store/slices/authThunks";
import { useEffect, useState, useRef } from "react";
import { fetchInventoryAlerts } from "../../../store/slices/adminProductThunks";
import { Bell } from "lucide-react";

const AdminHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(resultAction)) {
      navigate("/");
    }
  };

  const { inventoryAlertCount, inventoryAlerts } = useSelector(
    (state) => state.adminProduct,
  );
  // console.log(inventoryAlerts);

  useEffect(() => {
    dispatch(fetchInventoryAlerts());
  }, [dispatch]);

  
  // console.log(inventoryAlerts[0])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-8 py-3 mx-30">
        {/* ===================== Top Row ===================== */}
        <div className="flex items-center justify-between">
          {/* Left - Admin Greeting */}
          <div className="min-w-56 flex gap-6 mx-2.5">
            <p className="text-xl text-gray-500 font-medium">Welcome back</p>

            <h2 className="text-2xl font-bold text-gray-800">{user?.firstName} 👋</h2>

            <p className="text-xl uppercase tracking-widest text-gray-400 mt-1">
              Administrator
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-10 ref={notificationRef}">
            <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative rounded-full p-2 hover:bg-gray-100 transition "
            >
              <Bell size={24} className="text-gray-700" />
             

              {inventoryAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                  {inventoryAlertCount}
                </span>
              )}
            </button>
             {showNotifications && (
                <div className="absolute right-0 top-14 z-50 w-96 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                  {/* Header */}
                  <div className="border-b bg-gray-50 px-5 py-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Inventory Alerts
                    </h3>

                    <p className="text-sm text-gray-500">
                      {inventoryAlertCount} products require attention
                    </p>
                  </div>

                  {/* Alerts */}
                  <div className="max-h-96 overflow-y-auto">
                    {inventoryAlerts.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center gap-4 border-b px-5 py-4 transition hover:bg-gray-50"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover border"
                        />

                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">
                            {product.name}
                          </h4>

                          <p
                            className={`text-sm ${
                              product.stock === 0
                                ? "text-red-600"
                                : "text-orange-600"
                            }`}
                          >
                            {product.stock === 0
                              ? "Out of Stock"
                              : `Only ${product.stock} left`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="border-t bg-gray-50 p-3">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        navigate("/admin/products?inventory=alerts");
                      }}
                      className="w-full rounded-lg bg-pink-500 py-2 text-sm font-semibold text-white transition hover:bg-pink-600"
                    >
                      View All Alerts
                    </button>
                  </div>
                </div>
              )}
              </div>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-white font-medium hover:bg-black transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
