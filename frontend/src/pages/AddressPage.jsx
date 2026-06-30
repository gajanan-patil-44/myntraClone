import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CheckoutHeader from "../components/checkout/CheckoutHeader";
import AddressList from "../components/checkout/AddressList";
import AddressModal from "../components/checkout/AddressModal";
import DeleteAddressModal from "../components/checkout/DeleteAddressModal";
import PriceDetails from "../components/checkout/PriceDetails";
import { useNavigate } from "react-router-dom";

import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../store/slices/addressThunks";

const AddressPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addresses, loading, actionLoading } = useSelector(
    (state) => state.address,
  );

  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [showAddressModal, setShowAddressModal] = useState(false);

  const [editingAddress, setEditingAddress] = useState(null);

  const [deleteAddressData, setDeleteAddressData] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (!addresses.length || selectedAddressId) return;

    const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

    setSelectedAddressId(defaultAddress._id);
  }, [addresses, selectedAddressId]);

  // ---------------- ADD ----------------

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  // ---------------- EDIT ----------------

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  // ---------------- DELETE ----------------

  const handleDeleteClick = (address) => {
    setDeleteAddressData(address);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteAddressData) return;

    await dispatch(deleteAddress(deleteAddressData._id));

    setDeleteAddressData(null);
  };

  // ---------------- SAVE ----------------

  const handleSaveAddress = async (formData) => {
    if (editingAddress) {
      await dispatch(
        updateAddress({
          addressId: editingAddress._id,
          addressData: formData,
        }),
      );
    } else {
      const result = await dispatch(addAddress(formData));
      // console.log("ADD ADDRESS RESPONSE:", result);
    }

    setShowAddressModal(false);
    setEditingAddress(null);
  };

  // ---------------- DELIVER ----------------

  const handleContinueToPayment = () => {
  if (!selectedAddressId) {
    alert("Please select a delivery address.");
    return;
  }

  navigate("/payment", {
    state: {
      addressId: selectedAddressId,
    },
  });
};

  return (
    <div className="min-h-screen bg-[#fff]">
      <CheckoutHeader step="address" />

      <div className="max-w-[1100px] mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          {/* LEFT */}

          <AddressList
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            onAddAddress={handleAddAddress}
            onEditAddress={handleEditAddress}
            onDeleteAddress={handleDeleteClick}
          />

          {/* RIGHT */}

          <PriceDetails buttonText="CONTINUE TO PAYMENT"
          onButtonClick={handleContinueToPayment} />
        </div>
      </div>

      {/* Address Modal */}

      <AddressModal
        open={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
        }}
        initialData={editingAddress}
        onSave={handleSaveAddress}
        loading={actionLoading}
      />

      {/* Delete Modal */}

      <DeleteAddressModal
        open={!!deleteAddressData}
        loading={actionLoading}
        onClose={() => setDeleteAddressData(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default AddressPage;
