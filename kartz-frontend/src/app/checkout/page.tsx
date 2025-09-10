"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext"; // assuming you have this

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [isPaying, setIsPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [bill, setBill] = useState<any>(null);

  const handlePayment = () => {
    setIsPaying(true);

    // Mock async payment
    setTimeout(() => {
      // Generate a simple bill/receipt object
      const generatedBill = {
        date: new Date().toLocaleString(),
        items: cart,
        total: cartTotal,
        orderId: Math.floor(Math.random() * 1000000),
      };
      setBill(generatedBill);
      setPaid(true);
      setIsPaying(false);

      // Clear the cart after payment success
      clearCart();
    }, 2000);
  };

  if (paid && bill) {
    // Show the bill/receipt
    return (
      <div className="max-w-md mx-auto p-4 border rounded mt-10">
        <h2 className="text-xl font-bold mb-4">Payment Successful!</h2>
        <p>Order ID: <strong>{bill.orderId}</strong></p>
        <p>Date: {bill.date}</p>
        <hr className="my-4" />
        <h3 className="font-semibold">Items:</h3>
        <ul>
          {bill.items.map((item) => (
            <li key={item.id}>
              {item.title} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
        <hr className="my-4" />
        <p className="font-bold text-lg">Total: ${bill.total.toFixed(2)}</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return <p className="text-center mt-10">Your cart is empty. Please add items before checkout.</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4 mt-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <ul className="mb-4">
        {cart.map((item) => (
          <li key={item.id}>
            {item.title} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>

      <p className="mb-6 font-semibold">Total: ${cartTotal.toFixed(2)}</p>

      <button
        onClick={handlePayment}
        disabled={isPaying}
        className="btn btn-primary w-full"
      >
        {isPaying ? "Processing Payment..." : "Pay Now"}
      </button>
    </div>
  );
}
