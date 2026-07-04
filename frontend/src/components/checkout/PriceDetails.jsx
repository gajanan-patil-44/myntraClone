import { useMemo } from "react";
import { useSelector } from "react-redux";

const PriceDetails = ({ buttonText = "CONTINUE", onButtonClick }) => {
  const { items } = useSelector((state) => state.cart);

  const { totalMRP, subtotal, totalDiscount, platformFee, finalAmount } =
    useMemo(() => {
      const totalMRP = Math.round(
        items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      );

      const subtotal = Math.round(
        items.reduce(
          (sum, item) => sum + item.effectivePrice * item.quantity,
          0,
        ),
      );

      const totalDiscount = totalMRP - subtotal;

      const platformFee = items.length > 0 ? 20 : 0;

      const finalAmount = subtotal + platformFee;

      return {
        totalMRP,
        subtotal,
        totalDiscount,
        platformFee,
        finalAmount,
      };
    }, [items]);

  return (
    <div className="sticky top-24">
      <div className="border border-[#eaeaec] bg-white rounded">
        <div className="p-5">
          <h3 className="text-[13px] font-bold uppercase text-[#535766]">
            PRICE DETAILS ({items.length} ITEM
            {items.length !== 1 ? "S" : ""})
          </h3>

          <div className="mt-5 space-y-4 text-[14px]">
            <div className="flex justify-between">
              <span>Total MRP</span>
              <span>₹{totalMRP}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount on MRP</span>

              <span className="text-[#03a685]">- ₹{totalDiscount}</span>
            </div>

            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-[#03a685]">FREE</span>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-[#eaeaec] flex justify-between font-bold">
            <span>Total Amount</span>

            <span>₹{finalAmount}</span>
          </div>

          <button
            type="button"
            onClick={onButtonClick}
            className="mt-6 w-full bg-[#ff3f6c] hover:bg-[#ff527b] text-white font-bold py-3 rounded"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceDetails;
