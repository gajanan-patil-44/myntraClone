import { useEffect,useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useParams } from "react-router-dom";

const ProductsPage = () => {
  const { category } = useParams();
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

  const filteredProducts = category
  ? products.filter(
      (product) =>
        product.category.toLowerCase() ===
        category.toLowerCase()
    )
  : products;

  return (
  <>
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-6">
        {/* Filters Placeholder */}

        <aside className="hidden lg:block w-1/5 border-r pr-4">
          <h2 className="font-bold text-lg mb-4">
            FILTERS
          </h2>

          <div className="space-y-4 text-sm text-gray-600">
            <p>Categories</p>
            <p>Brand</p>
            <p>Price</p>
            <p>Color</p>
            <p>Size</p>
          </div>
        </aside>

        {/* Products Grid */}

        <section className="w-full lg:w-4/5">
          <h1 className="text-3xl font-bold mb-6">
            {category || "All Products"}
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  </>
);
};

export default ProductsPage;