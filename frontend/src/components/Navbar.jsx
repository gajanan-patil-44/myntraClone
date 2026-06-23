import { FiUser, FiHeart, FiShoppingBag, FiSearch } from "react-icons/fi";
import { categories } from "../constants/categories";
import { navbarCategories } from "../constants/navbarCategories";
import myntraLogo from "../assets/myntraLogo.jpg";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] z-50">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/">
          <img
            src={myntraLogo}
            alt="Myntra Logo"
            className="h-16 w-auto cursor-pointer"
          />
        </Link>

        {/* Categories */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase">
          {Object.keys(categories).map((category) => (
            <Link to={`/products/${category}`} key={category}>
              {/* <li
                className={`cursor-pointer h-full flex items-center border-b-4 transition-colors ${
                  activeCategory === category
                    ? "border-orange-400"
                    : "border-transparent"
                }`}
                onMouseEnter={() => setActiveCategory(category)}
              >
                {category}
              </li> */}
              <li
                key={category}
                className={`cursor-pointer h-full flex items-center border-b-4 transition-colors ${
                  activeCategory === category
                    ? "border-orange-400"
                    : "border-transparent"
                }`}
                onMouseEnter={() => {
                  setActiveCategory(category);
                }}
                onClick={() => {
                  window.location.href = `/products/${category}`;
                }}
              >
                {category}
              </li>
            </Link>
          ))}
        </ul>

        {/* Search */}
        <div className="hidden lg:flex items-center bg-gray-100 px-3 py-2 rounded-md flex-1 max-w-md">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none ml-2 w-full"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center text-xs font-medium cursor-pointer">
            <FiUser size={20} />
            <span>Profile</span>
          </div>

          <div className="flex flex-col items-center text-xs font-medium cursor-pointer">
            <FiHeart size={20} />
            <span>Wishlist</span>
          </div>

          <div className="flex flex-col items-center text-xs font-medium cursor-pointer">
            <FiShoppingBag size={20} />
            <span>Cart</span>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {activeCategory && (
        <div
          className="mt-16 fixed inset-0 bg-black/20 z-40"
          onClick={() => setActiveCategory(null)}
        />
      )}

      {/* Mega Menu */}
      {activeCategory && (
        <div
          className="absolute top-full left-44 right-80 bg-white shadow-xl z-50"
          onMouseLeave={() => setActiveCategory(null)}
        >
          <div className="max-w-5xl mx-auto px-12 py-10">
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(navbarCategories[activeCategory] || {}).map(
                ([section, items]) => (
                  <div key={section}>
                    <h3 className="font-bold text-pink-600 mb-3">{section}</h3>

                    <ul className="space-y-2">
                      {items.map((item) => (
                        <li
                          key={`${section}-${item}`}
                          className="text-sm text-gray-700 hover:font-semibold cursor-pointer"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
