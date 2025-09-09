/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Login request
      const res = await api.post("/users/token/", form);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      // Fetch user details to check is_staff
      const userRes = await api.get("/users/manage/", {
        headers: {
          Authorization: `Bearer ${res.data.access}`,
        },
      });

      localStorage.setItem("user", JSON.stringify(userRes.data));

      router.push("/products"); // Redirect to products page
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Invalid credentials.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-black rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-dark border border-gray-700 focus:ring-2 focus:ring-accent text-white"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-dark border border-gray-700 focus:ring-2 focus:ring-accent text-white"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button  className="w-full bg-accent hover:bg-blue-600 p-3 rounded-lg text-white font-semibold">
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
