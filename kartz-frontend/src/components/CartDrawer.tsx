"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const CartDrawer = () => {
  const { showCart, setShowCart } = useCart();
  const router = useRouter();

  return (
    <AnimatePresence>
      {showCart && (
        <>
          {/* Blur Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowCart(false)}
          />

          {/* Cart Drawer */}
          <motion.div
            key="cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 w-96 bg-white h-full shadow-2xl z-50 flex flex-col"
          >
            {/* Cart Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-600 hover:text-black text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Cart Items (Sample Placeholder) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">iPhone 17 Pro</span>
                <span className="font-semibold">₹58,666</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">MacBook Air M4</span>
                <span className="font-semibold">₹1,25,000</span>
              </div>
            </div>

            {/* Cart Footer */}
            <div className="p-4 border-t space-y-3">
              <button
                onClick={() => {
                  setShowCart(false);
                  router.push("/cart");
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Edit Cart
              </button>

              <Link href="/checkout" className="block w-full">
                  <button
                    onClick={() => setShowCart(false)}
                    className="w-full bg-green-600 text-white py-3 font-semibold rounded-lg hover:bg-green-700 transition-all"
                  >
                    Checkout
                  </button>
                </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
