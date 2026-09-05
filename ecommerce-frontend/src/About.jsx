import {
  Award,
  Heart,
  ShieldCheck,
  Truck,
  ShoppingBag,
  Sparkles,
  Users,
  Package,
  ArrowRight,
  BadgeDollarSign,
  RefreshCcw
} from "lucide-react";

import { Link } from "react-router-dom";

function About() {
  return (
    <div className="bg-white text-gray-900">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="px-4 py-2 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#071a3a] p-4 sm:p-6">
          <div className="flex flex-col-reverse items-center justify-between gap-6 lg:flex-row lg:gap-8">

            {/* Left Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <Sparkles size={14} />
                Welcome to AMORA
              </div>

              <h1 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
                Elegance, Quality &{" "}
                <span className="block text-emerald-200 lg:inline">
                  Style in Every Choice
                </span>
              </h1>

              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/80 sm:text-sm">
                AMORA brings together refined quality, modern style, and a seamless
                shopping experience. Discover thoughtfully curated products, timeless
                designs, and everyday essentials selected to add comfort, confidence,
                and elegance to your lifestyle.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link
                  to="/#"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-[#114232] transition hover:bg-gray-100 sm:text-sm"
                >
                  Shop Now
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/10 sm:text-sm"
                >
                  Explore AMORA
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full flex-1 max-w-md lg:max-w-none">
              <img
                src="/Image/000000.png"
                alt="Product"
                className="h-auto w-full lg:w-105 lg:ml-30 max-w-md mx-auto object-cover"
              />
            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          OUR STORY
      ===================================================== */}
      <section className="py-4 sm:py-6">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">

          {/* Left Content */}
          <div className="text-center lg:text-left">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#114232] sm:text-sm">
              Our Story
            </span>

            <h2 className="mt-1 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              More Than Shopping,{" "}
              <span className="block text-[#114232]">
                It’s an Experience
              </span>
            </h2>

            <p className="mt-2 max-w-xl text-xs leading-relaxed text-gray-600 sm:text-sm">
              AMORA was created with a simple vision: to make online shopping more
              convenient, reliable, and stylish. We believe every customer deserves
              quality products, fair prices, and a seamless shopping experience they
              can trust. From everyday essentials to modern lifestyle products, our
              collection is thoughtfully curated to give you more choices without
              making shopping complicated.
            </p>

            {/* Highlight */}
            <div className="mt-4 flex items-center justify-center gap-3 text-left lg:justify-start">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#071a3a] text-white shadow-sm">
                <Heart size={18} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 sm:text-base">
                  Made for Modern Shoppers
                </h3>

                <p className="text-xs text-gray-500">
                  Quality products with style and convenience.
                </p>
              </div>
            </div>
          </div>

          {/* Right Cards */}
          <div className="rounded-2xl bg-[#071a3a] p-3 sm:p-4 shadow-lg">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              {/* Quality */}
              <div className="rounded-xl bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <ShoppingBag size={22} className="text-[#114232]" />
                <h3 className="mt-1.5 text-base font-bold text-gray-900 sm:text-lg">
                  Quality
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                  Carefully selected products for our customers.
                </p>
              </div>

              {/* Value */}
              <div className="rounded-xl bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <Award size={22} className="text-[#114232]" />
                <h3 className="mt-1.5 text-base font-bold text-gray-900 sm:text-lg">
                  Value
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                  Great products at competitive prices.
                </p>
              </div>

              {/* Trust */}
              <div className="rounded-xl bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <ShieldCheck size={22} className="text-[#114232]" />
                <h3 className="mt-1.5 text-base font-bold text-gray-900 sm:text-lg">
                  Trust
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                  A safe and reliable shopping experience.
                </p>
              </div>

              {/* Style */}
              <div className="rounded-xl bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <Sparkles size={22} className="text-[#114232]" />
                <h3 className="mt-1.5 text-base font-bold text-gray-900 sm:text-lg">
                  Style
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                  Modern products for modern lifestyles.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* =====================================================
          PRODUCT COLLECTION
      ===================================================== */}
      <section className="py-4">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">

          <h2 className="mb-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            AMORA Product Collection
          </h2>

          <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
            At AMORA, we bring together a thoughtfully curated range of products
            designed for modern lifestyles. From fashion and accessories to
            electronics, home essentials, beauty, sports, and everyday essentials,
            our collection offers quality, style, and practicality in one convenient
            place.
          </p>

          <p className="mt-2 text-xs leading-relaxed text-gray-600 sm:text-sm">
            Every product is selected with care to give you reliable quality, great
            value, and a smooth shopping experience. Whether you’re upgrading your
            style, finding the latest tech, or choosing something for your home,
            AMORA makes it easy to discover products that fit your needs and
            lifestyle.
          </p>

        </div>
      </section>


      {/* =====================================================
          WHY CHOOSE US
      ===================================================== */}
      <section className="bg-gray-50 py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#114232]">
              Why AMORA
            </span>

            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Why Choose Us?
            </h2>

            <p className="mx-auto mt-1 max-w-xl text-xs text-gray-600 sm:text-sm">
              We focus on giving our customers a shopping experience that is
              simple, secure, and satisfying.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

            {/* Card 1 */}
            <div className="rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#114232]/10 text-[#114232]">
                <Package size={22} />
              </div>
              <h3 className="mt-3 text-base font-bold text-gray-900">
                Quality Products
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Carefully selected products with quality and value in mind.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#114232]/10 text-[#114232]">
                <Truck size={22} />
              </div>
              <h3 className="mt-3 text-base font-bold text-gray-900">
                Fast Delivery
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Quick and safe delivery to get your orders to you on time.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#114232]/10 text-[#114232]">
                <ShieldCheck size={22} />
              </div>
              <h3 className="mt-3 text-base font-bold text-gray-900">
                Secure Shopping
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                A safe and reliable experience from browsing to checkout.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#114232]/10 text-[#114232]">
                <Users size={22} />
              </div>
              <h3 className="mt-3 text-base font-bold text-gray-900">
                Customer First
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Customer satisfaction remains at the heart of what we do.
              </p>
            </div>

            {/* Card 5 */}
            <div className="rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#114232]/10 text-[#114232]">
                <RefreshCcw size={22} />
              </div>
              <h3 className="mt-3 text-base font-bold text-gray-900">
                Easy Returns
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Simple return options designed to make shopping worry-free.
              </p>
            </div>

            {/* Card 6 */}
            <div className="rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#114232]/10 text-[#114232]">
                <BadgeDollarSign size={22} />
              </div>
              <h3 className="mt-3 text-base font-bold text-gray-900">
                Great Value
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Quality products at competitive prices for every customer.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          MISSION
      ===================================================== */}
      <section className="py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-[#071a3a]">
            <div className="grid items-stretch lg:grid-cols-2">

              {/* Left Content */}
              <div className="flex flex-col justify-center p-4 text-center sm:p-6 lg:p-8 lg:text-left">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
                  Our Mission
                </span>

                <h2 className="mt-1 text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">
                  Making Every Shopping Moment Better
                </h2>

                <p className="mt-2 text-xs leading-relaxed text-white/75 sm:text-sm">
                  Our mission is to connect customers with products they love
                  while providing an effortless and trustworthy online shopping
                  experience.
                </p>

                <p className="mt-2 text-xs leading-relaxed text-white/75 sm:text-sm">
                  We continuously work to improve our collection, service, and
                  customer experience so AMORA can become a trusted destination
                  for modern online shopping.
                </p>
              </div>

              {/* Right Stats */}
              <div className="flex items-center justify-center bg-white/5 p-4 sm:p-6">
                <div className="grid w-full max-w-sm grid-cols-2 gap-3">

                  {/* Products */}
                  <div className="rounded-xl bg-white/10 p-3 text-center backdrop-blur-sm transition duration-300 hover:bg-white/15">
                    <Package className="mx-auto text-emerald-200" size={22} />
                    <h3 className="mt-1.5 text-xl font-bold text-white sm:text-2xl">
                      100+
                    </h3>
                    <p className="mt-0.5 text-xs text-white/60">
                      Products
                    </p>
                  </div>

                  {/* Categories */}
                  <div className="rounded-xl bg-white/10 p-3 text-center backdrop-blur-sm transition duration-300 hover:bg-white/15">
                    <ShoppingBag className="mx-auto text-emerald-200" size={22} />
                    <h3 className="mt-1.5 text-xl font-bold text-white sm:text-2xl">
                      10+
                    </h3>
                    <p className="mt-0.5 text-xs text-white/60">
                      Categories
                    </p>
                  </div>

                  {/* Customers */}
                  <div className="rounded-xl bg-white/10 p-3 text-center backdrop-blur-sm transition duration-300 hover:bg-white/15">
                    <Users className="mx-auto text-emerald-200" size={22} />
                    <h3 className="mt-1.5 text-xl font-bold text-white sm:text-2xl">
                      500+
                    </h3>
                    <p className="mt-0.5 text-xs text-white/60">
                      Customers
                    </p>
                  </div>

                  {/* Commitment */}
                  <div className="rounded-xl bg-white/10 p-3 text-center backdrop-blur-sm transition duration-300 hover:bg-white/15">
                    <Award className="mx-auto text-emerald-200" size={22} />
                    <h3 className="mt-1.5 text-xl font-bold text-white sm:text-2xl">
                      100%
                    </h3>
                    <p className="mt-0.5 text-xs text-white/60">
                      Commitment
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-6 text-center shadow-sm sm:px-6 sm:py-8">

            {/* Icon */}
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#114232]/10 text-[#114232]">
              <ShoppingBag size={22} />
            </div>

            {/* Heading */}
            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Ready to Explore AMORA?
            </h2>

            {/* Description */}
            <p className="mx-auto mt-1 max-w-xl text-xs leading-relaxed text-gray-600 sm:text-sm">
              Discover quality products, modern style, and everything you need
              for a better shopping experience.
            </p>

            {/* Button */}
            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#071a3a] px-4 py-2 text-xs font-semibold text-white transition duration-300 hover:bg-[#2f5067] hover:shadow-md sm:text-sm"
            >
              Start Shopping
              <ArrowRight size={16} />
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
}

export default About;