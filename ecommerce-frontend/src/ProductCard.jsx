import { useState, useEffect, useContext } from 'react';
import { CartContext } from './CartContext';

// Helper function outside component to avoid ESLint React Compiler purity warnings
let toastCounter = 0;
const generateToastId = () => {
  toastCounter = (toastCounter + 1) % Number.MAX_SAFE_INTEGER;
  return `${Date.now()}-${toastCounter}`;
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  // Notifications state
  const [notifications, setNotifications] = useState([]);

  // Access Cart Context safely
  const { addToCart } = useContext(CartContext) || {};

  // Backend URL helper for image source resolution
  const BACKEND_URL = 'https://amora-backend-lake.vercel.app';

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x400?text=No+Image';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${BACKEND_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  // Toast Notification Trigger
  const showNotification = (message) => {
    const id = generateToastId();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    }, 3000);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        const loadedProducts = Array.isArray(data) ? data : data.products || [];
        
        setProducts(loadedProducts);

        // Extract dynamic categories automatically
        const extractedCategories = [
          'All',
          ...new Set(loadedProducts.map((p) => p.category).filter(Boolean))
        ];
        setCategories(extractedCategories);
      } catch (err) {
        setError(err.message || 'Something went wrong while loading products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    if (addToCart) {
      addToCart(product);
      showNotification(`${product.name} added to your cart!`);
    } else {
      showNotification(`Added ${product.name} to cart`);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="pointer-events-auto bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-xl text-sm font-medium flex items-center gap-2 animate-bounce transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {notif.message}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-emerald-900 dark:text-emerald-400">
            Our Products Collection
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Explore quality selections crafted for elegance and modern style.
          </p>
        </div>

        {/* Search & Category Filter Control Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-emerald-100 hover:text-emerald-900 dark:hover:bg-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
                <div className="w-full h-56 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow border border-red-100 dark:border-red-900/30">
            <p className="text-red-500 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-emerald-800 text-white rounded-lg text-sm hover:bg-emerald-900 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Empty Filter State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">No products found matching your active criteria.</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id || product.id}
                className="group flex flex-col justify-between bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                    }}
                  />
                  {product.category && (
                    <span className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-xs font-semibold px-2.5 py-1 rounded-full text-emerald-900 dark:text-emerald-400 shadow-sm">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Info Container */}
                <div className="p-4 flex flex-col grow justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Price & Cart Trigger */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block">Price</span>
                      <span className="text-lg font-bold text-emerald-900 dark:text-emerald-400">
                        ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white rounded-lg text-xs font-medium shadow-md transition-all duration-150 flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                      </svg>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Products;