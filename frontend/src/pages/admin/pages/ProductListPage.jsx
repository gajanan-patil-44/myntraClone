import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchAdminProducts,
  toggleProductStatus,
  deleteProduct,
} from "../../../store/slices/adminProductThunks";
import { Search, ChevronDown } from "lucide-react";

const ProductListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [inventoryFilter, setInventoryFilter] = useState("all");
  const [showInventoryMenu, setShowInventoryMenu] = useState(false);
  const [searchParams] = useSearchParams();
  const isAlertView = searchParams.get("inventory") === "alerts";
  const [sortByStock, setSortByStock] = useState(false);

  const { products, loading, error } = useSelector(
    (state) => state.adminProduct,
  );

  const inventoryAlerts = products
    .filter((product) => product.stock <= 5)
    .sort((a, b) => a.stock - b.stock);

  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  useEffect(() => {
    if (inventoryAlerts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAlertIndex((prev) =>
        prev === inventoryAlerts.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [inventoryAlerts]);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);
  useEffect(() => {
  if (isAlertView) {
    setSortByStock(true);
  }
}, [isAlertView]);

  const handleToggle = async (id) => {
    await dispatch(toggleProductStatus(id));
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    await dispatch(deleteProduct(id));
  };

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.brand.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.subCategory.toLowerCase().includes(search);

    let matchesInventory = true;

    if (inventoryFilter === "out_of_stock") {
      matchesInventory = product.stock === 0;
    } else if (inventoryFilter === "low_stock") {
      matchesInventory = product.stock > 0 && product.stock <= 5;
    } else if (inventoryFilter === "in_stock") {
      matchesInventory = product.stock > 5;
    }

    return matchesSearch && matchesInventory;
  });
  const displayProducts = [...filteredProducts];

