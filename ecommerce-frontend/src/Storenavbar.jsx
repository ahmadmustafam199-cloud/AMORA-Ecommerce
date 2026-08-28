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

      {/* ================================================= */}
      {/* TOP BAR - HAR PAGE PAR SHOW HOGA */}
      {/* ================================================= */}

      <div className="bg-[#071a3a] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">

          {/* Free Delivery */}
          <div className="flex items-center gap-2 pl-8 text-sm">
            <PackageCheck size={17} />

            <span>
              Free Delivery on orders over PKR 5000
            </span>
          </div>

          {/* Right Links */}
          <div className="hidden items-center gap-7 pr-8 md:flex">

            {/* Help & Support */}
            <a
              href="#"
              className="flex items-center gap-2 text-sm transition hover:text-orange-400"
            >
              <CircleHelp size={16} />
              Help & Support
            </a>

            {/* Track Order */}
            <a
              href="#"
              className="flex items-center gap-2 text-sm transition hover:text-orange-400"
            >
              <PackageCheck size={16} />
              Track Order
            </a>

            {/* Currency */}
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

      {/* ================================================= */}
      {/* MAIN NAVBAR - SIRF STORE PAGES PAR */}
      {/* ================================================= */}

      {showMainNavbar && (
        <>
          {/* ================= MAIN NAVBAR ================= */}

          <div className="border-b border-slate-200 bg-white">

            <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-5">

              {/* LOGO */}
              <div className="flex shrink-0 items-center pl-5.5">

                <img
                  className="h-11 w-11 object-contain"
                  src="/Image/E-3.jfif"
                  alt="AMORA"
                />

                <span className="text-[20px] font-extrabold tracking-tight">
                  <span className="text-[#071a3a]">
                    AMORA
                  </span>
                </span>

              </div>

              {/* ================= SEARCH BAR ================= */}

              <div className="hidden flex-1 md:block">

                <div className="mx-auto flex overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);

                      // User search kare to selected category remove
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

              {/* ================= ACCOUNT / WISHLIST / CART ================= */}

              <div className="hidden items-center gap-5 pr-10 lg:flex">

                {/* Account */}
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

                {/* Wishlist */}
                <button
                  type="button"
                  className="flex items-center gap-2 text-[14px] font-semibold text-slate-800 transition hover:text-orange-500"
                >
                  <Heart
                    size={20}
                    strokeWidth={1.8}
                  />

                  <span>
                    Wishlist
                  </span>
                </button>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative flex items-center gap-2 text-sm font-semibold text-slate-800 transition hover:text-orange-500"
                >
                  <ShoppingCart
                    size={22}
                    strokeWidth={1.8}
                  />

                  <span>
                    Cart
                  </span>

                  {/* Cart Count */}
                  <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-bold text-white">
                    {cartCount}
                  </span>
                </Link>

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

          </div>

          {/* ================= NAVIGATION ================= */}

          <div className="border-b border-slate-200 bg-white">

            <div className="mx-auto flex max-w-7xl items-center pl-12 px-4">

              {/* ================= ALL CATEGORIES ================= */}

              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setShowCategories(!showCategories)
                  }
                  className="flex cursor-pointer items-center gap-2 rounded-b-lg bg-[#071a3a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b2855]"
                >
                  <Menu size={16} />

                  <span className="text-[12px]">
                    All Categories
                  </span>

                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      showCategories
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {/* ================= CATEGORY DROPDOWN ================= */}

                {showCategories && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">

                    <div className="border-b border-slate-100 bg-slate-50 px-4 py-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Shop By Category
                      </p>
                    </div>

                    {/* ================= ALL PRODUCTS ================= */}

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

                    {/* ================= CATEGORIES ================= */}

                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          // IMPORTANT:
                          // Category ko search mein nahi daalna
                          // Separate category filter use hoga
                          setSelectedCategory(category);

                          // Search clear
                          setSearch("");

                          // Dropdown close
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

              {/* ================= NAV LINKS ================= */}

            {/* ================= NAV LINKS ================= */}

<nav className="hidden items-center gap-7 px-9 md:flex">

  {/* HOME */}
  <Link
    to="/"
    className="font-bold text-[14px] text-orange-500 transition hover:text-orange-500"
  >
    Home
  </Link>

  {/* ABOUT */}
  <Link
    to="/about"
    className="font-bold text-[14px] text-slate-800 transition hover:text-orange-500"
  >
    About
  </Link>

  {/* DEALS */}
  <Link
  to="/deals"
 className="font-bold text-[14px] text-slate-800 transition hover:text-orange-500"
>
  Deals
</Link>
  {/* CONTACT */}
  <Link className="font-bold text-[14px] text-slate-800 transition hover:text-orange-500" to="/contact">
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