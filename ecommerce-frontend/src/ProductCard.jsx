import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Check,
  ShoppingCart,
  X,
  ArrowRight,
  Eye,
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

  /*
    Backend currently returns:

    [
      product1,
      product2,
      product3
    ]

    This also supports:

    {
      success: true,
      products: [...]
    }

    or:

    {
      data: [...]
    }
  */

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
// PRODUCT CARD
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

  const [loading, setLoading] =
    useState(true);

  const [apiError, setApiError] =
    useState("");

  const [notifications, setNotifications] =
    useState([]);

  const [clickedProduct, setClickedProduct] =
    useState("");

  const [wishlist, setWishlist] =
    useState([]);

  const notificationId =
    useRef(0);

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const productList =
          await fetchProductsFromAPI();

        if (cancelled) return;

        setProducts(productList);
        setApiError("");
        setLoading(false);
      } catch (error) {
        console.error(
          "Products Fetch Error:",
          error
        );

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
  // TRY AGAIN
  // =====================================================

  const handleRetry = async () => {
    try {
      setLoading(true);
      setApiError("");

      const productList =
        await fetchProductsFromAPI();

      setProducts(productList);
    } catch (error) {
      console.error(
        "Retry Products Error:",
        error
      );

      setApiError(
        "Products load nahi ho rahe. Backend connection check karein."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // AUTO REMOVE CART NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    if (notifications.length === 0) {
      return;
    }

    const timers =
      notifications.map(
        (notification) =>
          setTimeout(() => {
            setNotifications(
              (previous) =>
                previous.filter(
                  (item) =>
                    item.id !==
                    notification.id
                )
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
    const productId =
      product._id ||
      product.id;

    const existingProduct =
      cart.find(
        (item) =>
          item._id === product._id ||
          item.id === product.id ||
          item.name === product.name
      );

    const newQuantity =
      existingProduct
        ? Number(
            existingProduct.quantity || 0
          ) + 1
        : 1;

    const cartProduct = {
      ...product,

      image:
        product.image ||
        product.images?.[0] ||
        "",
    };

    addToCart(cartProduct);

    // Button animation

    setClickedProduct(
      productId
    );

    setTimeout(() => {
      setClickedProduct("");
    }, 700);

    // Notification

    notificationId.current += 1;

    const notification = {
      ...cartProduct,

      quantity: newQuantity,

      id: notificationId.current,
    };

    setNotifications(
      (previous) =>
        [
          notification,
          ...previous,
        ].slice(0, 3)
    );
  };

  // =====================================================
  // CLOSE NOTIFICATION
  // =====================================================

  const closeNotification = (id) => {
    setNotifications(
      (previous) =>
        previous.filter(
          (item) =>
            item.id !== id
        )
    );
  };

  // =====================================================
  // WISHLIST
  // =====================================================

  const toggleWishlist = (
    productId
  ) => {
    setWishlist(
      (previous) =>
        previous.includes(productId)
          ? previous.filter(
              (id) =>
                id !== productId
            )
          : [
              ...previous,
              productId,
            ]
    );
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const searchText = String(
    search || ""
  )
    .toLowerCase()
    .trim();

  // =====================================================
  // CATEGORY
  // =====================================================

  const categoryText = String(
    selectedCategory || ""
  )
    .toLowerCase()
    .trim();

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts =
    products.filter(
      (product) => {
        const name = String(
          product.name || ""
        ).toLowerCase();

        const category =
          String(
            product.category || ""
          ).toLowerCase();

        const matchesSearch =
          !searchText ||
          name.includes(
            searchText
          ) ||
          category.includes(
            searchText
          );

        const matchesCategory =
          !categoryText ||
          category ===
            categoryText;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );

  // =====================================================
  // LOADING
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
  // API ERROR
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
  // MAIN UI
  // =====================================================

  return (
    <section className="relative">

      {/* =================================================
          CART NOTIFICATIONS
      ================================================= */}

      <div className="fixed right-4 top-4 z-50 flex w-96 max-w-[95vw] flex-col gap-3">

        {notifications.map(
          (notification) => (
            <div
              key={notification.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl animate-[slideIn_0.45s_ease-out]"
            >

              <div className="p-4">

                {/* NOTIFICATION HEADER */}

                <div className="flex items-start gap-3">

                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50">

                    <div className="absolute inset-0 animate-ping rounded-full bg-green-200 opacity-40" />

                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">

                      <Check
                        size={17}
                        strokeWidth={3}
                      />

                    </div>

                  </div>

                  <div className="flex-1">

                    <p className="text-[10px] font-bold uppercase tracking-widest text-green-600">
                      Added to cart
                    </p>

                    <h3 className="mt-1 text-sm font-bold text-gray-900">
                      Product added successfully
                    </h3>

                  </div>

                  <button
                    onClick={() =>
                      closeNotification(
                        notification.id
                      )
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  >

                    <X size={15} />

                  </button>

                </div>

                {/* PRODUCT */}

                <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">

                    {notification.image ||
                    notification.images?.[0] ? (
                      <img
                        src={getImageUrl(
                          notification.image ||
                            notification.images?.[0]
                        )}
                        alt={
                          notification.name ||
                          "Product"
                        }
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <ShoppingCart
                        size={20}
                        className="text-gray-300"
                      />
                    )}

                  </div>

                  <div className="min-w-0 flex-1">

                    <h4 className="truncate text-sm font-bold text-gray-900">
                      {
                        notification.name
                      }
                    </h4>

                    <p className="mt-1 text-xs text-gray-500">
                      {
                        notification.category
                      }
                    </p>

                    <div className="mt-1 flex items-center gap-2">

                      <span className="text-sm font-bold text-gray-900">
                        PKR{" "}
                        {Number(
                          notification.price ||
                            0
                        ).toLocaleString()}
                      </span>

                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                        Qty{" "}
                        {
                          notification.quantity
                        }
                      </span>

                    </div>

                  </div>

                </div>

                {/* NOTIFICATION BUTTONS */}

                <div className="mt-3 flex gap-2">

                  <button
                    onClick={() =>
                      closeNotification(
                        notification.id
                      )
                    }
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
                  >
                    Continue Shopping
                  </button>

                  <button
                    onClick={() => {
                      closeNotification(
                        notification.id
                      );

                      navigate("/cart");
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-orange-500"
                  >

                    <ShoppingCart
                      size={14}
                    />

                    View Cart

                    <ArrowRight
                      size={13}
                    />

                  </button>

                </div>

              </div>

              {/* PROGRESS BAR */}

              <div className="h-1 w-full bg-gray-100">

                <div
                  className="h-full origin-left bg-green-500"
                  style={{
                    animation:
                      "cartProgress 4s linear forwards",
                  }}
                />

              </div>

            </div>
          )
        )}

      </div>

      {/* =================================================
          PRODUCT GRID
      ================================================= */}

      <div className="mt-3 mb-5 grid grid-cols-2 gap-4 px-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:pl-12 xl:pr-8">

        {filteredProducts.map(
          (product) => {

            const productId =
              product._id ||
              product.id;

            const image =
              product.image ||
              product.images?.[0] ||
              "";

            const isClicked =
              clickedProduct ===
              productId;

            const rating = Math.min(
              5,
              Math.max(
                0,
                Number(
                  product.rating || 5
                )
              )
            );

            const stock = Number(
              product.stock || 0
            );

            return (
              <div
                key={productId}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >

                {/* =================================================
                    PRODUCT IMAGE
                ================================================= */}

                <div className="relative m-2 h-40 overflow-hidden rounded-xl bg-gray-50">

                  {/* DISCOUNT */}

                  <span className="absolute left-0 top-0 z-20 rounded-br-xl rounded-tl-xl bg-red-500 px-2.5 py-1.5 text-[10px] font-black text-white shadow">
                    {product.discount ||
                      "SALE"}
                  </span>

                  {/* WISHLIST */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleWishlist(
                        productId
                      )
                    }
                    className="absolute right-2 top-2 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
                  >

                    <Heart
                      size={15}
                      className={
                        wishlist.includes(
                          productId
                        )
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }
                    />

                  </button>

                  {/* IMAGE */}

                  {image ? (
                    <img
                      src={getImageUrl(image)}
                      alt={
                        product.name ||
                        "Product"
                      }
                      className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingCart
                        size={30}
                        className="text-gray-300"
                      />
                    </div>
                  )}

                  {/* =================================================
                      QUICK VIEW
                  ================================================= */}

                  <div className="absolute inset-0 z-10 flex flex-col justify-end  from-black/75 via-black/20 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100">

                    <div className="translate-y-5 p-3 transition-transform duration-300 group-hover:translate-y-0">

                      {/* RATING */}

                      <div className="mb-2 flex items-center gap-1">

                        <div className="flex">

                          {[1, 2, 3, 4, 5].map(
                            (star) => (
                              <Star
                                key={star}
                                size={11}
                                className={
                                  star <=
                                  rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-400"
                                }
                              />
                            )
                          )}

                        </div>

                        <span className="text-[10px] font-bold text-white">
                          {rating.toFixed(1)}
                        </span>

                        <span className="text-[9px] text-gray-300">
                          (
                          {product.reviews ||
                            0}
                          )
                        </span>

                      </div>

                      {/* VIEW DETAILS */}

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/product/${productId}`
                          )
                        }
                        className="flex h-8 w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-[9px] font-black text-gray-900 shadow-lg transition hover:bg-orange-500 hover:text-white"
                      >

                        <Eye size={14} />

                        VIEW DETAILS

                        <ArrowRight
                          size={12}
                        />

                      </button>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    PRODUCT INFORMATION
                ================================================= */}

                <div className="flex flex-1 flex-col px-3 pb-2">

                  {/* CATEGORY */}

                  <p className="mb-1 text-[8px] font-medium uppercase tracking-wide text-gray-400">
                    {product.category ||
                      "Product"}
                  </p>

                  {/* NAME */}

                  <h3 className="truncate text-[12px] font-bold text-gray-900">
                    {product.name ||
                      "Unnamed Product"}
                  </h3>

                  {/* RATING */}

                  <div className="mt-1 flex items-center gap-1">

                    <div className="flex">

                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <Star
                            key={star}
                            size={10}
                            className={
                              star <=
                              rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        )
                      )}

                    </div>

                    <span className="text-[9px] font-semibold text-gray-500">
                      {rating.toFixed(1)}
                    </span>

                    <span className="text-[8px] text-gray-400">
                      (
                      {product.reviews ||
                        0}
                      )
                    </span>

                  </div>

                  {/* PRICE */}

                  <div className="mt-1.5 flex items-center gap-1.5">

                    <span className="text-[10px] font-black text-gray-900">
                      PKR{" "}
                      {Number(
                        product.price || 0
                      ).toLocaleString()}
                    </span>

                    {product.oldPrice && (
                      <span className="text-[8px] text-gray-400 line-through">
                        PKR{" "}
                        {Number(
                          product.oldPrice
                        ).toLocaleString()}
                      </span>
                    )}

                  </div>

                  {/* STOCK */}

                  {stock > 0 && (
                    <p className="mt-1 text-[8px] font-semibold text-green-600">
                      {stock} in stock
                    </p>
                  )}

                  {/* ADD TO CART */}

                  <div className="mt-auto pt-2">

                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart(
                          product
                        )
                      }
                      disabled={
                        stock === 0
                      }
                      className={`flex w-full items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[9px] font-black text-white transition-all duration-300 ${
                        stock === 0
                          ? "cursor-not-allowed bg-gray-400"
                          : isClicked
                          ? "scale-[0.98] bg-green-500"
                          : "bg-orange-500 hover:scale-[1.02] hover:bg-orange-600"
                      }`}
                    >

                      {stock === 0 ? (
                        "OUT OF STOCK"
                      ) : isClicked ? (
                        <>
                          <Check
                            size={12}
                            strokeWidth={3}
                          />

                          ADDED
                        </>
                      ) : (
                        <>
                          <ShoppingCart
                            size={12}
                          />

                          ADD TO CART
                        </>
                      )}

                    </button>

                  </div>

                </div>

              </div>
            );
          }
        )}

      </div>

      {/* =================================================
          NO PRODUCTS
      ================================================= */}

      {filteredProducts.length ===
        0 && (
        <div className="py-10 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">

            <ShoppingCart
              size={25}
              className="text-gray-400"
            />

          </div>

          <h2 className="mt-4 text-xl font-bold text-gray-700">
            No Product Found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Try another search or category.
          </p>

        </div>
      )}

      {/* =================================================
          ANIMATIONS
      ================================================= */}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes cartProgress {
          from {
            transform: scaleX(1);
          }

          to {
            transform: scaleX(0);
          }
        }
      `}</style>

    </section>
  );
}

export default ProductCard;