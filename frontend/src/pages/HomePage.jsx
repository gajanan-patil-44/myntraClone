import { useEffect, useState } from "react";

import bannerMenSale from "../assets/banners/banner-men-sale.jpg";
import bannerWomenSale from "../assets/banners/banner-women-sale.jpg";
import bannerElectronicsSale from "../assets/banners/banner-electronics-sale.jpg";

import categoryPlaceholder from "../assets/categories/category-placeholder.jpg";

const HomePage = () => {
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
              onClick={() => {
                // TODO:
                // navigate(`/products?category=${banner.category}`)
              }}
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
    </>
  );
};

export default HomePage;