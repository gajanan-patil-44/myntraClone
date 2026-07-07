import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useParams,useSearchParams  } from "react-router-dom";
import { Range, getTrackBackground } from "react-range";
import BrandFilterModal from "../components/BrandFilterModal";
import CategoryFilterModal from "../components/CategoryFilterModal";

const ProductsPage = () => {
  const { category, subCategory } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [searchParams] = useSearchParams();
const searchTerm =
  searchParams.get("search")?.toLowerCase().trim() || "";

  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 0,
  });

  const [selectedPrice, setSelectedPrice] = useState([0, 0]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");

        // console.log("Products Response:", response.data);
        setProducts(response.data.products);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const categoryProducts = products.filter((product) => {
    const categoryMatch =
      !category || product.category.toLowerCase() === category.toLowerCase();

    const subCategoryMatch =
      !subCategory ||
      product.subCategory.toLowerCase() === subCategory.toLowerCase();

    return categoryMatch && subCategoryMatch;
  });
  const highestPrice =
    categoryProducts.length > 0
      ? Math.ceil(
          Math.max(...categoryProducts.map((product) => Number(product.price))),
        )
      : 0;

  useEffect(() => {
    if (highestPrice > 0) {
      setPriceRange({
        min: 0,
        max: highestPrice,
      });

      setSelectedPrice([0, Math.floor(highestPrice)]);
    }
  }, [highestPrice]);

  const categoryCounts = {};

  categoryProducts.forEach((product) => {
    const subCat = product.subCategory;

    categoryCounts[subCat] = (categoryCounts[subCat] || 0) + 1;
  });

  const brandCounts = {};

  categoryProducts.forEach((product) => {
    const brand = product.brand;

    brandCounts[brand] = (brandCounts[brand] || 0) + 1;
  });

  const colorCounts = {};

  categoryProducts.forEach((product) => {
    product.colors?.forEach((color) => {
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    });
  });

  const sizeCounts = {};

  categoryProducts.forEach((product) => {
    product.sizes?.forEach((size) => {
      sizeCounts[size] = (sizeCounts[size] || 0) + 1;
    });
  });

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((item) => item !== brand)
        : [...prev, brand],
    );
  };

  const handleSubCategoryChange = (subCategory) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategory)
        ? prev.filter((item) => item !== subCategory)
        : [...prev, subCategory],
    );
  };

  const handleColorChange = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((item) => item !== color)
        : [...prev, color],
    );
  };
  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size],
    );
  };

  const displayProducts = categoryProducts.filter((product) => {
    const subCategoryMatch =
      selectedSubCategories.length === 0 ||
      selectedSubCategories.includes(product.subCategory);

    const brandMatch =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);

    const colorMatch =
      selectedColors.length === 0 ||
      product.colors?.some((color) => selectedColors.includes(color));
    const sizeMatch =
      selectedSizes.length === 0 ||
      product.sizes?.some((size) => selectedSizes.includes(size));

    const priceMatch =
      product.price >= selectedPrice[0] && product.price <= selectedPrice[1];

      const searchMatch =
  searchTerm === "" ||
  product.name.toLowerCase().includes(searchTerm) ||
  product.brand.toLowerCase().includes(searchTerm) ||
  product.category.toLowerCase().includes(searchTerm) ||
  product.subCategory.toLowerCase().includes(searchTerm);

    return (
      subCategoryMatch && brandMatch && colorMatch && sizeMatch && priceMatch && searchMatch
    );
  });

  return (
    <>
      <div className="mb-6 mx-6 mt-9">
        <p className="text-sm text-gray-500 mb-4">
          Home /<span className="text-gray-700"> {category}</span>
          {subCategory && (
            <>
              {" / "}
              <span className="font-medium text-gray-900">{subCategory}</span>
            </>
          )}
        </p>

        <h1 className="text-xl font-semibold text-gray-900">
          {subCategory
            ? `${category} ${subCategory}`
            : category || "All Products"}

          <span className="ml-2 text-gray-500 font-normal">
            - {displayProducts.length} Items
          </span>
        </h1>
      </div>
      <div className=" px-6 py-6">
        <div className="flex gap-6">
          {/* Filters Placeholder */}

          <aside className="hidden lg:block w-55 shrink-0 border-r border-gray-200">
            <h2 className="text-2xl font-bold mb-6">FILTERS</h2>

            <div>
              {!subCategory && (
                <div className="border-t border-gray-200 py-4">
                  <h3 className="text-sm font-bold uppercase mb-3">
                    Categories
                  </h3>

                  <div className="space-y-2">
                    {Object.entries(categoryCounts)
                      .slice(0, 6)
                      .map(([subCat, count]) => (
                        <label
                          key={subCat}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSubCategories.includes(subCat)}
                            onChange={() => handleSubCategoryChange(subCat)}
                          />

                          <span>
                            {subCat}
                            <span className="text-gray-400 ml-1">
                              ({count})
                            </span>
                          </span>
                        </label>
                      ))}

                    {Object.keys(categoryCounts).length > 6 && (
                      <button
                        type="button"
                        onClick={() => setShowCategoryModal(true)}
                        className="text-[#ff3f6c] text-sm font-medium ml-6 mt-2"
                      >
                        + {Object.keys(categoryCounts).length - 6} more
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 py-4">
                <h3 className="text-sm font-bold uppercase mb-3">Brand</h3>

                <div className="space-y-2">
                  {Object.entries(brandCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 6)
                    .map(([brand, count]) => (
                      <label
                        key={brand}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                        />

                        <span>
                          {brand}
                          <span className="text-gray-400 ml-1">({count})</span>
                        </span>
                      </label>
                    ))}

                  {Object.keys(brandCounts).length > 6 && (
                    <button
                      type="button"
                      onClick={() => setShowBrandModal(true)}
                      className="text-[#ff3f6c] text-sm font-medium ml-6 mt-2"
                    >
                      + {Object.keys(brandCounts).length - 6} more
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 py-4">
                <h3 className="text-sm font-bold uppercase mb-5">Price</h3>
                {priceRange.max > 0 && (
                  <Range
                    step={1}
                    min={priceRange.min}
                    max={priceRange.max}
                    values={selectedPrice}
                    onChange={(values) => setSelectedPrice(values)}
                    renderTrack={({ props, children }) => {
                      const { key, ...trackProps } = props;

                      return (
                        <div
                          key={key}
                          {...trackProps}
                          className="h-2 w-full rounded-full"
                          style={{
                            background: getTrackBackground({
                              values: selectedPrice,
                              colors: ["#d1d5db", "#ff3f6c", "#d1d5db"],
                              min: priceRange.min,
                              max: priceRange.max,
                            }),
                          }}
                        >
                          {children}
                        </div>
                      );
                    }}
                    renderThumb={({ props }) => {
                      const { key, ...thumbProps } = props;

                      return (
                        <div
                          key={key}
                          {...thumbProps}
                          className="h-5 w-5 rounded-full bg-white border-2 border-[#ff3f6c] shadow cursor-pointer"
                        />
                      );
                    }}
                  />
                )}
                <div className="flex justify-between mt-4 text-sm font-semibold text-[#282c3f]">
                  <span>₹{selectedPrice[0]}</span>

                  <span>
                    ₹{selectedPrice[1]}
                    {selectedPrice[1] === priceRange.max ? "+" : ""}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 py-4">
                <h3 className="text-sm font-bold uppercase mb-3">Color</h3>
                <div className="space-y-2">
                  {Object.entries(colorCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([color, count]) => (
                      <label
                        key={color}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(color)}
                          onChange={() => handleColorChange(color)}
                        />

                        <span>
                          {color}
                          <span className="text-gray-400 ml-1">({count})</span>
                        </span>
                      </label>
                    ))}
                </div>
              </div>

              <div className="border-t border-gray-200 py-4">
                <h3 className="text-sm font-bold uppercase mb-3">Size</h3>
                <div className="space-y-2">
                  {Object.entries(sizeCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([size, count]) => (
                      <label
                        key={size}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={() => handleSizeChange(size)}
                        />

                        <span>
                          {size}
                          <span className="text-gray-400 ml-1">({count})</span>
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}

          <section className="w-full lg:w-4/5">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
              {/* Left Side */}

              <div className="flex items-center gap-6">
                <button className="text-sm text-gray-700 hover:text-black">
                  Size ▼
                </button>
              </div>

              {/* Right Side */}

              <div className="border border-gray-300 px-4 py-2 text-sm cursor-pointer">
                Sort By :<span className="font-semibold"> Recommended</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {displayProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </div>
      <BrandFilterModal
        open={showBrandModal}
        onClose={() => setShowBrandModal(false)}
        brandCounts={brandCounts}
        selectedBrands={selectedBrands}
        handleBrandChange={handleBrandChange}
      />

      <CategoryFilterModal
        open={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        categoryCounts={categoryCounts}
        selectedSubCategories={selectedSubCategories}
        handleSubCategoryChange={handleSubCategoryChange}
      />
    </>
  );
};

export default ProductsPage;
