import { ORDER_STATUS_FLOW } from "../../constants/orderStatusFlow";
import { useEffect, useState } from "react";

const OrderItemTracker = ({ status, deliveredAt }) => {
  const steps = ORDER_STATUS_FLOW.filter((step) => step !== "cancelled");

  const currentIndex = steps.indexOf(status);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mt-3 max-w-[470px]">
      {/* Tracker */}

      <div className="flex items-start">
        {steps.map((step, index) => {
          const completed = index < currentIndex;

          const active = index === currentIndex;

          const delivered = status === "delivered";

          return (
            <div key={step} className="flex-1">
              {/* Circle + Line */}

              <div className="relative flex items-center">
                {/* Circle */}

                <div
                  className={`relative z-10 h-4 w-4 rounded-full border-2 transition-all duration-500

          ${
            delivered
              ? "bg-green-500 border-green-500"
              : completed
                ? "bg-green-500 border-green-500"
                : active
                  ? "bg-[#ff3f6c] border-[#ff3f6c] animate-pulse"
                  : "bg-white border-gray-300"
          }`}
                />

                {/* Connector */}

                {index !== steps.length - 1 && (
                  <div className="flex-1 h-[3px] bg-gray-200">
                    <div
                      className="h-full bg-green-500 transition-all duration-700 ease-out"
                      style={{
                        width: delivered
                          ? "100%"
                          : completed
                            ? animate
                              ? "100%"
                              : "0%"
                            : "0%",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Label */}

              <p
                className={`mt-2 text-center text-xs

                ${
                  delivered
                    ? "text-green-600 font-medium"
                    : completed
                      ? "text-green-600 font-medium"
                      : active
                        ? "text-[#282c3f] font-semibold"
                        : "text-gray-500"
                }`}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>

      {/* Status */}

      <div className="mt-4">
        <p className="text-sm text-gray-600">
          Status
          <span className="mx-1">•</span>
          <span className="capitalize font-semibold text-[#282c3f]">
            {status}
          </span>
        </p>

        {status === "delivered" && deliveredAt && (
          <p className="mt-1 text-xs text-gray-500">
            Delivered on{" "}
            {new Date(deliveredAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderItemTracker;
