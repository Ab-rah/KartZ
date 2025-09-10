"use client";

import { useCart } from "@/contexts/CartContext";

export default function TestPage() {
  const { cart } = useCart();
  return <div>Cart length: {cart.length}</div>;
}
