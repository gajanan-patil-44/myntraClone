import { useDispatch } from "react-redux";
import  logoutUser  from "../../../store/slices/authSlice";
const AdminHeader = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-4">
      <div className="font-semibold">Admin Dashboard</div>

      <button
        onClick={handleLogout}
        className="px-3 py-1 bg-black text-white rounded"
      >
        Logout
      </button>
    </header>
  );
};

export default AdminHeader;