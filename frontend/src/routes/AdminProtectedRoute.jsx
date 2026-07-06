import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminProtectedRoute = () => {
 const { user, isAuthenticated, loading, authChecked } = useSelector(
  (state) => state.auth
);

  // console.log({
  //   loading,
  //   isAuthenticated,
  //   role: user?.role,
  // });

  if (!authChecked) {
  return <div>Loading...</div>;
}

  if (!isAuthenticated) {
    // console.log("RETURN: Login");
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    // console.log("RETURN: Home");
    return <Navigate to="/" replace />;
  }

  // console.log("RETURN: Outlet");
  return <Outlet />;
};

export default AdminProtectedRoute;