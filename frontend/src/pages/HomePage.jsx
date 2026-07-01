import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import bannerMenSale from "../assets/banners/banner-men-sale.jpg";
import bannerWomenSale from "../assets/banners/banner-women-sale.jpg";
import bannerElectronicsSale from "../assets/banners/banner-electronics-sale.jpg";

import categoryPlaceholder from "../assets/categories/category-placeholder.jpg";
import { categories } from "../constants/categories";
import api from "../api/axios";

const HomePage = () => {
  const navigate = useNavigate();
  const banners = [
    {
      image: bannerMenSale,
      category: "Men",
    },
    {
      image: bannerWomenSale,
      category: "Women",
    },
    {
      image: bannerElectronicsSale,
      category: "Electronics",
    },
  ];



  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.products);
    } catch (err) {
      console.error(err);
    }
  };

  fetchProducts();
}, []);
const shopCategories = Object.entries(categories).flatMap(
  ([category, subcategories]) =>
    subcategories.map((subcategory) => {
      const firstProduct = products.find(
        (product) =>
          product.category === category &&
          product.subCategory === subcategory
      );
      console.log(category, subcategory, firstProduct);

      return {
        category,
        subcategory,
        image:
          firstProduct?.images?.[0] || categoryPlaceholder,
      };
    })
);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % banners.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Carousel */}
      <section className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {banners.map((banner) => (
            <div
              key={banner.category}
              className="min-w-full cursor-pointer"
              onClick={() =>
  navigate(`/products/${encodeURIComponent(banner.category)}`)
}
            >
              <img
                src={banner.image}
                alt={banner.category}
                className="w-full block"
              />
            </div>
          ))}
        </div>
      </section>

       {/* Shop by Category  */}
      <section className="max-w-7xl mx-auto px-4 py-12">
  <h2 className="text-3xl font-bold text-center mb-10">
    Shop By Category
  </h2>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
    {shopCategories.map((item) => (
      <div
        key={`${item.category}-${item.subcategory}`}
        className="cursor-pointer group"
        onClick={() =>
  navigate(
  `/products/${encodeURIComponent(item.category)}/${encodeURIComponent(item.subcategory)}`
)
}
      >
        <div className="overflow-hidden rounded-lg border-[5px] border-solid border-orange-300">
          <img
            src={item.image}
            alt={item.subcategory}
            className="w-full aspect-square object-cover group-hover:scale-105 transition duration-300"
          />
        <div className="my-3 text-center">
          <p className="font-semibold">
            {item.subcategory}

          </p>

        </div>
        </div>

      </div>
    ))}
  </div>
</section>
    </>
  );
};

export default HomePage;