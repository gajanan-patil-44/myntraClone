import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../store/slices/authThunks";
import { useEffect, useState } from "react";
import { fetchInventoryAlerts } from "../../../store/slices/adminProductThunks";
import { Bell } from "lucide-react";

const AdminHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(resultAction)) {
      navigate("/");
    }
  };

  const { inventoryAlertCount, inventoryAlerts } = useSelector(
    (state) => state.adminProduct,
  );

  useEffect(() => {
    dispatch(fetchInventoryAlerts());
  }, [dispatch]);

  useEffect(() => {
    if (inventoryAlerts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAlertIndex((prev) => (prev + 1) % inventoryAlerts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [inventoryAlerts]);
  // console.log(inventoryAlerts[0])
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-8 py-5">
        {/* ===================== Top Row ===================== */}
        <div className="flex items-center justify-between">
          {/* Left - Admin Greeting */}
          <div className="min-w-56">
            <p className="text-sm text-gray-500 font-medium">Welcome back,</p>

            <h2 className="text-2xl font-bold text-gray-800">Gajanan 👋</h2>

            <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">
              Administrator
            </p>
          </div>

          {/* Center - Inventory Notification
          <div className="flex-1 flex justify-center px-8">
            {inventoryAlerts.length > 0 && (
              <div
                onClick={() => {
                  navigate(
                    `/admin/products/edit/${inventoryAlerts[currentAlertIndex]._id}`,
                  );
                }}
                className={`w-[620px] h-20 cursor-pointer rounded-xl border-l-4 px-5 shadow-sm transition-all duration-300 flex items-center            ${
                  inventoryAlerts[currentAlertIndex].status === "out_of_stock"
                    ? "border-red-500 bg-red-50 hover:bg-red-100"
                    : "border-orange-500 bg-orange-50 hover:bg-orange-100"
                }`}
              >
                <div className="flex w-full items-center ">
                  <div className="flex flex-1 items-center gap-4 min-w-0">
                    <div
                      className={`h-3 w-3 rounded-full animate-pulse
                  ${
                    inventoryAlerts[currentAlertIndex].status === "out_of_stock"
                      ? "bg-red-500"
                      : "bg-orange-500"
                  }`}
                    />

                    <div className="flex items-center gap-3 whitespace-nowrap overflow-hidden">
                      {" "}
                      <span
                        className={`text-xs font-bold uppercase tracking-[2px]
                    ${
                      inventoryAlerts[currentAlertIndex].status ===
                      "out_of_stock"
                        ? "text-red-600"
                        : "text-orange-600"
                    }`}
                      >
                        {inventoryAlerts[currentAlertIndex].status ===
                        "out_of_stock"
                          ? "OUT OF STOCK"
                          : "LOW STOCK"}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="max-w-[220px] truncate font-semibold text-gray-900">
                        {inventoryAlerts[currentAlertIndex].name}
                      </span>
                      <span className="text-gray-500">
                        {inventoryAlerts[currentAlertIndex].status ===
                        "out_of_stock"
                          ? "Out of stock"
                          : `${inventoryAlerts[currentAlertIndex].stock} left`}
                      </span>
                    </div>
                  </div>

                  <button
                    className={`ml-6 rounded-full px-4 py-2 text-sm font-semibold transition
                ${
                  inventoryAlerts[currentAlertIndex].status === "out_of_stock"
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                }`}
                  >
                    Restock →
                  </button>
                </div>
              </div>
            )}
          </div> */}

          {/* Right */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative rounded-full p-2 hover:bg-gray-100 transition"
            >
              <Bell size={24} className="text-gray-700" />

              {inventoryAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                  {inventoryAlertCount}
                </span>
              )}
            </button>

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
