import { FiUser, FiHeart, FiShoppingBag, FiSearch } from "react-icons/fi";
import { categories } from "../constants/categories";

const Navbar = () => {
  return (
    <header className="shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="text-2xl font-bold cursor-pointer">
          Myntra
        </div>

        {/* Categories */}
        <ul className="hidden md:flex items-center gap-6 font-medium">
          {Object.keys(categories).map((category) => (
            <li key={category} className="cursor-pointer">
              {category}
            </li>
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
          <div className="flex flex-col items-center text-sm cursor-pointer">
            <FiUser size={20} />
            <span>Profile</span>
          </div>

          <div className="flex flex-col items-center text-sm cursor-pointer">
            <FiHeart size={20} />
            <span>Wishlist</span>
          </div>

          <div className="flex flex-col items-center text-sm cursor-pointer">
            <FiShoppingBag size={20} />
            <span>Cart</span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;