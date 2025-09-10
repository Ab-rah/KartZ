"use client";
import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { useRouter } from "next/navigation";

const ProductForm = ({ initialData = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    image: null,
    is_active: true,
  });

  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/catalog/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Set initial form data when available
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        price: initialData.price?.toString() || "",
        stock: initialData.stock?.toString() || "",
        // Handle category as ID or empty string if missing
        category: initialData.category?.id || "",
        description: initialData.description || "",
        image: null, // new image upload starts null
        is_active: initialData.is_active ?? true,
      });
    }
  }, [initialData]);

  // Generate preview for selected image file
  useEffect(() => {
    if (formData.image) {
      const objectUrl = URL.createObjectURL(formData.image);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [formData.image]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("is_active", formData.is_active.toString());

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (initialData) {
        // Update product (PATCH)
        await api.patch(`/catalog/products/${initialData.slug}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product updated successfully");
      } else {
        // Create product (POST)
        await api.post("/catalog/products/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product created successfully");
      }

      router.push("/seller/add-product");
    } catch (err) {
      console.error("Failed to submit", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-sm border"
      encType="multipart/form-data"
    >
      <div>
        <label className="block font-medium text-gray-700">Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          required
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          required
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">Stock</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          min="0"
          required
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium text-gray-700">Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        />
        {/* Current image */}
        {initialData?.image_url && !preview && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">Current Image:</p>
            <img
              src={initialData.image_url}
              alt="Current"
              className="w-32 h-32 object-cover rounded border"
            />
          </div>
        )}
        {/* New image preview */}
        {preview && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">New Image Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded border"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          required
          rows={4}
        />
      </div>

      <div className="flex items-center text-gray-700">
        <input
          type="checkbox"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="mr-2"
        />
        <label className="font-medium text-gray-700">Is Active</label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {initialData ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;
