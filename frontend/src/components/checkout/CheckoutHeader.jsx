import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import logo from "../../assets/myntraLogo.jpg"; // use your current Myntra logo

const CheckoutHeader = ({ step = "address" }) => {
  const navigate = useNavigate();
  const activeClass = "text-[#20bd99] border-b-2 border-[#20bd99]";
  const inactiveClass = "text-[#696b79]";

  return (
    <header className="h-20 border-b border-[#eaeaec] bg-white">
      <div className="max-w-[1100px] h-full mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Myntra" className="h-11 object-contain" />
        </Link>

        {/* Steps */}
        <div className="flex items-center text-[13px] tracking-[3px] font-semibold">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className={step === "bag" ? activeClass : inactiveClass}
          >
            BAG
          </button>

          <div className="mx-4 text-gray-300">----------------</div>

          <button
            type="button"
            onClick={() => navigate("/address")}
            className={step === "address" ? activeClass : inactiveClass}
          >
            ADDRESS
          </button>

          <div className="mx-4 text-gray-300">----------------</div>

          <button
            type="button"
            disabled
            className={`cursor-not-allowed ${
              step === "payment" ? activeClass : inactiveClass
            }`}
          >
            PAYMENT
          </button>
        </div>

        {/* Secure */}
        <div className="flex items-center gap-2">
          <ShieldCheck size={28} className="text-[#20bd99]" />

          <span className="tracking-[3px] text-[13px] font-semibold text-[#535766]">
            100% SECURE
          </span>
        </div>
      </div>
    </header>
  );
};

export default CheckoutHeader;
