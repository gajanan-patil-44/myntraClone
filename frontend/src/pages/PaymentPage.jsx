import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, verifyPayment } from "../store/slices/orderThunks";
import CheckoutHeader from "../components/checkout/CheckoutHeader";
import PriceDetails from "../components/checkout/PriceDetails";
import { useState } from "react";

const PaymentPage = () => {
  const { state } = useLocation();
  const addressId = state?.addressId;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.order);

  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!addressId) return;

    const result = await dispatch(
      createOrder({ addressId, paymentMethod })
    );

    if (!createOrder.fulfilled.match(result)) {
      alert(result.payload || "Order failed");
      return;
    }

    const data = result.payload;
    console.log("Mongo Order:", data.order);
console.log("Razorpay Order:", data.razorpayOrder);

    // ------------------------
    // COD FLOW
    // ------------------------
    if (paymentMethod === "COD") {
      navigate("/orders");
      return;
    }

    // ------------------------
    // RAZORPAY FLOW
    // ------------------------
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load");
      return;
    }

    const { order, razorpayOrder, key, customer } = data;

    const options = {
      key,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "Myntra Clone",
      description: "Order Payment",
      order_id: razorpayOrder.id,

      prefill: {
        name: customer?.name,
        email: customer?.email,
        contact: customer?.contact,
      },

      handler: async function (response) {
        const verifyResult = await dispatch(
          verifyPayment({
            orderId: order._id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })
        );

        if (verifyPayment.fulfilled.match(verifyResult)) {
          navigate("/orders");
        } else {
          alert("Payment verification failed");
        }
      },

      theme: {
        color: "#ff3f6c",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  if (!addressId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">
          No delivery address selected.
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <CheckoutHeader step="payment" />

      <div className="max-w-[1100px] mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

          {/* LEFT */}
          <div className="border border-[#eaeaec] rounded bg-white">
            <div className="border-b border-[#eaeaec] px-6 py-5">
              <h2 className="text-[18px] font-semibold">
                Choose Payment Method
              </h2>
            </div>

            <div className="p-6 space-y-6">

              {/* COD */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="mt-1"
                />

                <div>
                  <h3 className="font-semibold">Cash on Delivery</h3>
                  <p className="text-sm text-gray-500">
                    Pay when your order is delivered
                  </p>
                </div>
              </label>

              {/* Razorpay */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === "Razorpay"}
                  onChange={() => setPaymentMethod("Razorpay")}
                  className="mt-1"
                />

                <div>
                  <h3 className="font-semibold">Razorpay</h3>
                  <p className="text-sm text-gray-500">
                    Pay using UPI / Card / Netbanking
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* RIGHT */}
          <PriceDetails
            buttonText={
              loading
                ? "PROCESSING..."
                : paymentMethod === "COD"
                ? "PLACE ORDER"
                : "PAY NOW"
            }
            onButtonClick={handlePlaceOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;