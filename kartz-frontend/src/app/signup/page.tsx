/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import api from "@/lib/api";

export default function SignupPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/users/signup/", form);
      setMessage("Signup successful! Please login.");
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Error signing up.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Sign Up
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}