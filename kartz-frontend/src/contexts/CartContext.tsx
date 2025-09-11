"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api"; // adjust path as needed

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  slug?: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  addToCart: (product: any, quantity?: number) => Promise<void>;
  removeFromCart: (productSlug: string) => Promise<void>;
  updateCartQuantity: (productSlug: string, quantity: number) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    fetchCart();
  }
}, []);


  // Calculate cartCount and cartTotal from cart state
  const cartCount = Array.isArray(cart)
  ? cart.reduce((sum, item) => sum + item.quantity, 0)
  : 0;

const cartTotal = Array.isArray(cart)
  ? cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  : 0;

 async function fetchCart() {
  try {
    const response = await api.get("/cart/");
    const cartData = response.data;

    if (cartData && Array.isArray(cartData.items)) {
      // Map API items to your CartItem format
      const cartItems: CartItem[] = cartData.items.map((item: any) => ({
        id: item.product.id,
        title: item.product.title,
        price: Number(item.product.price),  // convert from string to number
        quantity: item.quantity,
        image: item.product.image_url || item.product.image,
        slug: item.product.slug,
      }));

      setCart(cartItems);
    } else {
      setCart([]);
    }
  } catch (error) {
    console.error("Failed to fetch cart", error);
  }
}



  const addToCart = async (product: any, quantity = 1) => {
  // Optimistic UI update:
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    setCart(cart.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    ));
  } else {
    const newItem: CartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity,
      image: product.image,
      slug: product.slug
    };
    setCart([...cart, newItem]);
  }

  // Then sync with server
  try {
    await api.post("/cart/add/", {
      product_id: product.id,
      quantity,
    });
    // Optionally refetch from server to reconcile
    await fetchCart();
  } catch (error) {
    console.error("Failed to sync cart with server", error);
    // Optionally revert optimistic update here
  }
};


  async function removeFromCart(productSlug: string) {
    try {
      // Find the cart item id for delete API — you may need to pass the cart item id or use productId directly
      // Assuming productId corresponds to cart item id here
      await api.delete(`/cart/items/${productSlug}/`);
      await fetchCart();
    } catch (error) {
      console.error("Failed to remove from cart", error);
    }
  }

  async function updateCartQuantity(productSlug: string, quantity: number) {
    try {
      if (quantity <= 0) {
        await removeFromCart(productSlug);
      } else {
        await api.patch(`/cart/items/${productSlug}/`, { quantity });
      }
      await fetchCart();
    } catch (error) {
      console.error("Failed to update cart quantity", error);
    }
  }

  function clearCart() {
    setCart([]);
    // Optionally you can add an API call if your backend supports clearing cart
  }

  const value: CartContextType = {
    cart,
    cartCount,
    cartTotal,
    showCart,
    setShowCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
