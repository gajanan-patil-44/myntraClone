import { useEffect } from "react";
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
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3">Image</th>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Brand</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Stock</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-center px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* Image */}
                  <td className="px-4 py-3">
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-14 h-14 rounded object-cover border"
                    />
                  </td>

                  {/* Name */}
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {product.name}
                  </td>

                  {/* Brand */}
                  <td className="px-4 py-3">{product.brand}</td>

                  {/* Price */}
                  <td className="px-4 py-3 font-semibold">₹{product.price}</td>

                  {/* Stock */}
                  <td className="px-4 py-3">{product.stock}</td>

                  {/* Status */}
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/products/edit/${product._id}`)
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleToggle(product._id)}
                        className={`px-3 py-1 rounded text-white transition ${
                          product.isActive
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {product.isActive ? "Disable" : "Enable"}
                      </button>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
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
