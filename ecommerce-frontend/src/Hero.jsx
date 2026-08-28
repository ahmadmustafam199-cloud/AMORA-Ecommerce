function Hero() {
  return (
    <div className=" ml-12 mr-10 pt-2">
      <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-[#061A3D]">

        {/* Left Content */}
        <div className="relative z-10">
          <p className="pt-10 pl-12 font-serif font-bold text-orange-500">
            BIG SAVINGS
          </p>

          <h2 className="pl-12 text-4xl font-serif font-bold text-white">
            Discover Amazing <br />
            Products
          </h2>

          <p className="pl-12 pt-2 text-sm text-white">
            Shop the latest trends in electronics, Sports, home
            <br />
            appliances, clothes and more.
          </p>

          <button
            className="ml-12 mt-4 rounded-lg bg-orange-500 px-5 py-1.5
            text-sm font-bold text-white cursor-pointer hover:bg-orange-600"
          >
            Shop Now
          </button>
        </div>

        {/* Right Image */}
        <img
          src="/Image/hero3.png"
          alt="Featured products"
          className="absolute right-0 rounded-2xl top-0 h-92 w-[55%] object-cover object-right"
        />

      </div>
    </div>
  );
}

export default Hero;