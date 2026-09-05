import { useState } from "react";

import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  ChevronDown,
  CircleHelp,
  PackageCheck,
  X, // Mobile menu close icon ke liye
} from "lucide-react";

import { Link } from "react-router-dom";
import { useCart } from "./useCart";

function StoreNavbar({
  search = "",
  setSearch = () => {},
  selectedCategory = "",
  setSelectedCategory = () => {},
  showMainNavbar = true,
}) {
  const { cart } = useCart();

  const [showCategories, setShowCategories] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile Menu state

  // Total products quantity in cart
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Categories
  const categories = [
    "Electronics",
    "Shoes",
    "Home & Kitchen",
    "Sports",
    "Clothes",
    "Phones",
    "Accessories",
    "Computer",
    "Beauty",
    "Toys",
    "Bags",
  ];

  return (
    <header className="w-full bg-white">

      {/* ================= TOP BAR ================= */}
      <div className="bg-[#071a3a] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2.5 sm:px-4">

          {/* Free Delivery */}
          <div className="flex min-w-0 items-center gap-2 text-xs sm:pl-2 sm:text-sm">
            <PackageCheck size={17} />
            <span className="truncate">
              Free Delivery on orders over PKR 5000
            </span>
          </div>

          {/* Right Links */}
          <div className="hidden items-center gap-7 pr-8 md:flex">
            <a
              href="#"
              className="flex items-center gap-2 text-sm transition hover:text-orange-400"
            >
              <CircleHelp size={16} />
              Help & Support
            </a>

            <a
              href="#"
              className="flex items-center gap-2 text-sm transition hover:text-orange-400"
            >
              <PackageCheck size={16} />
              Track Order
            </a>

            <button
              type="button"
              className="flex items-center gap-1 text-sm"
            >
              PKR
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN NAVBAR ================= */}
      {showMainNavbar && (
        <>
          <div className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-4 sm:gap-6 sm:px-4 sm:py-5">

              {/* LOGO */}
              <Link to="/" className="flex shrink-0 items-center gap-2 sm:pl-2 lg:pl-5">
                <img
                  className="h-9 w-9 object-contain sm:h-11 sm:w-11"
                  src="/Image/E-3.jfif"
                  alt="AMORA"
                />
                <span className="text-lg font-extrabold tracking-tight sm:text-[20px] text-[#071a3a]">
                  AMORA
                </span>
              </Link>

              {/* ================= DESKTOP SEARCH BAR ================= */}
              <div className="hidden flex-1 md:block">
                <div className="mx-auto flex overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      if (selectedCategory) {
                        setSelectedCategory("");
                      }
                    }}
                    placeholder="Search for products..."
                    className="w-full px-5 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    className="flex w-14 shrink-0 items-center justify-center bg-orange-500 text-white transition hover:bg-orange-600"
                  >
                    <Search size={21} />
                  </button>
                </div>
              </div>

              {/* ================= DESKTOP ACCOUNT / WISHLIST / CART ================= */}
              <div className="hidden items-center gap-5 pr-10 lg:flex">
                <button
                  type="button"
                  className="flex items-center gap-2 text-left"
                >
                  <User
                    size={24}
                    strokeWidth={1.8}
                    className="text-slate-800"
                  />
                  <div>
                    <p className="text-[13px] font-semibold text-slate-800">
                      My Account
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Login / Register
                    </p>
                  </div>
                  <ChevronDown
                    size={13}
                    className="text-slate-500"
                  />
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 text-[14px] font-semibold text-slate-800 transition hover:text-orange-500"
                >
                  <Heart
                    size={20}
                    strokeWidth={1.8}
                  />
                  <span>Wishlist</span>
                </button>

                <Link
                  to="/cart"
                  className="relative flex items-center gap-2 text-sm font-semibold text-slate-800 transition hover:text-orange-500"
                >
                  <ShoppingCart
                    size={22}
                    strokeWidth={1.8}
                  />
                  <span>Cart</span>
                  <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-bold text-white">
                    {cartCount}
                  </span>
                </Link>
              </div>

              {/* ================= MOBILE ACTIONS & HAMBURGER ================= */}
              <div className="flex items-center gap-3 lg:hidden">
                <Link
                  to="/cart"
                  className="relative flex items-center p-2 text-slate-800"
                >
                  <ShoppingCart size={22} />
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="rounded-lg p-2 text-slate-800 hover:bg-slate-100"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>

            </div>

            {/* ================= MOBILE SEARCH ================= */}
            <div className="px-4 pb-4 md:hidden">
              <div className="flex overflow-hidden rounded-xl border border-slate-300">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    if (selectedCategory) {
                      setSelectedCategory("");
                    }
                  }}
                  placeholder="Search for products..."
                  className="w-full px-4 py-3 text-sm outline-none"
                />
                <button
                  type="button"
                  className="bg-orange-500 px-4 text-white"
                >
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* ================= MOBILE MENU DRAWER ================= */}
            {mobileMenuOpen && (
              <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 md:hidden">
                <nav className="flex flex-col gap-3 font-semibold text-slate-800">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 transition hover:text-orange-500"
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 transition hover:text-orange-500"
                  >
                    About
                  </Link>
                  <Link
                    to="/deals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 transition hover:text-orange-500"
                  >
                    Deals
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 transition hover:text-orange-500"
                  >
                    Contact
                  </Link>
                </nav>
              </div>
            )}

          </div>

          {/* ================= NAVIGATION BAR (DESKTOP CATEGORIES & LINKS) ================= */}
          <div className="hidden border-b border-slate-200 bg-white md:block">
            <div className="mx-auto flex max-w-7xl items-center px-3 sm:px-4 lg:pl-12">

              {/* ALL CATEGORIES DROPDOWN */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCategories(!showCategories)}
                  className="flex cursor-pointer items-center gap-2 rounded-b-lg bg-[#071a3a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b2855]"
                >
                  <Menu size={16} />
                  <span className="text-[12px]">All Categories</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      showCategories ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showCategories && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
                    <div className="border-b border-slate-100 bg-slate-50 px-4 py-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Shop By Category
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory("");
                        setSearch("");
                        setShowCategories(false);
                      }}
                      className={`w-full border-b border-slate-100 px-4 py-2 text-left text-sm font-bold transition ${
                        selectedCategory === ""
                          ? "bg-orange-50 text-orange-500"
                          : "text-slate-800 hover:bg-orange-50 hover:text-orange-500"
                      }`}
                    >
                      All Products
                    </button>

                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(category);
                          setSearch("");
                          setShowCategories(false);
                        }}
                        className={`w-full px-4 py-1 text-left text-sm transition hover:bg-orange-50 hover:pl-6 hover:text-orange-500 ${
                          selectedCategory === category
                            ? "bg-orange-50 font-bold text-orange-500"
                            : "text-slate-700"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* DESKTOP NAV LINKS */}
              <nav className="flex items-center gap-7 px-9">
                <Link
                  to="/"
                  className="font-bold text-[14px] text-orange-500 transition hover:text-orange-500"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="font-bold text-[14px] text-slate-800 transition hover:text-orange-500"
                >
                  About
                </Link>
                <Link
                  to="/deals"
                  className="font-bold text-[14px] text-slate-800 transition hover:text-orange-500"
                >
                  Deals
                </Link>
                <Link
                  to="/contact"
                  className="font-bold text-[14px] text-slate-800 transition hover:text-orange-500"
                >
                  Contact
                </Link>
              </nav>

            </div>
          </div>
        </>
      )}

    </header>
  );
}

export default StoreNavbar;