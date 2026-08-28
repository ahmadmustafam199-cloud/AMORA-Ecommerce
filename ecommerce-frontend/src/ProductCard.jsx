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
import { featuredProducts } from "./productsimage";

function ProductCard({
  search = "",
  selectedCategory = "",
}) {
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [clickedProduct, setClickedProduct] = useState("");
  const [wishlist, setWishlist] = useState([]);

  const notificationId = useRef(0);

  // ==========================================
  // AUTO REMOVE CART NOTIFICATION
  // ==========================================
  useEffect(() => {
    if (notifications.length === 0) return;

    const timers = notifications.map((notification) =>
      setTimeout(() => {
        setNotifications((previous) =>
          previous.filter(
            (item) => item.id !== notification.id
          )
        );
      }, 4000)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [notifications]);

  // ==========================================
  // ADD TO CART
  // ==========================================
  const handleAddToCart = (product) => {
    const existingProduct = cart.find(
      (item) => item.name === product.name
    );

    const newQuantity = existingProduct
      ? existingProduct.quantity + 1
      : 1;

    addToCart(product);

    setClickedProduct(product.name);

    setTimeout(() => {
      setClickedProduct("");
    }, 700);

    notificationId.current += 1;

    const newNotification = {
      ...product,
      quantity: newQuantity,
      id: notificationId.current,
    };

    setNotifications((previous) =>
      [newNotification, ...previous].slice(0, 3)
    );
  };

  // ==========================================
  // CLOSE NOTIFICATION
  // ==========================================
  const closeNotification = (id) => {
    setNotifications((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  // ==========================================
  // WISHLIST
  // ==========================================
  const toggleWishlist = (productId) => {
    setWishlist((previous) =>
      previous.includes(productId)
        ? previous.filter((id) => id !== productId)
        : [...previous, productId]
    );
  };

  // ==========================================
  // SEARCH + CATEGORY FILTER
  // ==========================================
  const searchText = (search || "")
    .toLowerCase()
    .trim();

  const selectedCategoryText = (selectedCategory || "")
    .toLowerCase()
    .trim();

  const filteredProducts = featuredProducts.filter(
    (product) => {
      const name = (product.name || "").toLowerCase();
      const category = (product.category || "").toLowerCase();

      // Search filter
      const matchesSearch =
        searchText === "" ||
        name.includes(searchText) ||
        category.includes(searchText);

      // All Categories filter
      const matchesCategory =
        selectedCategoryText === "" ||
        category === selectedCategoryText;

      // Product tabhi show hoga jab
      // dono filters match karein
      return matchesSearch && matchesCategory;
    }
  );

  return (
    <section className="relative">

      {/* ==========================================
          CART NOTIFICATIONS
      ========================================== */}

      <div className="fixed right-4 top-4 z-50 flex w-96 max-w-[95vw] flex-col gap-3">

        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-white
              shadow-2xl
              animate-[slideIn_0.45s_ease-out]
            "
          >
            <div className="p-4">

              {/* Notification Header */}
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
                    closeNotification(notification.id)
                  }
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    text-gray-400
                    transition
                    hover:rotate-90
                    hover:bg-gray-100
                    hover:text-gray-700
                  "
                >
                  <X size={15} />
                </button>

              </div>

              {/* Product Preview */}
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">

                  <img
                    src={notification.image}
                    alt={notification.name}
                    className="h-full w-full object-contain"
                  />

                </div>

                <div className="min-w-0 flex-1">

                  <h4 className="truncate text-sm font-bold text-gray-900">
                    {notification.name}
                  </h4>

                  <p className="mt-1 text-xs text-gray-500">
                    {notification.category}
                  </p>

                  <div className="mt-1 flex items-center gap-2">

                    <span className="text-sm font-bold text-gray-900">
                      {notification.price}
                    </span>

                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                      Qty {notification.quantity}
                    </span>

                  </div>

                </div>

              </div>

              {/* Notification Buttons */}
              <div className="mt-3 flex gap-2">

                <button
                  onClick={() =>
                    closeNotification(notification.id)
                  }
                  className="
                    flex-1
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-3
                    py-2.5
                    text-xs
                    font-bold
                    text-gray-700
                    transition
                    hover:bg-gray-50
                  "
                >
                  Continue Shopping
                </button>

                <button
                  onClick={() => {
                    closeNotification(notification.id);
                    navigate("/cart");
                  }}
                  className="
                    flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gray-900
                    px-3
                    py-2.5
                    text-xs
                    font-bold
                    text-white
                    transition
                    hover:bg-orange-500
                  "
                >
                  <ShoppingCart size={14} />
                  View Cart
                  <ArrowRight size={13} />
                </button>

              </div>

            </div>

            {/* Progress Bar */}
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
        ))}

      </div>

      {/* ==========================================
          PRODUCTS
      ========================================== */}

      <div
        className="
          mt-3
          mb-5
          grid
          grid-cols-2
          gap-4
          px-4
          sm:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-6
          xl:pl-12
          xl:pr-8
        "
      >

        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="
              group
              relative
              flex
              h-full
              flex-col
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-2xl
            "
          >

            {/* ==========================================
                PRODUCT IMAGE
            ========================================== */}

            <div className="relative m-2 h-40 overflow-hidden rounded-xl bg-gray-50">

              {/* Discount */}
              <span className="absolute left-0 top-0 z-20 rounded-br-xl rounded-tl-xl bg-red-500 px-2.5 py-1.5 text-[10px] font-black text-white shadow">
                {product.discount}
              </span>

              {/* Wishlist */}
              <button
                onClick={() =>
                  toggleWishlist(product.id)
                }
                className="
                  absolute
                  right-2
                  top-2
                  z-30
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-white/95
                  shadow-md
                  transition
                  hover:scale-110
                "
              >
                <Heart
                  size={15}
                  className={
                    wishlist.includes(product.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600"
                  }
                />
              </button>

              {/* Image */}
              <img
                src={product.image}
                alt={product.name}
                className="
                  h-full
                  w-full
                  object-contain
                  transition-transform
                  duration-700
                  group-hover:scale-110
                "
              />

              {/* Quick View */}
              <div
                className="
                  absolute
                  inset-0
                  z-10
                  flex
                  flex-col
                  justify-end
                  from-black/75
                  via-black/20
                  to-transparent
                  opacity-0
                  transition-all
                  duration-300
                  group-hover:opacity-100
                "
              >

                <div
                  className="
                    translate-y-5
                    p-3
                    transition-transform
                    duration-300
                    group-hover:translate-y-0
                  "
                >

                  {/* Rating */}
                  <div className="mb-2 flex items-center gap-1">

                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <Star
                            key={star}
                            size={11}
                            className="fill-yellow-400 text-yellow-400"
                          />
                        )
                      )}
                    </div>

                    <span className="text-[10px] font-bold text-white">
                      {product.rating}
                    </span>

                    <span className="text-[9px] text-gray-300">
                      ({product.reviews})
                    </span>

                  </div>

                  {/* View Details */}
                  <button
                    onClick={() =>
                      navigate(
                        `/product/${product.id}`
                      )
                    }
                    className="
                      flex
                      h-8
                      w-full
                      cursor-pointer
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      bg-white
                      px-3
                      py-2
                      text-[9px]
                      font-black
                      text-gray-900
                      shadow-lg
                      transition
                      hover:bg-orange-500
                      hover:text-white
                    "
                  >
                    <Eye size={14} />
                    VIEW DETAILS
                    <ArrowRight size={12} />
                  </button>

                </div>

              </div>

            </div>

            {/* ==========================================
                PRODUCT INFORMATION
            ========================================== */}

            <div className="flex flex-1 flex-col px-3 pb-2">

              {/* Category */}
              <p
                className="
                  mb-1
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-wide
                  text-gray-400
                "
              >
                {product.category}
              </p>

              {/* Name */}
              <h3
                className="
                  truncate
                  text-[12px]
                  font-bold
                  text-gray-900
                "
              >
                {product.name}
              </h3>

              {/* Rating */}
              <div className="mt-1 flex items-center gap-1">

                <div className="flex">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <Star
                        key={star}
                        size={10}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    )
                  )}
                </div>

                <span className="text-[9px] font-semibold text-gray-500">
                  {product.rating}
                </span>

                <span className="text-[8px] text-gray-400">
                  ({product.reviews})
                </span>

              </div>

              {/* Price */}
              <div className="mt-1.5 flex items-center gap-1.5">

                <span className="text-[10px] font-black text-gray-900">
                  {product.price}
                </span>

                <span className="text-[8px] text-gray-400 line-through">
                  {product.oldPrice}
                </span>

              </div>

              {/* Add To Cart */}
              <div className="mt-auto pt-2">

                <button
                  onClick={() =>
                    handleAddToCart(product)
                  }
                  className={`
                    flex
                    w-full
                    cursor-pointer
                    items-center
                    justify-center
                    gap-1.5
                    rounded-lg
                    px-2
                    py-2
                    text-[9px]
                    font-black
                    text-white
                    transition-all
                    duration-300
                    ${
                      clickedProduct === product.name
                        ? "scale-[0.98] bg-green-500"
                        : "bg-orange-500 hover:scale-[1.02] hover:bg-orange-600"
                    }
                  `}
                >

                  {clickedProduct === product.name ? (
                    <>
                      <Check
                        size={12}
                        strokeWidth={3}
                      />
                      ADDED
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={12} />
                      ADD TO CART
                    </>
                  )}

                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* ==========================================
          NO PRODUCT FOUND
      ========================================== */}

      {filteredProducts.length === 0 && (
        <div className="py-10 text-center">

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-gray-100
            "
          >
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

      {/* ==========================================
          ANIMATIONS
      ========================================== */}

      <style>{`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(100%);
          }

          100% {
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