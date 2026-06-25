import { FiUser, FiHeart, FiShoppingBag, FiSearch } from "react-icons/fi";
import { categories } from "../constants/categories";
import { navbarCategories } from "../constants/navbarCategories";
import myntraLogo from "../assets/myntraLogo.jpg";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { logoutUser } from "../store/slices/authThunks";
import { fetchWishlist } from "../store/slices/wishlistThunks";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsProfileMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(resultAction)) {
      setIsProfileMenuOpen(false);
      navigate("/");
    }
  };

  const handleMyProfile = () => {
    setIsProfileMenuOpen(false);
    // Navigate to the profile page leter
    navigate("/");
  };

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    navigate("/wishlist");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

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
                  navigate(`/products/${category}`);
                  setActiveCategory(null);
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
          <div className="relative" ref={profileMenuRef}>
            <div
              className="flex flex-col items-center text-xs font-medium cursor-pointer"
              onClick={handleProfileClick}
            >
              <FiUser size={20} />
              <span>
                {isAuthenticated ? user?.firstName || "Profile" : "Profile"}
              </span>
            </div>

            {isAuthenticated && isProfileMenuOpen && (
              <div className="absolute top-12 right-0 w-44 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
                {/* <button
        type="button"
        onClick={handleMyProfile}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        My Profile
      </button> */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <div
            className="relative flex flex-col items-center text-xs font-medium cursor-pointer"
            onClick={handleWishlistClick}
          >
            <FiHeart size={20} />
            <span>Wishlist</span>

            {isAuthenticated && wishlistItems.length > 0 && (
              <span className="absolute -top-2 left-5 min-w-[18px] h-[18px] px-1 rounded-full bg-pink-500 text-white text-[10px] flex items-center justify-center font-semibold">
                {wishlistItems.length}
              </span>
            )}
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
                          onClick={() => {
                            navigate(`/products/${activeCategory}/${item}`);
                            setActiveCategory(null);
                          }}
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
