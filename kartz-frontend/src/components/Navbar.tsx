import { useState } from "react";
import { ShoppingCart, Heart, Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo / Brand */}
          <div className="flex-shrink-0 text-xl font-bold text-gray-900">
            MyStore
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">Home</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">Shop</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">About</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="relative text-gray-700 hover:text-red-500 transition">
              <Heart className="w-5 h-5" />
              {/* Wishlist count (example) */}
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                2
              </span>
            </button>
            <button className="relative text-gray-700 hover:text-blue-600 transition">
              <ShoppingCart className="w-5 h-5" />
              {/* Cart count (example) */}
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1">
                3
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-700 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-sm border-t border-gray-200">
          <nav className="flex flex-col p-4 space-y-2">
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">Home</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">Shop</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">About</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
