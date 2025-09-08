/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    api.get("/catalog/products/").then((res) => setProducts(res.data.results || res.data));
  }, []);

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => (
        <Link
          key={p.id}
          href={`/products/${p.slug}`}
          className="border rounded-xl p-4 shadow hover:shadow-lg"
        >
          <h2 className="font-bold text-lg">{p.title}</h2>
          <p className="text-gray-600">{p.price} ₹</p>
        </Link>
      ))}
    </div>
  );
}