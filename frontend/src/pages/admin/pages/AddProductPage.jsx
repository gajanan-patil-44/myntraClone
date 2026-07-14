import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { categories } from "../../../constants/categories";
import { createProduct } from "../../../store/slices/adminProductThunks";
import ImageUploader  from "../ImageUploader";

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { createLoading } = useSelector((state) => state.adminProduct);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    subCategory: "",
    price: "",
    discountPrice: "",
    stock: "",
    sizes: "",
    colors: "",
    images: [],
    description: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value,
        subCategory: "",
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";

    if (!formData.brand.trim()) newErrors.brand = "Brand is required";

    if (!formData.category) newErrors.category = "Category is required";

    if (!formData.subCategory)
      newErrors.subCategory = "Sub Category is required";

    if (!formData.price) newErrors.price = "Price is required";

    if (!formData.stock) newErrors.stock = "Stock is required";

    if (!formData.description.trim())
      newErrors.description = "Description is required";

    if (formData.images.length === 0)
      newErrors.images = "At least one image is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      subCategory: formData.subCategory,
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice) || 0,
      stock: Number(formData.stock),

      sizes: formData.sizes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      colors: formData.colors
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      images: formData.images,

      description: formData.description,
      isActive: formData.isActive,
    };

    const result = await dispatch(createProduct(payload));

    if (createProduct.fulfilled.match(result)) {
      navigate("/admin/products");
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-8">
      <h1 className="text-3xl font-bold mb-8">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Product Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">Brand</label>

            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />

            {errors.brand && (
              <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
            )}
          </div>
        </div>
        {/* Row 2 */}

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select Category</option>

              {Object.keys(categories).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">Sub Category</label>

            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select Sub Category</option>

              {formData.category &&
                categories[formData.category]?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
            </select>

            {errors.subCategory && (
              <p className="text-red-500 text-sm mt-1">{errors.subCategory}</p>
            )}
          </div>
        </div>

        {/* Row 3 */}

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 font-medium">Price</label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />

            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">Discount Price</label>

            <input
              type="number"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Stock</label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />

            {errors.stock && (
              <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
            )}
          </div>
        </div>

        {/* Row 4 */}

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">
              Sizes (comma separated)
            </label>

            <input
              type="text"
              name="sizes"
              value={formData.sizes}
              onChange={handleChange}
              placeholder="S,M,L or 7,8,9"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Colors (comma separated)
            </label>

            <input
              type="text"
              name="colors"
              value={formData.colors}
              onChange={handleChange}
              placeholder="Black,Blue,White"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
        </div>

        {/* Row 5 */}
        <ImageUploader
  images={formData.images}
  setImages={(images) =>
    setFormData((prev) => ({
      ...prev,
      images,
    }))
  }
/>
        {/* Row 6 */}

        <div>
          <label className="block mb-2 font-medium">Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full border rounded-lg px-4 py-2 resize-none"
          />

          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Row 7 */}

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-5 h-5"
          />

          <label htmlFor="isActive" className="font-medium">
            Product Active
          </label>
        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={createLoading}
            className="bg-[#ff3f6c] hover:bg-[#e7335f] disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition"
          >
            {createLoading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
