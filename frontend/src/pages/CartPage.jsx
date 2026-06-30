import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCart,
  updateCartQuantity,
  updateCartItemVariant,
  removeCartItem,
} from "../store/slices/cartThunks";
import {
  toggleWishlistItem,
  fetchWishlist,
} from "../store/slices/wishlistThunks";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items, loading, error } = useSelector((state) => state.cart);

  const [selectedItems, setSelectedItems] = useState([]);
  const [quantityModalItem, setQuantityModalItem] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [sizeModalItem, setSizeModalItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const handlePlaceOrder = () => {
  navigate("/address");
};

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(fetchCart());
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    if (items.length > 0) {
      setSelectedItems(items.map((item) => item.cartItemId));
    } else {
      setSelectedItems([]);
    }
  }, [items]);

  const selectedCartItems = useMemo(() => {
    return items.filter((item) => selectedItems.includes(item.cartItemId));
  }, [items, selectedItems]);

  const selectedCount = selectedCartItems.length;
  const allSelected = items.length > 0 && selectedItems.length === items.length;

  const totalMRP = Math.round(
    selectedCartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    ),
  );

  const selectedCartTotal = Math.round(
    selectedCartItems.reduce(
      (sum, item) => sum + item.effectivePrice * item.quantity,
      0,
    ),
  );

  const totalDiscount = Math.max(0, totalMRP - selectedCartTotal);
  const platformFee = selectedCount > 0 ? 20 : 0;
  const finalAmount = selectedCartTotal + platformFee;

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item.cartItemId));
    }
  };

  const handleToggleItem = (cartItemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(cartItemId)) {
        return prev.filter((id) => id !== cartItemId);
      }
      return [...prev, cartItemId];
    });
  };

  const handleRemove = async (cartItemId) => {
    setActionLoadingId(cartItemId);
    await dispatch(removeCartItem(cartItemId));
    setActionLoadingId(null);
  };

  const handleRemoveSelected = async () => {
    if (selectedItems.length === 0) return;

    for (const cartItemId of selectedItems) {
      await dispatch(removeCartItem(cartItemId));
    }
  };

  const handleMoveSingleToWishlist = async (item) => {
    setActionLoadingId(item.cartItemId);

    const wishlistResult = await dispatch(toggleWishlistItem(item.productId));

    if (toggleWishlistItem.fulfilled.match(wishlistResult)) {
      await dispatch(fetchWishlist());
      await dispatch(removeCartItem(item.cartItemId));
    }

    setActionLoadingId(null);
  };

  const handleMoveSelectedToWishlist = async () => {
    const selectedProducts = items.filter((item) =>
      selectedItems.includes(item.cartItemId),
    );

    for (const item of selectedProducts) {
      const wishlistResult = await dispatch(toggleWishlistItem(item.productId));

      if (toggleWishlistItem.fulfilled.match(wishlistResult)) {
        await dispatch(removeCartItem(item.cartItemId));
      }
    }
    await dispatch(fetchWishlist());
  };

  const openQuantityModal = (item) => {
    setQuantityModalItem(item);
    setSelectedQty(item.quantity);
  };

  const closeQuantityModal = () => {
    setQuantityModalItem(null);
  };

  const openSizeModal = (item) => {
    setSizeModalItem(item);
    setSelectedSize(item.size || "");
  };

  const closeSizeModal = () => {
    setSizeModalItem(null);
  };

  const handleConfirmSize = async () => {
    if (!sizeModalItem) return;

    if (selectedSize === sizeModalItem.size) {
      closeSizeModal();
      return;
    }

    setActionLoadingId(sizeModalItem.cartItemId);

    await dispatch(
      updateCartItemVariant({
        cartItemId: sizeModalItem.cartItemId,
        size: selectedSize,
      }),
    );

    setActionLoadingId(null);
    closeSizeModal();
  };

  const handleConfirmQuantity = async () => {
    if (!quantityModalItem) return;

    const currentQty = quantityModalItem.quantity;
    const cartItemId = quantityModalItem.cartItemId;

    if (selectedQty === currentQty) {
      closeQuantityModal();
      return;
    }

    setActionLoadingId(cartItemId);

    const diff = Math.abs(selectedQty - currentQty);
    const action = selectedQty > currentQty ? "increase" : "decrease";

    for (let i = 0; i < diff; i += 1) {
      await dispatch(updateCartQuantity({ cartItemId, action }));
    }

    setActionLoadingId(null);
    closeQuantityModal();
  };

  const getAvailableStock = (item) => {
    return (
      item?.stock ??
      item?.availableStock ??
      item?.productStock ??
      item?.product?.stock ??
      null
    );
  };

  const getBrandName = (name) => {
    if (!name) return "";
    return name.split(" ")[0];
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <div className="bg-white min-h-screen mt-16">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-0 py-6 lg:py-8">
          {/* STEP HEADER */}
          <div className="hidden md:flex items-center justify-center mb-8">
            <div className="flex items-center gap-12 text-xs font-semibold tracking-[2px]">
              <div className="text-green-600 border-b-2 border-green-600 pb-1">
                BAG
              </div>
              <div className="text-gray-400 pb-1">ADDRESS</div>
              <div className="text-gray-400 pb-1">PAYMENT</div>
            </div>
          </div>

          {loading && items.length === 0 ? (
            <p className="text-sm text-gray-600">Loading bag...</p>
          ) : items.length === 0 ? (
            <div className="max-w-2xl mx-auto border border-[#eaeaec] rounded bg-white px-6 py-12 text-center">
              <h2 className="text-2xl font-semibold text-[#282c3f]">
                Your bag is empty
              </h2>
              <p className="text-sm text-[#696b79] mt-3 mb-6">
                Add items to your bag to see them here.
              </p>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="border border-[#ff3f6c] text-[#ff3f6c] px-6 py-3 rounded font-semibold text-sm"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,660px)_320px] gap-8">
              {/* LEFT */}
              <div>
                {/* SELECTED ITEMS ROW */}
                <div className="flex items-center justify-between border-b border-[#eaeaec] pb-5 mb-5">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleToggleAll}
                      className={`h-6 w-6 rounded-[2px] flex items-center justify-center text-white text-sm font-bold ${
                        allSelected
                          ? "bg-[#ff3f6c]"
                          : "bg-white border border-[#c2c2c2] text-transparent"
                      }`}
                    >
                      ✓
                    </button>

                    <p className="text-[15px] font-bold text-[#282c3f]">
                      {selectedCount}/{items.length} ITEMS SELECTED
                    </p>
                  </div>

                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={handleRemoveSelected}
                      className="text-[14px] font-semibold text-[#282c3f] px-6"
                    >
                      REMOVE
                    </button>

                    <div className="h-6 w-px bg-[#d4d5d9]" />

                    <button
                      type="button"
                      onClick={handleMoveSelectedToWishlist}
                      className="text-[14px] font-semibold text-[#282c3f] px-6"
                    >
                      MOVE TO WISHLIST
                    </button>
                  </div>
                </div>

                {/* CART ITEMS */}
                <div className="space-y-4">
                  {items.map((item) => {
                    const isSelected = selectedItems.includes(item.cartItemId);
                    const availableStock = getAvailableStock(item);
                    const showLowStock =
                      typeof availableStock === "number" &&
                      availableStock > 0 &&
                      availableStock <= 5;

                    const itemDiscountPercent =
                      item.price > item.effectivePrice
                        ? Math.round(
                            ((item.price - item.effectivePrice) / item.price) *
                              100,
                          )
                        : 0;

                    const isActionLoading = actionLoadingId === item.cartItemId;

                    return (
                      <div
                        key={item.cartItemId}
                        className="border border-[#eaeaec] rounded-[4px] bg-white p-4"
                      >
                        <div className="flex gap-4">
                          {/* IMAGE */}
                          <div className="relative shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleItem(item.cartItemId)}
                              className={`absolute left-2 top-2 z-10 h-5 w-5 rounded-[2px] flex items-center justify-center text-white text-xs font-bold ${
                                isSelected
                                  ? "bg-[#ff3f6c]"
                                  : "bg-white border border-[#c2c2c2] text-transparent"
                              }`}
                            >
                              ✓
                            </button>

                            <div className="w-[120px] h-[160px] bg-[#f5f5f6] overflow-hidden">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                  No Image
                                </div>
                              )}
                            </div>
                          </div>

                          {/* DETAILS */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h2 className="text-[16px] font-bold text-[#282c3f] leading-5">
                                  {getBrandName(item.name)}
                                </h2>

                                <p className="text-[16px] text-[#282c3f] mt-1 line-clamp-1">
                                  {item.name}
                                </p>

                                <p className="text-[14px] text-[#94969f] mt-1">
                                  Sold by: Supercom Net
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemove(item.cartItemId)}
                                className="text-[#282c3f] text-[24px] leading-none font-light"
                                aria-label="Remove item"
                              >
                                ×
                              </button>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                              {item.sizes?.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => openSizeModal(item)}
                                  className="bg-[#f5f5f6] px-3 py-1.5 rounded text-[14px] font-semibold text-[#282c3f] flex items-center gap-1"
                                >
                                  <span>Size: {item.size}</span>
                                  <span className="text-[10px]">▼</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => openQuantityModal(item)}
                                className="bg-[#f5f5f6] px-3 py-1.5 rounded text-[14px] font-semibold text-[#282c3f] flex items-center gap-1"
                              >
                                <span>Qty: {item.quantity}</span>
                                <span className="text-[10px]">▼</span>
                              </button>

                              {showLowStock && (
                                <div className="border border-[#ff905a] text-[#ff5722] px-2 py-1 text-[13px] rounded-[2px]">
                                  {availableStock} left
                                </div>
                              )}
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                              <span className="text-[24px] sm:text-[18px] font-bold text-[#282c3f]">
                                ₹{Math.round(item.effectivePrice)}
                              </span>

                              {item.price > item.effectivePrice && (
                                <>
                                  <span className="text-[16px] text-[#94969f] line-through">
                                    ₹{Math.round(item.price)}
                                  </span>

                                  <span className="text-[16px] text-[#ff905a] font-medium">
                                    {itemDiscountPercent}% OFF
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="mt-4 text-[16px] text-[#282c3f]">
                              <span className="font-semibold">7 days</span>{" "}
                              return available
                            </div>

                            {item.color && (
                              <p className="mt-2 text-[14px] text-[#696b79]">
                                Color: {item.color}
                              </p>
                            )}

                            {!item.isActive && (
                              <p className="text-sm text-red-500 mt-3">
                                This product is currently inactive
                              </p>
                            )}

                            {/* ACTION BUTTONS */}
                            <div className="mt-5 grid grid-cols-2 border-t border-[#eaeaec] pt-4">
                              <button
                                type="button"
                                onClick={() => handleRemove(item.cartItemId)}
                                disabled={isActionLoading}
                                className="text-[14px] font-semibold text-[#282c3f] border-r border-[#eaeaec] py-1"
                              >
                                {isActionLoading ? "PLEASE WAIT..." : "REMOVE"}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleMoveSingleToWishlist(item)}
                                disabled={isActionLoading}
                                className="text-[14px] font-semibold text-[#282c3f] py-1"
                              >
                                {isActionLoading
                                  ? "PLEASE WAIT..."
                                  : "MOVE TO WISHLIST"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
              </div>

              {/* RIGHT */}
              <div>
                <div className="lg:sticky lg:top-24">
                  <div className="border border-[#eaeaec] rounded-[4px] bg-white p-4">
                    <h2 className="text-[14px] font-bold text-[#535766] uppercase mb-4">
                      Price Details ({selectedCount} Item
                      {selectedCount !== 1 ? "s" : ""})
                    </h2>

                    <div className="space-y-3 text-[14px] text-[#282c3f]">
                      <div className="flex justify-between gap-4">
                        <span>Total MRP</span>
                        <span>₹{totalMRP}</span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span>Discount on MRP</span>
                        <span className="text-[#03a685]">
                          - ₹{totalDiscount}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span>Platform Fee</span>
                        <span>₹{platformFee}</span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span>Shipping Fee</span>
                        <span className="text-[#03a685]">FREE</span>
                      </div>
                    </div>

                    <div className="border-t border-[#eaeaec] mt-4 pt-4 flex justify-between font-bold text-[16px] text-[#282c3f]">
                      <span>Total Amount</span>
                      <span>₹{finalAmount}</span>
                    </div>

                    <button
                    onClick={handlePlaceOrder}
                      type="button"
                      className=" cursor-pointer w-full mt-5 bg-[#ff3f6c] text-white font-bold py-3 rounded-[4px] text-[14px]"
                    >
                      PLACE ORDER
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SIZE MODAL */}
      {sizeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center px-4">
          <div className="w-full max-w-[420px] bg-white rounded-[4px] shadow-xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f0f0]">
              <h3 className="text-[18px] font-bold text-[#282c3f]">
                Select Size
              </h3>

              <button
                type="button"
                onClick={closeSizeModal}
                className="text-[34px] leading-none text-[#282c3f] font-light"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="grid grid-cols-4 gap-4">
                {sizeModalItem.sizes.map((size) => {
                  const isActive = selectedSize === size;

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-14 rounded-full border text-[16px] font-semibold transition ${
                        isActive
                          ? "border-[#ff3f6c] text-[#ff3f6c]"
                          : "border-[#9ca3af] text-[#282c3f]"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleConfirmSize}
                className="w-full mt-8 bg-[#ff3f6c] text-white font-bold py-4 rounded-[4px] text-[16px]"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUANTITY MODAL */}
      {quantityModalItem && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center px-4">
          <div className="w-full max-w-[420px] bg-white rounded-[4px] shadow-xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f0f0]">
              <h3 className="text-[18px] font-bold text-[#282c3f]">
                Select Quantity
              </h3>

              <button
                type="button"
                onClick={closeQuantityModal}
                className="text-[34px] leading-none text-[#282c3f] font-light"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="grid grid-cols-5 gap-4">
                {Array.from(
                  {
                    length: Math.max(
                      1,
                      Math.min(quantityModalItem?.stock || 1, 10),
                    ),
                  },
                  (_, index) => index + 1,
                ).map((qty) => {
                  const isActive = selectedQty === qty;

                  return (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setSelectedQty(qty)}
                      className={`h-14 w-14 rounded-full border text-[18px] font-semibold transition ${
                        isActive
                          ? "border-[#ff3f6c] text-[#ff3f6c]"
                          : "border-[#9ca3af] text-[#282c3f]"
                      }`}
                    >
                      {qty}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleConfirmQuantity}
                className="w-full mt-8 bg-[#ff3f6c] text-white font-bold py-4 rounded-[4px] text-[16px]"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;
