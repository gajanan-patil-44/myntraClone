const DeleteAddressModal = ({
  open,
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded shadow-lg">

        <div className="px-6 py-5 border-b border-[#eaeaec]">

          <h2 className="text-lg font-semibold text-[#282c3f]">
            Delete Address
          </h2>

        </div>

        <div className="px-6 py-6">

          <p className="text-[#535766] text-sm leading-6">
            Are you sure you want to delete this address?
          </p>

        </div>

        <div className="flex border-t border-[#eaeaec]">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-4 border-r border-[#eaeaec] font-semibold text-[#535766]"
          >
            CANCEL
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-4 font-semibold text-[#ff3f6c]"
          >
            {loading ? "DELETING..." : "DELETE"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteAddressModal;