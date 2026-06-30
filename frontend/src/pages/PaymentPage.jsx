import CheckoutHeader from "../components/checkout/CheckoutHeader";
import PriceDetails from "../components/checkout/PriceDetails";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../store/slices/orderThunks";

const PaymentPage = () => {
  const { state } = useLocation();
  const addressId = state?.addressId;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.order);

  if (!addressId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">No delivery address selected.</h2>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    const resultAction = await dispatch(
      createOrder({
        addressId,
        paymentMethod: "COD",
      }),
    );

    if (createOrder.fulfilled.match(resultAction)) {
      navigate("/orders");
    } else {
      alert(resultAction.payload || "Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <CheckoutHeader step="payment" />

      <div className="max-w-[1100px] mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          {/* LEFT */}

          <div className="border border-[#eaeaec] rounded bg-white">
            <div className="border-b border-[#eaeaec] px-6 py-5">
              <h2 className="text-[18px] font-semibold text-[#282c3f]">
                Choose Payment Method
              </h2>
            </div>

            <div className="p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="radio" checked readOnly className="mt-1" />

                <div>
                  <h3 className="font-semibold text-[#282c3f]">
                    Cash on Delivery
                  </h3>

                  <p className="mt-1 text-[14px] text-[#696b79]">
                    Pay with cash when your order is delivered.
                  </p>
                </div>
              </label>

              <div className="mt-8 border-t border-[#eaeaec] pt-6">
                <label className="flex items-start gap-3 opacity-50">
                  <input type="radio" disabled className="mt-1" />

                  <div>
                    <h3 className="font-semibold">Razorpay</h3>

                    <p className="text-[14px]">Coming Soon</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <PriceDetails
            buttonText={loading ? "PLACING ORDER..." : "PLACE ORDER"}
            onButtonClick={handlePlaceOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
