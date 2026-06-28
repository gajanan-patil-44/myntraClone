import { useEffect, useState } from "react";

const initialForm = {
  fullName: "",
  phone: "",
  pincode: "",
  locality: "",
  address: "",
  city: "",
  state: "",
  landmark: "",
  alternatePhone: "",
  addressType: "Home",
};

const AddressModal = ({
  open,
  onClose,
  onSave,
  initialData = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState(initialForm);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setFormData({
        fullName: initialData.fullName || "",
        phone: initialData.phone || "",
        pincode: initialData.pincode || "",
        locality: initialData.locality || "",
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        landmark: initialData.landmark || "",
        alternatePhone: initialData.alternatePhone || "",
        addressType: initialData.addressType || "Home",
      });
    } else {
      setFormData(initialForm);
    }

    setErrors({});
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Full name is required";

    if (!/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = "Enter valid mobile number";

    if (!/^[0-9]{6}$/.test(formData.pincode))
      newErrors.pincode = "Enter valid pincode";

    if (!formData.locality.trim())
      newErrors.locality = "Locality is required";

    if (!formData.address.trim())
      newErrors.address = "Address is required";

    if (!formData.city.trim())
      newErrors.city = "City is required";

    if (!formData.state.trim())
      newErrors.state = "State is required";

    if (
      formData.alternatePhone &&
      !/^[0-9]{10}$/.test(formData.alternatePhone)
    ) {
      newErrors.alternatePhone =
        "Alternate mobile should be 10 digits";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">

      <div className="w-full max-w-2xl bg-white rounded shadow-xl max-h-[90vh] flex flex-col">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-[#eaeaec] px-6 py-5 shrink-0">

          <h2 className="text-lg font-bold text-[#282c3f]">

            {initialData
              ? "Edit Address"
              : "Add New Address"}

          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl leading-none font-light text-[#535766]"
          >
            ×
          </button>

        </div>

        <div className="flex-1 overflow-y-auto p-6">

          {/* Row 1 */}

          <div className="grid md:grid-cols-2 gap-5">

            <div>

              <input
                type="text"
                name="fullName"
                placeholder="Full Name*"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-[#d4d5d9] rounded px-4 py-3 outline-none focus:border-[#ff3f6c]"
              />

              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.fullName}
                </p>
              )}

            </div>

            <div>

              <input
                type="text"
                name="phone"
                placeholder="Mobile Number*"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-[#d4d5d9] rounded px-4 py-3 outline-none focus:border-[#ff3f6c]"
              />

              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phone}
                </p>
              )}

            </div>

          </div>
                    {/* Row 2 */}

          <div className="grid md:grid-cols-2 gap-5 mt-5">

            <div>

              <input
                type="text"
                name="pincode"
                placeholder="Pincode*"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full border border-[#d4d5d9] rounded px-4 py-3 outline-none focus:border-[#ff3f6c]"
              />

              {errors.pincode && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.pincode}
                </p>
              )}

            </div>

            <div>

              <input
                type="text"
                name="locality"
                placeholder="Locality / Town*"
                value={formData.locality}
                onChange={handleChange}
                className="w-full border border-[#d4d5d9] rounded px-4 py-3 outline-none focus:border-[#ff3f6c]"
              />

              {errors.locality && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.locality}
                </p>
              )}

            </div>

          </div>

          {/* Address */}

          <div className="mt-5">

            <textarea
              rows={4}
              name="address"
              placeholder="Address (House No, Building, Street, Area)*"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-[#d4d5d9] rounded px-4 py-3 resize-none outline-none focus:border-[#ff3f6c]"
            />

            {errors.address && (
              <p className="text-xs text-red-500 mt-1">
                {errors.address}
              </p>
            )}

          </div>

          {/* Row 3 */}

          <div className="grid md:grid-cols-2 gap-5 mt-5">

            <div>

              <input
                type="text"
                name="city"
                placeholder="City / District*"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-[#d4d5d9] rounded px-4 py-3 outline-none focus:border-[#ff3f6c]"
              />

              {errors.city && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.city}
                </p>
              )}

            </div>

            <div>

              <input
                type="text"
                name="state"
                placeholder="State*"
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-[#d4d5d9] rounded px-4 py-3 outline-none focus:border-[#ff3f6c]"
              />

              {errors.state && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.state}
                </p>
              )}

            </div>

          </div>

          {/* Row 4 */}

          <div className="grid md:grid-cols-2 gap-5 mt-5">

            <div>

              <input
                type="text"
                name="landmark"
                placeholder="Landmark (Optional)"
                value={formData.landmark}
                onChange={handleChange}
                className="w-full border border-[#d4d5d9] rounded px-4 py-3 outline-none focus:border-[#ff3f6c]"
              />

            </div>

            <div>

              <input
                type="text"
                name="alternatePhone"
                placeholder="Alternate Mobile (Optional)"
                value={formData.alternatePhone}
                onChange={handleChange}
                className="w-full border border-[#d4d5d9] rounded px-4 py-3 outline-none focus:border-[#ff3f6c]"
              />

              {errors.alternatePhone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.alternatePhone}
                </p>
              )}

            </div>

          </div>

          {/* Address Type */}

          <div className="mt-8">

            <p className="text-sm font-semibold text-[#282c3f] mb-4">
              Save Address As
            </p>

            <div className="flex gap-4">

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    addressType: "Home",
                  }))
                }
                className={`px-6 py-2 rounded-full border font-medium transition ${
                  formData.addressType === "Home"
                    ? "border-[#ff3f6c] text-[#ff3f6c]"
                    : "border-[#d4d5d9]"
                }`}
              >
                Home
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    addressType: "Work",
                  }))
                }
                className={`px-6 py-2 rounded-full border font-medium transition ${
                  formData.addressType === "Work"
                    ? "border-[#ff3f6c] text-[#ff3f6c]"
                    : "border-[#d4d5d9]"
                }`}
              >
                Work
              </button>

            </div>

          </div>
                    {/* Save Button */}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-8 bg-[#ff3f6c] hover:bg-[#ff527b] disabled:bg-[#ff9bb3] text-white font-bold py-4 rounded transition"
          >
            {loading
              ? initialData
                ? "UPDATING..."
                : "SAVING..."
              : initialData
              ? "UPDATE ADDRESS"
              : "SAVE ADDRESS"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default AddressModal;