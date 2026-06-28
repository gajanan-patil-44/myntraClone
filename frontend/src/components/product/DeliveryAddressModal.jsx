const DeliveryAddressModal = ({
  open,
  onClose,
  addresses = [],
  selectedAddressId,
  setSelectedAddressId,
  onDeliverHere,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#eaeaec]">
          <div>
            <h2 className="text-lg font-bold text-[#282c3f]">
              Select Delivery Address
            </h2>

            <p className="text-sm text-[#535766] mt-1">
              Choose a saved address
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl leading-none text-[#535766] hover:text-black cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="p-6">

  <div className="space-y-4 max-h-[340px] overflow-y-auto">

    {addresses.map((address) => (

      <label
        key={address._id}
        className={`block border rounded-lg p-4 cursor-pointer transition ${
          selectedAddressId === address._id
            ? "border-[#ff3f6c]"
            : "border-[#d4d5d9]"
        }`}
      >

        <div className="flex gap-4">

          <input
            type="radio"
            checked={selectedAddressId === address._id}
            onChange={() => setSelectedAddressId(address._id)}
            className="mt-1 accent-[#ff3f6c]"
          />

          <div className="flex-1">

            <div className="flex items-center gap-2">

              <span className="font-semibold">
                {address.fullName}
              </span>

              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {address.addressType}
              </span>

            </div>

            <p className="text-sm text-gray-600 mt-2">
              {address.address}
            </p>

            <p className="text-sm text-gray-600">
              {address.locality}, {address.city}
            </p>

            <p className="text-sm text-gray-600">
              {address.state} - {address.pincode}
            </p>

            <p className="text-sm mt-2">
              Mobile:
              <span className="font-medium ml-1">
                {address.phone}
              </span>
            </p>

          </div>

        </div>

      </label>

    ))}

  </div>

  <button
    type="button"
    onClick={onDeliverHere}
    disabled={!selectedAddressId}
    className="w-full mt-6 bg-[#ff3f6c] text-white font-bold py-3 rounded hover:bg-[#ff527b] disabled:bg-gray-300 disabled:cursor-not-allowed"
  >
    DELIVER HERE
  </button>

</div>
      </div>
    </div>
  );
};

export default DeliveryAddressModal;
