import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "./store/slices/authThunks";
import { Toaster } from "react-hot-toast";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
      <Toaster
    position="top-right"
    toastOptions={{
      duration: 3000,
    }}
  />
    </>
  );
};

export default App;