if (sortByStock) {
  displayProducts.sort((a, b) => a.stock - b.stock);
}

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>

        {/* Inventory Alert */}
        {inventoryAlerts.length > 0 && (
          <div
            onClick={() =>
              navigate(
                `/admin/products/edit/${inventoryAlerts[currentAlertIndex]._id}`,
              )
            }
            className={` cursor-pointer rounded-xl border-l-4 px-5 py-4 shadow-sm transition-all duration-300
            ${
              inventoryAlerts[currentAlertIndex].stock === 0
                ? "border-red-500 bg-red-50 hover:bg-red-100"
                : "border-orange-500 bg-orange-50 hover:bg-orange-100"
            }`}
          >
            <div className="flex w-150 items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`h-3 w-3 rounded-full animate-pulse ${
                    inventoryAlerts[currentAlertIndex].stock === 0
                      ? "bg-red-500"
                      : "bg-orange-500"
                  }`}
                />

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${
                      inventoryAlerts[currentAlertIndex].stock === 0
                        ? "text-red-600"
                        : "text-orange-600"
                    }`}
                  >
                    {inventoryAlerts[currentAlertIndex].stock === 0
                      ? "OUT OF STOCK"
                      : "LOW STOCK"}
                  </span>

                  <span className="text-gray-300">•</span>

                  <span className="font-semibold text-gray-900">
                    {inventoryAlerts[currentAlertIndex].name}
                  </span>

                  <span className="text-gray-500">
                    {inventoryAlerts[currentAlertIndex].stock === 0
                      ? "Out of stock"
                      : `${inventoryAlerts[currentAlertIndex].stock} left`}
                  </span>
                </div>
              </div>

              <button
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  inventoryAlerts[currentAlertIndex].stock === 0
                    ? "bg-red-100 text-red-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                Restock →
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => navigate("/admin/products/add")}
          className="bg-[#ff3f6c] hover:bg-[#e7335f] text-white px-5 py-2.5 rounded-lg font-medium transition"
        >
          + Add Product
        </button>
      </div>

      <div className="mb-6 flex items-center justify-between gap-5">
        {/* Search */}
        <div className="relative flex-1 max-w-2xl ">
          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search products, brand or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-15 w-full rounded-2xl border border-gray-200 bg-white pl-14 pr-5 text-[15px] font-medium text-gray-700 shadow-md transition-all duration-200 placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 "
          />
        </div>

        <div className="relative flex items-center gap-3">
          <button
            onClick={() => setShowInventoryMenu((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-pink-400 hover:bg-pink-50"
          >
            {inventoryFilter === "all"
              ? "All Products"
              : inventoryFilter === "out_of_stock"
                ? "Out of Stock"
                : inventoryFilter === "low_stock"
                  ? "Low Stock"
                  : "In Stock"}
            <ChevronDown size={18} />
          </button>

          {showInventoryMenu && (
            <div className="absolute right-0 top-16 w-56 rounded-xl border border-gray-200 bg-white shadow-xl z-50">
              <button
                onClick={() => {
                  setInventoryFilter("all");
                  setShowInventoryMenu(false);
                }}
                className={`block w-full px-4 py-3 text-left transition
                ${
                  inventoryFilter === "all"
                    ? "bg-pink-50 font-semibold text-pink-600"
                    : "hover:bg-gray-50"
                }`}
              >
                All Products
              </button>

              <button
                onClick={() => {
                  setInventoryFilter("out_of_stock");
                  setShowInventoryMenu(false);
                }}
                className={`block w-full px-4 py-3 text-left transition
                ${
                  inventoryFilter === "out_of_stock"
                    ? "bg-red-50 font-semibold text-red-600"
                    : "hover:bg-gray-50"
                }`}
              >
                Out of Stock
              </button>

              <button
                onClick={() => {
                  setInventoryFilter("low_stock");
                  setShowInventoryMenu(false);
                }}
                className={`block w-full px-4 py-3 text-left transition
                ${
                  inventoryFilter === "low_stock"
                    ? "bg-orange-50 font-semibold text-orange-600"
                    : "hover:bg-gray-50"
                }`}
              >
                Low Stock
              </button>

              <button
                onClick={() => {
                  setInventoryFilter("in_stock");
                  setShowInventoryMenu(false);
                }}
                className={`block w-full px-4 py-3 text-left transition
                ${
                  inventoryFilter === "in_stock"
                    ? "bg-green-50 font-semibold text-green-600"
                    : "hover:bg-gray-50"
                }`}
              >
                In Stock
              </button>

              <div className="my-1 border-t">
                <button
                  onClick={() => {
                    setInventoryFilter("all");
                    setSortByStock(true);
                    setShowInventoryMenu(false);
                  }}
                  className={`block w-full px-4 py-3 text-left transition
                  ${
                    sortByStock
                      ? "bg-blue-50 font-semibold text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Sort by Stock
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading products...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-4">Image</th>
                <th className="text-left px-4 py-4">Product</th>
                <th className="text-left px-4 py-4">Brand</th>
                <th className="text-left px-4 py-4">Price</th>
                <th className="text-left px-4 py-4">Stock</th>
                <th className="text-left px-4 py-4">Inventory</th>
                <th className="text-left px-4 py-4">Status</th>
                <th className="text-center px-4 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {displayProducts.map((product) => (
                <tr
                  key={product._id}
                  onClick={() =>
                    navigate(`/admin/products/edit/${product._id}`)
                  }
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* Image */}
                  <td className="px-4 py-4">
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-14 h-14 rounded object-cover border"
                    />
                  </td>

                  {/* Name */}
                  <td className="px-4 py-4 font-medium text-gray-800">
                    {product.name}
                  </td>

                  {/* Brand */}
                  <td className="px-4 py-4">{product.brand}</td>

                  {/* Price */}
                  <td className="px-4 py-4 font-semibold">₹{product.price}</td>

                  {/* Stock */}
                  <td
                    className={`px-4 py-4 font-semibold ${
                      product.stock === 0
                        ? "text-red-600"
                        : product.stock <= 5
                          ? "text-orange-500"
                          : "text-green-600"
                    }`}
                  >
                    {product.stock}
                  </td>
                  {/* Inventory */}
                  <td className="px-4 py-4">
                    {product.stock === 0 ? (
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                        Out of Stock
                      </span>
                    ) : product.stock <= 5 ? (
                      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                        In Stock
                      </span>
                    )}
                  </td>
                  {/* Status */}
                  <td className="px-4 py-4 bg">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleToggle(product._id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(product._id);
                        }}
                        className={`px-4 py-1 rounded text-white transition ${
                          product.isActive
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {product.isActive ? "In-Active" : "Active"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
