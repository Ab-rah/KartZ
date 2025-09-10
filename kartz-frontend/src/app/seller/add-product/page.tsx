"use client";
import api from "../../../lib/api";
import React, { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Star, Grid3X3, List, Package, TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation"; //


const SellerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Fetch user and products from API
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchProducts = async () => {
      try {
        console.log("Fetching products...");
        const response = await api.get("/catalog/products/");
        console.log("Products fetched:", response.data);
        setProducts(response.data.results || response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const totalProducts = products.length;
    const inStockCount = React.useMemo(() => products.filter(p => p.stock > 0).length, [products]);
    const outOfStockCount = React.useMemo(() => products.filter(p => p.stock === 0).length, [products]);
    const avgPrice = React.useMemo(() => {
      if (products.length === 0) return 0;
      const sum = products.reduce((acc, p) => acc + (p.price || 0), 0);
      return Math.round(sum / products.length);
    }, [products]);


  // Delete handler
  const handleDelete = async (slug) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("access_token");
        await api.delete(`/catalog/products/${slug}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(products.filter((p) => p.slug !== slug));
      } catch (err) {
        console.error("Failed to delete product", err);
      }
    }
  };

  const handleEdit = (slug) => {
  router.push(`/seller/products/${slug}/edit`);
};

  const handleAddProduct = () => {
  router.push("/seller/products/add");
};

  const ProductCard = ({ product }) => (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover"
        />

        {/* Stock Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            product.stock > 10 
              ? 'bg-green-100 text-green-800' 
              : product.stock > 0 
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-3">
          <p className="text-sm text-gray-500 mb-1">{product.category_name}</p>
          <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">
            {product.title}
          </h3>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-gray-900">
            ₹{product.price}
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{product.rating || 0}</span>
            <span className="text-xs text-gray-500">({product.reviews || 0})</span>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(product.slug)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => handleDelete(product.slug)}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Management
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your product inventory, update details, and track performance
          </p>

          <button
            onClick={handleAddProduct}
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 flex items-center gap-3 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">In Stock</p>
                <p className="text-3xl font-bold text-green-600">{inStockCount}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Out of Stock</p>
                <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Avg Price</p>
                <p className="text-3xl font-bold text-purple-600">
                  ₹{avgPrice}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* View Toggle and Products Count */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Your Products
              <span className="text-lg font-normal text-gray-500 ml-3">
                ({products.length} items)
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">No products yet</h3>
              <p className="text-gray-600 mb-8">Start by adding your first product to begin selling</p>
              <button
                onClick={handleAddProduct}
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
              >
                Add Your First Product
              </button>
            </div>
          </div>
        )}
      </section>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default SellerProductsPage;