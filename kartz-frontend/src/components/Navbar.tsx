"use client";
import Link from "next/link";
import { ShoppingCart, X, Minus, Plus, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

export const NavbarClient = () => {
  const { cartCount, showCart, setShowCart, cart, updateCartQuantity, cartTotal } = useCart();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Listen for custom login event
    const handleUserLogin = (event) => {
      setUser(event.detail);
    };

    window.addEventListener('userLogin', handleUserLogin);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('userLogin', handleUserLogin);
    };
  }, []);

  const handleCheckoutClick = () => {
    setShowCart(false);    // close cart sidebar before redirect
    router.push("/checkout");  // navigate to /checkout
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-bold text-2xl text-gray-900 hover:text-gray-700 transition-colors">
            KartZ
          </Link>
          <nav className="flex space-x-1">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            >
              Home
            </Link>
            {/* Show these navigation items only when user is logged in */}
            {user && (
              <>
                {/* Show Manage Products link only for staff users */}
                {user.is_staff && (
                  <Link
                    href="/seller/add-product"
                    className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                  >
                    Seller Dashboard
                  </Link>
                )}

                <button
                  onClick={() => setShowCart(true)}
                  className="relative px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-medium flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>
                <Link
              href="/products"
              className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            >
              Products
            </Link>

                <Link
                  href="/orders"
                  className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                >
                  My Orders
                </Link>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 text-gray-600">
                  Hi, {user.first_name || user.username}
                </span>
                <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    setUser(null);
                    window.location.href = "/";
                  }}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Global Cart Sidebar - Only show if user is logged in */}
      {user && showCart && (
        <div
          className="fixed inset-0 z-50 flex"
          onClick={() => setShowCart(false)} // Close on clicking anywhere outside
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0" />

          {/* Sidebar Panel */}
          <div
            className="ml-auto w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col z-10 relative"
            onClick={(e) => e.stopPropagation()} // Prevent sidebar clicks from closing
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Shopping Cart ({cartCount})</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {Array.isArray(cart) ? (
                      cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
                          {item.image && (
                            <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-xl" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 line-clamp-2">{item.title}</h4>
                            <p className="text-gray-600">₹{item.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.slug, item.quantity - 1)}
                              className="p-1 hover:bg-white rounded-lg"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.slug, item.quantity + 1)}
                              className="p-1 hover:bg-white rounded-lg"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No items in cart</p>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-green-600">₹{cartTotal.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={handleCheckoutClick}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                      >
                        <Zap className="w-5 h-5" />
                        Checkout Now
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};