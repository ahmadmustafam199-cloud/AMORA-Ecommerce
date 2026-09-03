import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Check,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Package,
  MessageSquare,
} from "lucide-react";

import { useCart } from "./useCart";
import SEO from "./SEO";

// =====================================================
// DEPLOYED BACKEND URL
// =====================================================

const API_URL = "https://amora-backend-lake.vercel.app";

// =====================================================
// SEO SITE URL
// IMPORTANT:
// Replace YOUR-DOMAIN.com with your real domain later.
// =====================================================

const SITE_URL = "https://YOUR-DOMAIN.com";

// =====================================================
// IMAGE URL HELPER
// =====================================================

const getImageUrl = (image) => {
  if (!image || typeof image !== "string") {
    return "";
  }

  const cleanImage = image.trim();

  if (!cleanImage) {
    return "";
  }

  if (
    cleanImage.startsWith("http://") ||
    cleanImage.startsWith("https://")
  ) {
    return cleanImage;
  }

  if (cleanImage.startsWith("/")) {
    return `${API_URL}${cleanImage}`;
  }

  return `${API_URL}/${cleanImage}`;
};

// =====================================================
// PRODUCT DETAILS
// =====================================================

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(id));
  const [apiError, setApiError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // =====================================================
  // FETCH SINGLE PRODUCT FROM BACKEND
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setApiError("");

        const response = await fetch(
          `${API_URL}/api/products/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Product not found"
          );
        }

        const fetchedProduct =
          data.product ||
          data.data ||
          data;

        if (cancelled) return;

        setProduct(fetchedProduct);
      } catch (error) {
        console.error(
          "Product Details Error:",
          error
        );

        if (cancelled) return;

        setProduct(null);
        setApiError(
          "The product could not be loaded."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchProduct();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

          <p className="mt-4 text-sm font-semibold text-gray-500">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PRODUCT NOT FOUND
  // =====================================================

  if (!product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <Package
            size={50}
            className="mx-auto text-gray-300"
          />

          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="mt-2 text-xs text-gray-500">
            {apiError ||
              "The product you are looking for does not exist."}
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-5 rounded-lg bg-orange-500 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-orange-600"
          >
            Back To Home
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // PRODUCT DATA
  // =====================================================

  const productId =
    product._id || product.id;

  const productName =
    product.name || "Product";

  const productDescription =
    product.description ||
    `Shop ${productName} at AMORA. Discover quality products, modern style and a seamless online shopping experience.`;

  const productCategory =
    product.category || "Product";

  const productPrice =
    Number(product.price || 0);

  // =====================================================
  // FIXED RATING
  // =====================================================

  const rating =
    Number(product.rating || 0);

  const stockNumber =
    Number(product.stock || 0);

  const productImages =
    Array.isArray(product.images) &&
    product.images.length > 0
      ? product.images.slice(0, 4)
      : product.image
      ? [
          product.image,
          product.image,
          product.image,
          product.image,
        ]
      : [];

  const currentImage =
    productImages[selectedImage] ||
    productImages[0] ||
    "";

  const seoImage =
    getImageUrl(productImages[0]);

  // =====================================================
  // SEO DATA
  // =====================================================

  const seoTitle =
    `${productName} | AMORA – Elegance & Style`;

  const seoDescription =
    productDescription.length > 155
      ? `${productDescription.substring(0, 152)}...`
      : productDescription;

  const seoUrl =
    `/product/${productId}`;

  // =====================================================
  // PRODUCT STRUCTURED DATA
  // =====================================================

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",

    name: productName,

    description: productDescription,

    category: productCategory,

    ...(seoImage
      ? {
          image: [seoImage],
        }
      : {}),

    brand: {
      "@type": "Brand",
      name: "AMORA",
    },

    offers: {
      "@type": "Offer",

      url: `${SITE_URL}${seoUrl}`,

      priceCurrency: "PKR",

      price: productPrice,

      availability:
        stockNumber > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",

      seller: {
        "@type": "Organization",
        name: "AMORA – Elegance & Style",
      },
    },
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = () => {
    const cartProduct = {
      ...product,
      image:
        product.image ||
        (Array.isArray(product.images)
          ? product.images[0] || ""
          : ""),
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct);
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  // =====================================================
  // BUY NOW
  // =====================================================

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  // =====================================================
  // OPEN REVIEWS
  // =====================================================

  const handleReviews = () => {
    navigate(
      `/product/${productId}/reviews`
    );
  };

  return (
    <>
      {/* =================================================
          PRODUCT SEO
      ================================================= */}

      <SEO
        title={seoTitle}
        description={seoDescription}
        image={seoImage}
        url={seoUrl}
      />

      {/* =================================================
          PRODUCT STRUCTURED DATA
      ================================================= */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      <div className="w-full bg-gray-50">
        <div className="px-4 py-6 md:px-7 lg:px-10">

          {/* =================================================
              BREADCRUMB
          ================================================= */}

          <div className="flex items-center gap-2 text-xs text-gray-500">

            <button
              onClick={() => navigate("/")}
              className="cursor-pointer transition hover:text-orange-500"
            >
              Home
            </button>

            <ChevronRight size={13} />

            <span>
              {product.category || "Product"}
            </span>

            <ChevronRight size={13} />

            <span className="truncate font-medium text-gray-800">
              {product.name}
            </span>

          </div>

          {/* =================================================
              PRODUCT CARD
          ================================================= */}

          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">

            <div className="grid grid-cols-1 lg:grid-cols-2">

              {/* =================================================
                  LEFT SIDE
              ================================================= */}

              <div className="relative bg-gray-50 p-5">

                {/* Discount */}

                <div className="absolute left-5 top-5 z-20 rounded-full bg-red-500 px-3 py-1.5 text-[10px] font-bold text-white shadow-md">
                  {product.discount || "SALE"}
                </div>

                {/* Wishlist */}

                <button
                  onClick={() =>
                    setWishlist(!wishlist)
                  }
                  className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:scale-105"
                >
                  <Heart
                    size={18}
                    className={
                      wishlist
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }
                  />
                </button>

                {/* Main Image */}

                <div className="group flex h-80 items-center justify-center overflow-hidden rounded-2xl bg-white">

                  {getImageUrl(currentImage) ? (
                    <img
                      src={getImageUrl(currentImage)}
                      alt={`${productName} - AMORA`}
                      className="
                      h-64 w-64
                      object-contain
                      transition-all
                      duration-700
                      ease-out
                      group-hover:scale-125
                      group-hover:rotate-1
                      "
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <ShoppingCart
                      size={50}
                      className="text-gray-300"
                    />
                  )}

                </div>

                {/* Thumbnails */}

                <div className="mt-3 grid grid-cols-4 gap-2">

                  {productImages.map(
                    (image, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          setSelectedImage(index)
                        }
                        className={`flex h-16 items-center justify-center overflow-hidden rounded-lg border bg-white transition-all duration-200 ${
                          selectedImage === index
                            ? "border-orange-500 ring-2 ring-orange-100"
                            : "border-gray-200 hover:border-orange-300"
                        }`}
                      >

                        <img
                          src={getImageUrl(image)}
                          alt={`${productName} image ${
                            index + 1
                          }`}
                          className="h-12 w-12 object-contain"
                        />

                      </button>
                    )
                  )}

                </div>

              </div>

              {/* =================================================
                  RIGHT SIDE
              ================================================= */}

              <div className="p-6">

                {/* Category */}

                <div className="flex items-center gap-2">

                  <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-600">
                    {product.category ||
                      "Product"}
                  </span>

                  <span className="text-[10px] text-gray-400">
                    Premium Product
                  </span>

                </div>

                {/* Product Name */}

                <h1 className="mt-2 text-[18px] font-bold leading-tight text-gray-900">
                  {product.name}
                </h1>

                {/* =================================================
                    RATING + REVIEWS
                ================================================= */}

                <div className="mt-2 flex flex-wrap items-center gap-3">

                  {/* Stars */}

                  <div className="flex items-center gap-0.5">

                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <Star
                          key={star}
                          size={15}
                          className={
                            star <=
                            Math.round(rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      )
                    )}

                  </div>

                  {/* Rating Number */}

                  <span className="text-xs font-bold text-gray-900">
                    {rating.toFixed(1)}
                  </span>

                  <span className="text-gray-300">
                    |
                  </span>

                  {/* See Reviews */}

                  <button
                    onClick={handleReviews}
                    className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-orange-500 transition hover:text-orange-600 hover:underline"
                  >
                    <MessageSquare size={13} />

                    {product.reviews || 0} Reviews

                  </button>

                </div>

                {/* =================================================
                    PRICE
                ================================================= */}

                <div className="mt-2 flex flex-wrap items-center gap-2">

                  <span className="text-[20px] font-bold text-gray-900">
                    PKR{" "}
                    {Number(
                      product.price || 0
                    ).toLocaleString()}
                  </span>

                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      PKR{" "}
                      {Number(
                        product.oldPrice
                      ).toLocaleString()}
                    </span>
                  )}

                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold text-green-700">
                    Save {product.discount || "SALE"}
                  </span>

                </div>

                {/* =================================================
                    STOCK
                ================================================= */}

                <div className="mt-2 flex items-center gap-2">

                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      stockNumber > 0
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />

                  <span
                    className={`text-xs font-semibold ${
                      stockNumber > 0
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {stockNumber > 0
                      ? `${stockNumber} In Stock`
                      : "Out of Stock"}
                  </span>

                </div>

                <div className="mt-2 h-px bg-gray-100" />

                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <div>

                  <h2 className="text-sm font-bold text-gray-900">
                    Product Description
                  </h2>

                  <p className="mt-1 text-[13px] leading-5 text-gray-600">
                    {product.description ||
                      "Premium quality product designed for everyday use."}
                  </p>

                </div>

                {/* =================================================
                    QUANTITY
                ================================================= */}

                <div className="mt-4">

                  <p className="mb-1.5 text-xs font-bold text-gray-900">
                    Quantity
                  </p>

                  <div className="flex w-fit items-center overflow-hidden rounded-lg border border-gray-200 bg-white">

                    <button
                      onClick={() =>
                        setQuantity(
                          Math.max(
                            1,
                            quantity - 1
                          )
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="flex h-9 w-10 items-center justify-center border-x border-gray-200 text-xs font-bold">
                      {quantity}
                    </span>

                    <button
                      onClick={() =>
                        setQuantity(
                          quantity + 1
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100"
                    >
                      <Plus size={14} />
                    </button>

                  </div>

                </div>

                {/* =================================================
                    BUTTONS
                ================================================= */}

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">

                  {/* Add To Cart */}

                  <button
                    onClick={handleAddToCart}
                    disabled={stockNumber === 0}
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-bold text-white shadow-md transition-all ${
                      stockNumber === 0
                        ? "cursor-not-allowed bg-gray-400"
                        : "bg-orange-500 shadow-orange-500/20 hover:-translate-y-0.5 hover:bg-orange-600"
                    }`}
                  >

                    {added ? (
                      <>
                        <Check size={16} />
                        Added To Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} />
                        Add To Cart
                      </>
                    )}

                  </button>

                  {/* Buy Now */}

                  <button
                    onClick={handleBuyNow}
                    disabled={stockNumber === 0}
                    className={`cursor-pointer rounded-lg px-4 py-3 text-xs font-bold text-white transition-all ${
                      stockNumber === 0
                        ? "cursor-not-allowed bg-gray-400"
                        : "bg-gray-900 hover:-translate-y-0.5 hover:bg-black"
                    }`}
                  >
                    Buy Now
                  </button>

                </div>

                {/* =================================================
                    FEATURES
                ================================================= */}

                <div className="mt-5 grid grid-cols-1 gap-3 border-t border-gray-100 pt-5 sm:grid-cols-3">

                  {/* Delivery */}

                  <div className="flex items-center gap-2">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                      <Truck size={17} />
                    </div>

                    <div>

                      <p className="text-[11px] font-bold text-gray-900">
                        Fast Delivery
                      </p>

                      <p className="mt-0.5 text-[9px] text-gray-500">
                        Quick & safe shipping
                      </p>

                    </div>

                  </div>

                  {/* Payment */}

                  <div className="flex items-center gap-2">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                      <ShieldCheck size={17} />
                    </div>

                    <div>

                      <p className="text-[11px] font-bold text-gray-900">
                        Secure Payment
                      </p>

                      <p className="mt-0.5 text-[9px] text-gray-500">
                        100% secure checkout
                      </p>

                    </div>

                  </div>

                  {/* Returns */}

                  <div className="flex items-center gap-2">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <RotateCcw size={17} />
                    </div>

                    <div>

                      <p className="text-[11px] font-bold text-gray-900">
                        Easy Returns
                      </p>

                      <p className="mt-0.5 text-[9px] text-gray-500">
                        Hassle-free returns
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              SEPARATE REVIEWS CTA
          ================================================= */}

          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">

            <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-6">

              {/* Left */}

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <MessageSquare size={22} />
                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
                    Customer Feedback
                  </p>

                  <h2 className="mt-1 text-base font-bold text-gray-900">
                    What are customers saying?
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Read reviews or share your own experience.
                  </p>

                </div>

              </div>

              {/* Right */}

              <button
                onClick={handleReviews}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-black"
              >
                <MessageSquare size={15} />

                See All Reviews

                <ChevronRight size={15} />

              </button>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default ProductDetails;