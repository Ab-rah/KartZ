"use client";
import api from "../../../lib/api";

import React, { useEffect, useState } from "react";
import { Search, Filter, Plus, Edit3, Trash2, Star, ShoppingCart, Eye, Grid3X3, List, ArrowUpDown, TrendingUp, Package, Heart, Share2 } from "lucide-react";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // ✅ Fetch user and products from API
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

  // ✅ Delete handler
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await api.delete(`/catalog/products/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const categories = ['all', 'Electronics', 'Furniture', 'Wearables', 'Gaming'];

  const filteredProducts = products.filter(product => 
    (selectedCategory === 'all' || product.category_name === selectedCategory) &&
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ProductCard = ({ product }) => (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50">
      {/* Product Badge */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {product.isNew && (
          <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            NEW
          </span>
        )}
        {product.discount > 0 && (
          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Wishlist & Share */}
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
        <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
        <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
          <Share2 className="w-4 h-4 text-gray-600 hover:text-blue-500 transition-colors" />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button className="bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full font-medium shadow-lg hover:bg-white hover:scale-105 transition-all duration-200 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Quick View
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
            <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">
              {product.title}
            </h3>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">{product.rating}</span>
              <span className="text-xs text-gray-500">({product.reviews})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            {product.discount > 0 ? (
              <>
                <span className="text-2xl font-bold text-gray-900">
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Stock</p>
            <p className={`text-sm font-medium ${product.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
              {product.stock} left
            </p>
          </div>
        </div>

        {/* Admin Actions */}
        {user?.is_staff && user.id === product.owner && (
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-4 rounded-xl font-medium hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
            <button className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-4 rounded-xl font-medium hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Discover Amazing Products
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Premium quality products curated just for you. Find everything you need in one place.
            </p>
            
            {user?.is_staff && (
              <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center gap-3 mx-auto">
                <Plus className="w-5 h-5" />
                Add New Product
              </button>
            )}
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full animate-float-delay"></div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {/* Search */}
            <div className="relative flex-1 min-w-80">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white/50 text-gray-700 hover:bg-white/80'
                  }`}
                >
                  {category === 'all' ? 'All Products' : category}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-2xl transition-all duration-200 ${
                  viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white/50 text-gray-600 hover:bg-white/80'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-2xl transition-all duration-200 ${
                  viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white/50 text-gray-600 hover:bg-white/80'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-3xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Products</p>
                <p className="text-3xl font-bold">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-6 rounded-3xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">In Stock</p>
                <p className="text-3xl font-bold">{products.filter(p => p.stock > 0).length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-3xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Categories</p>
                <p className="text-3xl font-bold">{categories.length - 1}</p>
              </div>
              <Filter className="w-8 h-8 text-purple-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-3xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Avg Rating</p>
                <p className="text-3xl font-bold">4.7</p>
              </div>
              <Star className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {selectedCategory === 'all' ? 'All Products' : selectedCategory}
            <span className="text-lg font-normal text-gray-500 ml-3">
              ({filteredProducts.length} items)
            </span>
          </h2>
        </div>

        <div className={`grid gap-8 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 6s ease-in-out infinite 2s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
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

export default ProductsPage;