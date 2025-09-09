/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      await api.post("/users/signup/", form, {
        headers: {
          Authorization: "", // override global auth header for signup
        },
      });
      setMessage("Account created successfully! You can now sign in.");
      setIsSuccess(true);
      setForm({ email: "", first_name: "", last_name: "", password: "" });
    } catch (err: any) {
      const detail =
        err.response?.data?.email?.[0] || // validation errors for email field
        err.response?.data?.detail || // generic error message
        "Error creating account. Please try again.";
      setMessage(detail);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join KartZ to start shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="First name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  value={form.first_name}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Last name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  value={form.last_name}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                value={form.email}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                value={form.password}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-lg ${isSuccess 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm text-center ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}