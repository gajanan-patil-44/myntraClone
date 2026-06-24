import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  clearAuthError,
  resetOtpState,
} from "../../store/slices/authSlice";
import {
  loginUser,
  sendOtp,
  verifyOtpLogin,
} from "../../store/slices/authThunks";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, otpSent } = useSelector(
    (state) => state.auth
  );

  const [loginMode, setLoginMode] = useState("password"); // password | otp
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const switchToPasswordMode = () => {
    setLoginMode("password");
    dispatch(clearAuthError());
    dispatch(resetOtpState());

    setFormData((prev) => ({
      ...prev,
      otp: "",
    }));
  };

  const switchToOtpMode = () => {
    setLoginMode("otp");
    dispatch(clearAuthError());
    dispatch(resetOtpState());

    setFormData((prev) => ({
      ...prev,
      otp: "",
      password: "",
    }));
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();

    dispatch(clearAuthError());

    const resultAction = await dispatch(
      loginUser({
        email: formData.email,
        password: formData.password,
      })
    );

    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/");
    }
  };

  const handleSendOtp = async () => {
    dispatch(clearAuthError());

    if (!formData.email.trim()) {
      return;
    }

    await dispatch(
      sendOtp({
        email: formData.email.trim(),
      })
    );
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    dispatch(clearAuthError());

    const resultAction = await dispatch(
      verifyOtpLogin({
        email: formData.email,
        otp: formData.otp,
      })
    );

    if (verifyOtpLogin.fulfilled.match(resultAction)) {
      navigate("/");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
      dispatch(resetOtpState());
    };
  }, [dispatch]);

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Login to your account
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Use your email with password or OTP.
        </p>

        {/* Mode Toggle */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={switchToPasswordMode}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              loginMode === "password"
                ? "bg-white shadow text-pink-600"
                : "text-gray-600"
            }`}
          >
            Password
          </button>

          <button
            type="button"
            onClick={switchToOtpMode}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              loginMode === "otp"
                ? "bg-white shadow text-pink-600"
                : "text-gray-600"
            }`}
          >
            OTP
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* PASSWORD LOGIN */}
        {loginMode === "password" && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-md transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login with Password"}
            </button>
          </form>
        )}

        {/* OTP LOGIN */}
        {loginMode === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label
                htmlFor="otp-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>

              <input
                id="otp-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading || !formData.email.trim()}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-md transition disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <>
                <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                  OTP sent successfully. Check backend console for the OTP.
                </div>

                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Enter OTP
                  </label>

                  <input
                    id="otp"
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter 6-digit OTP"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-md transition disabled:opacity-60"
                >
                  {loading ? "Verifying OTP..." : "Verify OTP & Login"}
                </button>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full border border-pink-500 text-pink-600 font-semibold py-3 rounded-md transition hover:bg-pink-50 disabled:opacity-60"
                >
                  Resend OTP
                </button>
              </>
            )}

            <button
              type="button"
              onClick={switchToPasswordMode}
              className="w-full text-sm text-gray-600 hover:text-pink-600"
            >
              Prefer password login instead?
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-gray-600 text-center">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-pink-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;