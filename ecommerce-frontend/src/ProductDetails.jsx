import { useState } from "react";
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

const products = [
  {
    id: 1,
    name: "Smart Watch Series 7",
    category: "Electronics",
    price: "PKR 24,999",
    oldPrice: "PKR 31,999",
    discount: "-20%",
    rating: 4.8,
    reviews: 124,
    stock: "In Stock",
    description:
      "Premium smart watch with fitness tracking, heart-rate monitoring, notifications and a beautiful AMOLED display. Designed for everyday performance, fitness and modern lifestyle.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQHQB5xUdDL-l9mxXxlbp87e58TBP0VRohhOuAlU4X9Q&s=10",
  },

  {
    id: 2,
    name: "Men Casual T-Shirt",
    category: "Fashion",
    price: "PKR 2,249",
    oldPrice: "PKR 2,499",
    discount: "-10%",
    rating: 4.6,
    reviews: 89,
    stock: "In Stock",
    description:
      "Comfortable premium cotton casual t-shirt with a modern fit. Perfect for everyday wear and casual occasions.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJGr0Mhxvj7HqMZTjXlw8_TUS8WawtBQLym2NyiEwYUA&s=10",
  },

  {
    id: 3,
    name: "English Willow Bat",
    category: "Sports",
    price: "PKR 58,499",
    oldPrice: "PKR 99,999",
    discount: "-15%",
    rating: 4.9,
    reviews: 76,
    stock: "In Stock",
    description:
      "Professional English Willow cricket bat designed for excellent power, balance and performance. Perfectly balanced for professional and competitive players.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2f54_okVCTZp2vH2th_leb8PhsMeF9DgBZ2xusPjXvg&s=10",
  },

  {
    id: 4,
    name: "Kitchen Appliances Set",
    category: "Home & Kitchen",
    price: "PKR 12,999",
    oldPrice: "PKR 17,499",
    discount: "-25%",
    rating: 4.7,
    reviews: 63,
    stock: "In Stock",
    description:
      "Complete kitchen appliance set with modern design, durable construction and convenient features for your everyday kitchen needs.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQOmVm0_J5ffFOSd2rK8uDsC1dXulrGpqwQyO3N_DYMg&s=10",
  },

  {
    id: 5,
    name: "Nike Air Max 270",
    category: "Shoes",
    price: "PKR 24,199",
    oldPrice: "PKR 35,999",
    discount: "-30%",
    rating: 4.8,
    reviews: 215,
    stock: "In Stock",
    description:
      "Stylish and comfortable sports shoes featuring responsive cushioning and a modern athletic design. Perfect for sports, walking and everyday use.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCYAAO0RuSAWHCbQaX2pVBwmJX-FuDyhxP3QtV5M4DVQ&s=10",
  },

  {
    id: 6,
    name: "Iphone 16 Pro Max",
    category: "Phones",
    price: "PKR 99,499",
    oldPrice: "PKR 112,999",
    discount: "-12%",
    rating: 4.9,
    reviews: 342,
    stock: "In Stock",
    description:
      "Flagship smartphone featuring a powerful processor, premium camera system and stunning display. Built for high performance and an exceptional mobile experience.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROpLB32gV9-aHQiSvGtprFFXNqt_XcK_1bT4JB-5KMfA&s=10",
  },

  {
    id: 7,
    name: "Premium Logo Cap",
    category: "Accessories",
    price: "PKR 1,999",
    oldPrice: "PKR 2,500",
    discount: "-12%",
    rating: 4.5,
    reviews: 48,
    stock: "In Stock",
    description:
      "Premium quality logo cap with comfortable fitting and stylish design for everyday use.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT77Gwg4kdQiOyueNTc4emEu4E4jYeHg-VFCQEZ_djI8A&s",
  },

  {
    id: 8,
    name: "Dell OptiPlex Core i5",
    category: "Computer",
    price: "PKR 85,000",
    oldPrice: "PKR 90,000",
    discount: "-10%",
    rating: 4.6,
    reviews: 91,
    stock: "In Stock",
    description:
      "Reliable Dell desktop computer powered by Intel Core i5, ideal for office work, business and everyday computing.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmyoqfUJ7yV1n9LxSSThnXsi9AUR2JHLfeXdWvkVaizg&s=10",
  },

  {
    id: 9,
    name: "Oud Wood",
    category: "Beauty",
    price: "PKR 75,000",
    oldPrice: "PKR 82,500",
    discount: "-14%",
    rating: 4.9,
    reviews: 157,
    stock: "In Stock",
    description:
      "Luxurious oud fragrance with a rich and long-lasting scent designed for a sophisticated and elegant experience.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPzdUq88ZsYzgoDDSPI-YVuLlGiHLCIDtRE7i5cSR0vg&s=10",
  },

  {
    id: 10,
    name: "BMW Remote Control Car",
    category: "Toys",
    price: "PKR 8,000",
    oldPrice: "PKR 9,250",
    discount: "-14%",
    rating: 4.7,
    reviews: 72,
    stock: "In Stock",
    description:
      "Realistic BMW remote control car with smooth controls, stylish design and an exciting driving experience.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROLDhyd4h-qd7lZWwyiSu3EnaYjXjxeZmPNw3fUDuPkQ&s=10",
  },

  {
    id: 11,
    name: "Premium Travel Bag",
    category: "Bags",
    price: "PKR 18,000",
    oldPrice: "PKR 19,500",
    discount: "-15%",
    rating: 4.6,
    reviews: 54,
    stock: "In Stock",
    description:
      "Premium travel bag with spacious compartments, durable material and a stylish modern look.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRen09Tnx9RI1qQnUZn8ql2s3LlcFor4b_p-Yzgxl-fOw&s=10",
  },

  {
    id: 12,
    name: "Apple AirPods 4",
    category: "Electronics",
    price: "PKR 45,000",
    oldPrice: "PKR 55,000",
    discount: "-12%",
    rating: 4.8,
    reviews: 267,
    stock: "In Stock",
    description:
      "Wireless earbuds with excellent sound quality, comfortable fit, clear calls and a compact charging case.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzkwuPkmcHtkthJZSTSmVcSGnMpnFDCGsIC9jZ1pH7OA&s=10",
  },
];

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = products.find(
    (item) => item.id === Number(id)
  );

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
            The product you are looking for does not exist.
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
  // PRODUCT IMAGES
  // =====================================================

  const productImages =
    product.images && product.images.length > 0
      ? product.images.slice(0, 4)
      : [
          product.image,
          product.image,
          product.image,
          product.image,
        ];

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
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
    navigate(`/product/${product.id}/reviews`);
  };

  return (
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

          <span>{product.category}</span>

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
                {product.discount}
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
 
               <img
               src={productImages[selectedImage]}
               alt={product.name}
               className="
               h-64 w-64
               object-contain
               transition-all
               duration-700
               ease-out
               group-hover:scale-125
               group-hover:rotate-1
               "
               />

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
                        src={image}
                        alt={`${product.name} ${
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
                  {product.category}
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
                          Math.round(
                            product.rating
                          )
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    )
                  )}

                </div>

                {/* Rating Number */}

                <span className="text-xs font-bold text-gray-900">
                  {product.rating}
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

                  {product.reviews} Reviews

                </button>

              </div>

              {/* =================================================
                  PRICE
              ================================================= */}

              <div className="mt-2 flex flex-wrap items-center gap-2">

                <span className="text-[20px] font-bold text-gray-900">
                  {product.price}
                </span>

                <span className="text-sm text-gray-400 line-through">
                  {product.oldPrice}
                </span>

                <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold text-green-700">
                  Save {product.discount}
                </span>

              </div>

              {/* =================================================
                  STOCK
              ================================================= */}

              <div className="mt-2 flex items-center gap-2">

                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                <span className="text-xs font-semibold text-green-600">
                  {product.stock}
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
                  {product.description}
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
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
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
                  className="cursor-pointer rounded-lg bg-gray-900 px-4 py-3 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-black"
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
            Reviews content yahan nahi hai.
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
  );
}

export default ProductDetails;