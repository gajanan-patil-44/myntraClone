import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useParams } from "react-router-dom";

const ProductsPage = () => {
  const { category, subCategory } = useParams();
  const [products, setProducts] = useState([]);

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

  return (
    <>
      <div className="mb-6 mx-6 mt-3">
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
            - {categoryProducts.length} Items
          </span>
        </h1>
      </div>
      <div className=" px-6 py-6">
        <div className="flex gap-6">
          {/* Filters Placeholder */}

          <aside className="hidden lg:block w-55 shrink-0 border-r border-gray-200">
            <h2 className="text-2xl font-bold mb-6">FILTERS</h2>

            <div>
              <div className="border-t border-gray-200 py-4">
                <h3 className="text-sm font-bold uppercase mb-3">Categories</h3>

                <div className="space-y-2">
                  {Object.entries(categoryCounts).map(([subCat, count]) => (
                    <div key={subCat} className="text-sm text-gray-700">
                      {subCat}
                      <span className="text-gray-400 ml-1">({count})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 py-4">
                <h3 className="text-sm font-bold uppercase mb-3">Brand</h3>

                <div className="space-y-2">
                  {Object.entries(brandCounts).map(([brand, count]) => (
                    <div key={brand} className="text-sm text-gray-700">
                      {brand}
                      <span className="text-gray-400 ml-1">({count})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 py-4">
                <h3 className="text-sm font-bold uppercase">Price</h3>
              </div>

              <div className="border-t border-gray-200 py-4">
                <h3 className="text-sm font-bold uppercase mb-3">Brand</h3>
                <div className="space-y-2">
                  {Object.entries(colorCounts).map(([color, count]) => (
                    <div key={color} className="text-sm text-gray-700">
                      {color}
                      <span className="text-gray-400 ml-1">({count})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 py-4">
                <h3 className="text-sm font-bold uppercase mb-3">Size</h3>
                <div className="space-y-2">
                  {Object.entries(sizeCounts).map(([size, count]) => (
                    <div key={size} className="text-sm text-gray-700">
                      {size}
                      <span className="text-gray-400 ml-1">({count})</span>
                    </div>
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
              {categoryProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
