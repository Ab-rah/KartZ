"use client";
import api from "@/lib/api";
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Plus,
  Minus,
  Grid3X3,
  List,
  SlidersHorizontal,
  ChevronDown,
  Truck,
  Shield,
  RotateCcw,
  Zap,
  X,
  Check
} from "lucide-react";
import { useRouter } from "next/router"; // If you use Next.js routing


const categories = ['all', 'Electronics', 'Gaming', 'Wearables', 'Audio'];

const CustomerShopPage = () => {
//   const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [user, setUser] = useState<any | null>(null);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showQuickView, setShowQuickView] = useState(null);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await api.get("/catalog/products/");
      const data = res.data.results || res.data;

      const normalizedProducts = data.map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        price: Number(p.price),
        inStock: p.stock > 0,
        isActive: p.is_active,
        isFeatured: false,
        discount: 0,
        originalPrice: Number(p.price),
        description: p.description || 'No description available',
        rating: p.rating || 0,
        reviews: p.reviews || 0,
        image: p.image_url,
        category: p.category_name,
      }));

      setProducts(normalizedProducts);
      console.log("Normalized products:", normalizedProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);



  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("access_token");
      await api.delete(`/catalog/products/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const toggleWishlist = (product) => {
    if (wishlist.find(item => item.id === product.id)) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };
  const filteredProducts = products; // no filter


//   const filteredProducts = products
//     .filter(product =>
//       (selectedCategory === 'all' || product.category === selectedCategory) &&
//       product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
//       product.price >= priceRange[0] && product.price <= priceRange[1]
//     )
//     .sort((a, b) => {
//       switch(sortBy) {
//         case 'price-low': return a.price - b.price;
//         case 'price-high': return b.price - a.price;
//         case 'rating': return b.rating - a.rating;
//         case 'newest': return b.id - a.id;
//         default: return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
//       }
//     });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ... your UI rendering code here, including buttons to call handleDelete, addToCart etc.

const ProductCard = ({ product }) => (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
      {/* Product Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.discount > 0 && (
          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            -{product.discount}%
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            FEATURED
          </span>
        )}
        {!product.inStock && (
          <span className="bg-gray-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            OUT OF STOCK
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product)}
        className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <Heart className={`w-4 h-4 ${
          wishlist.find(item => item.id === product.id)
            ? 'text-red-500 fill-red-500'
            : 'text-gray-600'
        }`} />
      </button>

      {/* Product Image */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => setShowQuickView(product)}
            className="bg-white text-gray-800 px-4 py-2 rounded-full font-medium shadow-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Quick View
          </button>
          {product.inStock && (
            <button
              onClick={() => addToCart(product)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full font-medium shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.reviews})</span>
        </div>

       <h3 className="relative z-10 font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {product.title}
        </h3>


        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>

          {product.inStock ? (
            <button
              onClick={() => addToCart(product)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-2xl hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-300 text-gray-500 p-3 rounded-2xl cursor-not-allowed"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ShopHub
              </h1>

              {/* Search */}
              <div className="relative w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50"
                />
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setShowCart(true)}
              className="relative bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-medium hover:scale-105 transition-all duration-200 flex items-center gap-3"
            >
              <ShoppingCart className="w-5 h-5" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-5xl font-bold mb-6">Discover Amazing Products</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Shop the latest tech, gaming gear, and accessories at unbeatable prices
          </p>
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg p-6 border border-white/20 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {/* Categories */}
            <div className="flex items-center gap-3">
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

            {/* Sort & View Controls */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/50 border border-gray-200/50 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white/50 text-gray-600'}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white/50 text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)} />
          <div className="ml-auto w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Shopping Cart ({cartCount})</h3>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-xl" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 line-clamp-2">{item.title}</h4>
                        <p className="text-gray-600">${item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded-lg"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded-lg"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-green-600">${cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3">
                  <Zap className="w-5 h-5" />
                  Checkout Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowQuickView(null)} />
          <div className="relative bg-white rounded-3xl max-w-4xl mx-4 overflow-hidden shadow-2xl">
            <button
              onClick={() => setShowQuickView(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-96 md:h-auto">
                <img
                  src={showQuickView.image}
                  alt={showQuickView.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(showQuickView.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">({showQuickView.reviews} reviews)</span>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">{showQuickView.title}</h2>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold text-green-600">${showQuickView.price}</span>
                  {showQuickView.originalPrice > showQuickView.price && (
                    <span className="text-xl text-gray-500 line-through">${showQuickView.originalPrice}</span>
                  )}
                </div>

                <p className="text-gray-600 mb-6">{showQuickView.description}</p>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Features:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {showQuickView.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {showQuickView.inStock ? (
                  <button
                    onClick={() => {
                      addToCart(showQuickView);
                      setShowQuickView(null);
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-4 rounded-2xl font-semibold cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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

export default CustomerShopPage;