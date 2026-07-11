import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { categories } from "../../../constants/categories";
import { updateProduct } from "../../../store/slices/adminProductThunks";
import toast from "react-hot-toast";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { createLoading, products } = useSelector(
    (state) => state.adminProduct
  );

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
    image1: "",
    image2: "",
    image3: "",
    description: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const product = products.find((p) => p._id === id);

    if (!product) return;

    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      subCategory: product.subCategory,
      price: product.price,
      discountPrice: product.discountPrice,
      stock: product.stock,
      sizes: product.sizes.join(","),
      colors: product.colors.join(","),
      image1: product.images[0] || "",
      image2: product.images[1] || "",
      image3: product.images[2] || "",
      description: product.description,
      isActive: product.isActive,
    });
  }, [id, products]);

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

    if (!formData.name.trim()) 
      {
        toast.error("Product name is required");
        newErrors.name = "Product name is required";
      }

    if (!formData.brand.trim())
      { toast.error("Brand is required");
         newErrors.brand = "Brand is required";}

    if (!formData.category){
      toast.error("Category is required");
      newErrors.category = "Category is required";}

    if (!formData.subCategory)
    {toast.error("Sub Category is required");
      newErrors.subCategory = "Sub Category is required";}

    if (!formData.price)
      { toast.error("Price is required");
         newErrors.price = "Price is required";}

    if (!formData.stock){
      toast.error("Stock is required");
      newErrors.stock = "Stock is required";}

    if (!formData.description.trim())
      { toast.error("Description is required");
        newErrors.description = "Description is required";}

    if (!formData.image1.trim())
      { toast.error("At least one image is required");
        newErrors.image1 = "At least one image is required";}

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     console.log("Submit clicked");

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

      images: [
        formData.image1,
        formData.image2,
        formData.image3,
      ].filter(Boolean),

      description: formData.description,
      isActive: formData.isActive,
    };

    const result = await dispatch(
      updateProduct({
        id,
        productData: payload,
      })
    );

    if (updateProduct.fulfilled.match(result)) {
      navigate("/admin/products");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/products")}
          className="text-sm text-pink-600 hover:text-pink-700 font-medium mb-3"
        >
          ← Back to Products
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          Edit Product
        </h1>

        <p className="mt-2 text-gray-500">
          Manage and update product information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >

        {/* ===================== Basic Information ===================== */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            📦 Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Product Name */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              {errors.name && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Brand */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              {errors.brand && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.brand}
                </p>
              )}
            </div>

            {/* Category */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select Category</option>

                {Object.keys(categories).map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>

              {errors.category && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Sub Category */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Category
              </label>

              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">
                  Select Sub Category
                </option>

                {formData.category &&
                  categories[formData.category]?.map((sub) => (
                    <option
                      key={sub}
                      value={sub}
                    >
                      {sub}
                    </option>
                  ))}
              </select>

              {errors.subCategory && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.subCategory}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* ===================== Pricing & Inventory ===================== */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              💰 Pricing & Inventory
            </h2>

            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                Number(formData.stock) === 0
                  ? "bg-red-100 text-red-700"
                  : Number(formData.stock) <= 5
                  ? "bg-orange-100 text-orange-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {Number(formData.stock) === 0
                ? "Out of Stock"
                : Number(formData.stock) <= 5
                ? "Low Stock"
                : "In Stock"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Price */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              {errors.price && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.price}
                </p>
              )}
            </div>

            {/* Discount Price */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Price
              </label>

              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Stock */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              {errors.stock && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.stock}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* ===================== Product Attributes ===================== */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            🎨 Product Attributes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Sizes */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sizes
              </label>

              <input
                type="text"
                name="sizes"
                value={formData.sizes}
                onChange={handleChange}
                placeholder="S, M, L, XL"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              <p className="text-xs text-gray-500 mt-2">
                Separate multiple sizes using commas.
              </p>
            </div>

            {/* Colors */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colors
              </label>

              <input
                type="text"
                name="colors"
                value={formData.colors}
                onChange={handleChange}
                placeholder="Black, White, Blue"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              <p className="text-xs text-gray-500 mt-2">
                Separate multiple colors using commas.
              </p>
            </div>

          </div>
        </div>

        {/* ===================== Product Images ===================== */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            🖼 Product Images
          </h2>

          {/* Image Preview */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {[formData.image1, formData.image2, formData.image3].map(
              (image, index) => (
                <div
                  key={index}
                  className="border rounded-xl overflow-hidden bg-gray-50"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="h-56 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}

                  <div className="bg-white border-t px-4 py-3 text-center text-sm font-medium text-gray-600">
                    Image {index + 1}
                  </div>
                </div>
              )
            )}

          </div>

          {/* Image URLs */}

          <div className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL 1
              </label>

              <input
                type="text"
                name="image1"
                value={formData.image1}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              {errors.image1 && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.image1}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL 2
              </label>

              <input
                type="text"
                name="image2"
                value={formData.image2}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL 3
              </label>

              <input
                type="text"
                name="image3"
                value={formData.image3}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

          </div>

        </div>

        {/* ===================== Description ===================== */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            📝 Product Description
          </h2>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={7}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Write a detailed product description..."
          />

          {errors.description && (
            <p className="text-red-500 text-sm mt-2">
              {errors.description}
            </p>
          )}

        </div>

        {/* ===================== Product Status ===================== */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            ⚙ Product Status
          </h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-5 w-5 accent-pink-600"
            />

            <div>
              <p className="font-medium text-gray-800">
                Active Product
              </p>

              <p className="text-sm text-gray-500">
                Inactive products won't appear on the customer website.
              </p>
            </div>
          </label>

        </div>

        {/* ===================== Action Buttons ===================== */}

        <div className="flex flex-col md:flex-row justify-end gap-4 pb-10">

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-8 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={createLoading}
            className="px-8 py-3 rounded-lg bg-[#ff3f6c] text-white hover:bg-[#e7335f] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createLoading ? "Updating..." : "Update Product"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default EditProductPage;