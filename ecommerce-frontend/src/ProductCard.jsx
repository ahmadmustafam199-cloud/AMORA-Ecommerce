import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Check,
  ShoppingCart,
  X,
  ArrowRight,
  Heart,
  Star,
} from "lucide-react";

import { useCart } from "./useCart";

// =====================================================
// DEPLOYED BACKEND URL
// =====================================================

const API_URL = "https://amora-backend-lake.vercel.app";

// =====================================================
// IMAGE URL HELPER
// =====================================================

const getImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_URL}${image}`;
  }

  return `${API_URL}/${image}`;
};

// =====================================================
// FETCH PRODUCTS FROM API
// =====================================================

const fetchProductsFromAPI = async () => {
  const response = await fetch(
    `${API_URL}/api/products`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch products"
    );
  }

  if (Array.isArray(data)) {
    return data;
  }

  return (
    data.products ||
    data.data ||
    []
  );
};

// =====================================================
// PRODUCT CARD COMPONENT
// =====================================================

function ProductCard({
  search = "",
  selectedCategory = "",
}) {
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [clickedProduct, setClickedProduct] = useState("");
  const [wishlist, setWishlist] = useState([]);

  const notificationId = useRef(0);

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const productList = await fetchProductsFromAPI();

        if (cancelled) return;

        setProducts(productList);
        setApiError("");
        setLoading(false);
      } catch (error) {
        console.error("Products Fetch Error:", error);

        if (cancelled) return;

        setApiError(
          "Products load nahi ho rahe. Backend connection check karein."
        );
        setLoading(false);
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // RETRY ACTION
  // =====================================================

  const handleRetry = async () => {
    try {
      setLoading(true);
      setApiError("");

      const productList = await fetchProductsFromAPI();
      setProducts(productList);
    } catch (error) {
      console.error("Retry Products Error:", error);
      setApiError(
        "Products load nahi ho rahe. Backend connection check karein."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // AUTO REMOVE NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    if (notifications.length === 0) return;

    const timers = notifications.map((notification) =>
      setTimeout(() => {
        setNotifications((previous) =>
          previous.filter((item) => item.id !== notification.id)
        );
      }, 4000)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [notifications]);

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = (product) => {
    const productId = product._id || product.id;

    const existingProduct = cart.find(
      (item) =>
        item._id === product._id ||
        item.id === product.id ||
        item.name === product.name
    );

    const newQuantity = existingProduct
      ? Number(existingProduct.quantity || 0) + 1
      : 1;

    const cartProduct = {
      ...product,
      image:
        product.image ||
        product.images?.[0] ||
        "",
    };

    addToCart(cartProduct);

    setClickedProduct(productId);
    setTimeout(() => {
      setClickedProduct("");
    }, 700);

    notificationId.current += 1;

    const notification = {
      ...cartProduct,
      quantity: newQuantity,
      id: notificationId.current,
    };

    setNotifications((previous) =>
      [notification, ...previous].slice(0, 3)
    );
  };

  // =====================================================
  // CLOSE NOTIFICATION
  // =====================================================

  const closeNotification = (id) => {
    setNotifications((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  // =====================================================
  // TOGGLE WISHLIST
  // =====================================================

  const toggleWishlist = (productId) => {
    setWishlist((previous) =>
      previous.includes(productId)
        ? previous.filter((id) => id !== productId)
        : [...previous, productId]
    );
  };

  // =====================================================
  // FILTER COMPUTATION
  // =====================================================

  const searchText = String(search || "").toLowerCase().trim();
  const categoryText = String(selectedCategory || "").toLowerCase().trim();

  const filteredProducts = products.filter((product) => {
    const name = String(product.name || "").toLowerCase();
    const category = String(product.category || "").toLowerCase();

    const matchesSearch =
      !searchText ||
      name.includes(searchText) ||
      category.includes(searchText);

    const matchesCategory =
      !categoryText ||
      categoryText === "all" ||
      category === categoryText;

    return matchesSearch && matchesCategory;
  });

  // =====================================================
  // LOADING RENDER
  // =====================================================

  if (loading) {
    return (
      <section className="py-16 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
        <p className="mt-4 text-sm font-semibold text-gray-500">
          Loading products...
        </p>
      </section>
    );
  }

  // =====================================================
  // ERROR RENDER
  // =====================================================

  if (apiError) {
    return (
      <section className="px-4 py-16 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-red-100 bg-red-50 p-6">
          <ShoppingCart
            size={35}
            className="mx-auto text-red-400"
          />
          <h2 className="mt-4 text-lg font-bold text-red-700">
            Unable to Load Products
          </h2>
          <p className="mt-2 text-sm text-red-600">
            {apiError}
          </p>
          <button
            onClick={handleRetry}
            className="mt-5 rounded-lg bg-orange-500 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // =====================================================
  // MAIN COMPONENT UI
  // =====================================================

  return (
    <section className="relative px-4 py-8 max-w-7xl mx-auto">

      {/* CART NOTIFICATIONS TOAST */}

      <div className="fixed right-4 top-4 z-50 flex w-96 max-w-[95vw] flex-col gap-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl animate-[slideIn_0.45s_ease-out]"
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50">
                  <div className="absolute inset-0 animate-ping rounded-full bg-green-200 opacity-40" />
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                    <Check size={17} strokeWidth={3} />
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-green-600">
                    Added to cart
                  </p>
                  <h3 className="mt-1 text-sm font-bold text-gray-900 line-clamp-1">
                    {notification.name || "Product added"}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Qty: {notification.quantity}
                  </p>
                </div>

                <button
                  onClick={() => closeNotification(notification.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-xs font-semibold text-gray-700">
                  Rs. {Number(notification.price || 0).toLocaleString()}
                </span>
                <button
                  onClick={() => navigate("/cart")}
                  className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  View Cart <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PRODUCTS GRID */}

      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-base text-gray-500">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => {
            const productId = product._id || product.id;
            const isWishlisted = wishlist.includes(productId);
            const isClicked = clickedProduct === productId;
            const imageSrc = getImageUrl(
              product.image || product.images?.[0]
            );

            return (
              <div
                key={productId}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* CARD TOP MEDIA */}

                <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No Image Available
                    </div>
                  )}

                  {/* BADGES & ACTIONS OVERLAY */}

                  <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                    {product.category && (
                      <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-700 backdrop-blur-md">
                        {product.category}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleWishlist(productId)}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm transition-all hover:bg-white hover:text-red-500"
                  >
                    <Heart
                      size={16}
                      className={isWishlisted ? "fill-red-500 text-red-500" : ""}
                    />
                  </button>
                </div>

                {/* CARD BODY */}

                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star size={13} className="fill-amber-400" />
                    <span className="text-xs font-bold text-gray-700">4.5</span>
                    <span className="text-[11px] text-gray-400">(24)</span>
                  </div>

                  <h3 className="mt-2 text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-orange-600">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500 line-clamp-2 flex-1">
                    {product.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between pt-2 border-t border-gray-50">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Price</p>
                      <p className="text-base font-bold text-gray-900">
                        Rs. {Number(product.price || 0).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 ${
                        isClicked
                          ? "scale-95 bg-green-600 text-white"
                          : "bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
                      }`}
                    >
                      {isClicked ? (
                        <>
                          <Check size={15} /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={15} /> Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ProductCard;