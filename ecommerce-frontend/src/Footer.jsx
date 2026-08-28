import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#071a3a] font-sans text-white">
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-6">

        {/* ================= TOP SECTION ================= */}
        <div className="grid grid-cols-1 gap-10 pb-8 lg:grid-cols-12">

          {/* ================= NEWSLETTER ================= */}
          <div className="lg:col-span-5 lg:pr-10">
            <h3 className="text-xl font-semibold tracking-tight text-white">
              Get notified by email
            </h3>

            <p className="mt-4 max-w-md text-sm leading-6 text-gray-300">
              Stay in style with exclusive offers, new arrivals, and the latest
              fashion from AMORA.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-5 flex max-w-md"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="min-w-0 w-80 rounded-l-lg border border-white/10
                           bg-white/10 px-4 py-2.5 text-sm text-white
                           placeholder-gray-400 outline-none transition
                           focus:border-cyan-500 focus:bg-white/15"
              />

              <button
                type="submit"
                className="cursor-pointer rounded-r-lg bg-cyan-700 px-5 py-2.5
                           text-sm font-medium text-white transition duration-200
                           hover:bg-cyan-600"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* ================= FOOTER LINKS ================= */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-7">

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white">
                Quick Links
              </h4>

              <ul className="mt-5 space-y-3 text-sm text-gray-300">
                <li>
                  <Link
                    to="/"
                    className="transition duration-200 hover:text-white hover:underline"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    to="/all-products"
                    className="transition duration-200 hover:text-white hover:underline"
                  >
                    Shop All Products
                  </Link>
                </li>

                <li>
                  <Link
                    to="/cart"
                    className="transition duration-200 hover:text-white hover:underline"
                  >
                    Shopping Cart
                  </Link>
                </li>

                <li>
                  <Link
                    to="/orders"
                    className="transition duration-200 hover:text-white hover:underline"
                  >
                    My Orders
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-lg font-bold text-white">
                Company
              </h4>

              <ul className="mt-5 space-y-3 text-sm text-gray-300">
                <li>
                  <Link
                    to="/about"
                    className="transition duration-200 hover:text-white hover:underline"
                  >
                    About Us
                  </Link>
                </li>

                <li>
                  <Link
                    to="/"
                    className="transition duration-200 hover:text-white hover:underline"
                  >
                    Our Products
                  </Link>
                </li>

                <li>
                  <Link
                    to="/contact"
                    className="transition duration-200 hover:text-white hover:underline"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Policies & Support */}
            <div>
              <h4 className="text-lg font-bold text-white">
                Policies & Support
              </h4>

              <ul className="mt-5 space-y-3 text-sm text-gray-300">
                <li>
                  <Link
                    to=" "
                    className="transition duration-200 hover:text-white hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </li>

                <li>
                  <Link
                    to=" "
                    className="transition duration-200 hover:text-white hover:underline"
                  >
                    Terms & Conditions
                  </Link>
                </li>

                <li>
                  <Link
                    to="  "
                    className="transition duration-200 hover:text-white hover:underline"
                  >
                    Shipping & Delivery
                  </Link>
                </li>

                <li>
                  <Link
                    to=" "
                    className="transition duration-200 hover:text-white hover:underline"
                  >
                    Returns & Exchanges
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* ================= COMMUNITY SECTION ================= */}
        <div className="flex flex-col items-start justify-between gap-6 border-y border-white/15 pt-2 mb-2 md:flex-row md:items-center">

          {/* Community Text */}
          <div>
            <h4 className="text-xl font-bold text-white">
              Join our AMORA community!
            </h4>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-300">
              Follow AMORA for new arrivals, exclusive offers, and everyday
              style inspiration.
            </p>
          </div>

          {/* ================= SOCIAL ICONS ================= */}
          <div className="flex items-center gap-3">

            {/* Facebook */}
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full
                         border border-white/15 bg-white/5 transition duration-200
                         hover:border-[#C6F400] hover:bg-[#C6F400]
                         hover:text-[#114232]"
            >
              <svg
                className="h-4 w-4 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073C24 5.446 18.627.073 12 .073S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full
                         border border-white/15 bg-white/5 transition duration-200
                         hover:border-[#C6F400] hover:bg-[#C6F400]
                         hover:text-[#114232]"
            >
              <svg
                className="h-4 w-4 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.667.014 15.259 0 12 0zm0 5.838A6.162 6.162 0 1 0 12 18.162 6.162 6.162 0 0 0 12 5.838zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="#"
              aria-label="YouTube"
              className="flex h-10 w-10 items-center justify-center rounded-full
                         border border-white/15 bg-white/5 transition duration-200
                         hover:border-[#C6F400] hover:bg-[#C6F400]
                         hover:text-[#114232]"
            >
              <svg
                className="h-4 w-4 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* X */}
            <a
              href="#"
              aria-label="X"
              className="flex h-10 w-10 items-center justify-center rounded-full
                         border border-white/15 bg-white/5 text-sm font-bold
                         transition duration-200 hover:border-[#C6F400]
                         hover:bg-[#C6F400] hover:text-[#114232]"
            >
              𝕏
            </a>

            {/* Pinterest */}
            <a
              href="#"
              aria-label="Pinterest"
              className="flex h-10 w-10 items-center justify-center rounded-full
                         border border-white/15 bg-white/5 text-sm font-bold
                         transition duration-200 hover:border-[#C6F400]
                         hover:bg-[#C6F400] hover:text-[#114232]"
            >
              P
            </a>

          </div>
        </div>

        {/* ================= PAYMENT + COPYRIGHT ================= */}
        <div className="flex flex-col items-center justify-between gap-5 pt-7 sm:flex-row">

          {/* Copyright */}
          <p className="text-xs text-gray-300">
            © {new Date().getFullYear()} AMORA — Elegance & Style. All rights reserved.
          </p>

          {/* Payment Methods */}
          <div className="flex flex-wrap items-center justify-center gap-2">

            {/* Cash on Delivery */}
            <div className="rounded bg-white px-3 py-1.5 text-[11px] font-bold text-[#114232]">
              Cash on Delivery
            </div>

            {/* JazzCash */}
            <div className="rounded bg-white px-3 py-1.5 text-[11px] font-bold text-red-600">
              JazzCash
            </div>

            {/* Easypaisa */}
            <div className="rounded bg-white px-3 py-1.5 text-[11px] font-bold text-green-600">
              Easypaisa
            </div>

            {/* SadaPay */}
            <div className="rounded bg-white px-3 py-1.5 text-[11px] font-bold text-black">
              SadaPay
            </div>

            {/* VISA */}
            <div className="rounded bg-white px-3 py-1.5 text-[11px] font-extrabold italic text-[#1A1F71]">
              VISA
            </div>

            {/* Mastercard */}
            <div className="flex items-center justify-center rounded bg-white px-3 py-1.5">
              <div className="h-3 w-3 rounded-full bg-red-600"></div>
              <div className="-ml-1 h-3 w-3 rounded-full bg-yellow-400"></div>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;