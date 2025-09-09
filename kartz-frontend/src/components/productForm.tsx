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
  const router = useRouter();

  useEffect(() => {
    // Fetch categories from API
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

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        price: initialData.price,
        stock: initialData.stock,
        category: initialData.category,
        description: initialData.description,
        image: null,
        is_active: initialData.is_active,
      });
    }
  }, [initialData]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      if (initialData) {
        await api.patch(`/catalog/products/${initialData.slug}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product updated successfully");
      } else {
        await api.post("/catalog/products/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product created successfully");
      }

      router.push("/seller/products");
    } catch (err) {
      console.error("Failed to submit", err);
      alert("Something went wrong!");
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
        {initialData?.image_url && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">Current Image:</p>
            <img
              src={initialData.image_url}
              alt="Current"
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
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        {initialData ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;
