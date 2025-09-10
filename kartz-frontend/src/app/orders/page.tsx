"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { format } from "date-fns";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/orders/");
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
        // Optional: redirect to login if unauthorized
        if (error.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-center mt-10">You have no orders yet.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border p-4 rounded-md shadow-sm bg-white">
            <div className="mb-2">
              <p><strong>Order ID:</strong> #{order.id}</p>
              <p><strong>Date:</strong> {format(new Date(order.created_at), "PPPp")}</p>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Payment:</strong> {order.payment_status}</p>
            </div>

            <hr className="my-3" />

            <h3 className="font-semibold mb-2">Items:</h3>
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-start gap-4">
                  <img
                    src={item.product.image_url}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.product.title}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.price} × {item.quantity} = ₹{item.subtotal}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
