import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAdminProducts,
  toggleProductStatus,
  deleteProduct,
} from "../../../store/slices/adminProductThunks";

const ProductListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const { products, loading, error } = useSelector(
    (state) => state.adminProduct,
  );

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

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

    return (
      product.name.toLowerCase().includes(search) ||
      product.brand.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.subCategory.toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>

        <button
          onClick={() => navigate("/admin/products/add")}
          className="bg-[#ff3f6c] hover:bg-[#e7335f] text-white px-5 py-2.5 rounded-lg font-medium transition"
        >
          + Add Product
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by product, brand, category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
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
              {filteredProducts.map((product) => (
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
