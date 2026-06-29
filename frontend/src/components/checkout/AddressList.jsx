import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddresses } from "../../store/slices/addressThunks";
import AddressCard from "./AddressCard";

const AddressList = ({
  selectedAddressId,
  setSelectedAddressId,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  onDeliver,
}) => {
  const dispatch = useDispatch();

  const { addresses, loading } = useSelector(
    (state) => state.address
  );


  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  

  if (loading) {
    return (
      <div className="py-10 text-center text-[#696b79]">
        Loading addresses...
      </div>
    );
  }

  return (
    <div>

      {/* Header */}

      <div className="flex items-center justify-between border-b border-[#eaeaec] pb-5">

        <h2 className="text-[18px] font-semibold text-[#282c3f]">
          Select Delivery Address
        </h2>

        <button
          type="button"
          onClick={onAddAddress}
          className="border border-[#ff3f6c] text-[#ff3f6c] px-5 py-2 text-[13px] font-semibold uppercase rounded"
        >
          + Add New Address
        </button>

      </div>

      {/* Empty */}

      {!addresses.length ? (
        <div className="py-16 text-center text-[#696b79]">
          No saved address found.
        </div>
      ) : (
        <div className="mt-6">

          {addresses.map((address) => (

            <AddressCard
              key={address._id}
              address={address}
              selected={selectedAddressId === address._id}
              onSelect={() =>
                setSelectedAddressId(address._id)
              }
              onEdit={() =>
                onEditAddress?.(address)
              }
              onDelete={() =>
                onDeleteAddress?.(address)
              }
              onDeliver={() =>
                onDeliver?.(address)
              }
            />

          ))}

        </div>
      )}

    </div>
  );
};

export default AddressList;