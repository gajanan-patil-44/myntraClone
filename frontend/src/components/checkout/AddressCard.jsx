const AddressCard = ({
  address,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onDeliver,
}) => {
  return (
    <div
      className={`border rounded-md bg-white mb-5 transition-all ${
        selected
          ? "border-[#ff3f6c]"
          : "border-[#eaeaec]"
      }`}
    >
      {/* TOP */}
      <div
        className="p-5 cursor-pointer"
        onClick={onSelect}
      >
        {/* Radio + Type */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selected
                  ? "border-[#ff3f6c]"
                  : "border-gray-400"
              }`}
            >
              {selected && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff3f6c]" />
              )}
            </div>

            <span className="text-[13px] font-semibold uppercase bg-[#f5f5f6] px-2 py-1 rounded">
              {address.addressType}
            </span>

            {address.isDefault && (
              <span className="text-[11px] font-semibold border border-[#20bd99] text-[#20bd99] px-2 py-1 rounded">
                DEFAULT
              </span>
            )}

          </div>

        </div>

        {/* Name */}
        <div className="mt-5">

          <h3 className="text-[15px] font-bold text-[#282c3f]">
            {address.fullName}
          </h3>

          <p className="mt-1 text-[14px] text-[#282c3f]">
            {address.address}
          </p>

          <p className="text-[14px] text-[#282c3f]">
            {address.locality}
          </p>

          <p className="text-[14px] text-[#282c3f]">
            {address.city}, {address.state} - {address.pincode}
          </p>

          {address.landmark && (
            <p className="mt-2 text-[13px] text-[#696b79]">
              Landmark: {address.landmark}
            </p>
          )}

          <p className="mt-3 text-[14px]">
            Mobile:{" "}
            <span className="font-semibold">
              {address.phone}
            </span>
          </p>

          {address.alternatePhone && (
            <p className="text-[14px]">
              Alt Mobile:{" "}
              <span className="font-semibold">
                {address.alternatePhone}
              </span>
            </p>
          )}

          <p className="mt-4 text-[13px] text-[#696b79]">
            • Cash on Delivery available
          </p>

        </div>
      </div>

      {/* ACTIONS */}
      <div className="border-t border-[#eaeaec] flex">

        <button
          type="button"
          onClick={onEdit}
          className="flex-1 py-3 text-[13px] font-semibold border-r border-[#eaeaec]"
        >
          EDIT
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="flex-1 py-3 text-[13px] font-semibold"
        >
          REMOVE
        </button>

      </div>

      {/* DELIVER BUTTON */}

      {selected && (
        <div className="border-t border-[#eaeaec] p-4">

          <button
            type="button"
            onClick={onDeliver}
            className="w-full bg-[#ff3f6c] hover:bg-[#ff527b] text-white font-bold text-[14px] py-3 rounded"
          >
            DELIVER HERE
          </button>

        </div>
      )}
    </div>
  );
};

export default AddressCard;