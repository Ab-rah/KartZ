/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import api from "@/lib/api";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/users/signup/", form, {
        headers: {
          Authorization: "", // override global auth header for signup
        },
      });
      setMessage("Signup successful! Please login.");
    } catch (err: any) {
      const detail =
            err.response?.data?.email?.[0] || // validation errors for email field
            err.response?.data?.detail || // generic error message
            "Error signing up.";
        setMessage(detail);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-black rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          value={form.email}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          value={form.password}
          required
        />
        <input
          type="text"
          placeholder="First Name"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          value={form.first_name}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          value={form.last_name}
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Sign Up
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
