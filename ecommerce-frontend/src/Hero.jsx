function Hero() {
  return (
    <div className="w-full px-3 pt-2 sm:px-4 lg:px-8 xl:max-w-360 xl:mx-auto">
      <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#061A3D] p-6 min-h-85 sm:min-h-70 sm:flex-row sm:items-center sm:p-10 lg:p-10">
        
        {/* Content Section */}
        <div className="relative z-10 max-w-full sm:max-w-[55%] md:max-w-[50%] lg:max-w-[45%]">
          <p className="text-xs font-serif font-bold text-orange-500 tracking-wider sm:text-sm">
            BIG SAVINGS
          </p>

          <h2 className="mt-2 text-2xl font-serif font-bold leading-tight text-white min-[375px]:text-3xl lg:text-4xl sm:text-3xl md:text-2xl">
            Discover Amazing <br className="hidden min-[375px]:inline" />
            Products
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-gray-200 sm:text-sm md:text-[11px] lg:text-[13px]">
            Shop the latest trends in electronics, sports, home appliances,  clothes, and more.
          </p>

          <button className="mt-5 rounded-lg bg-orange-500 px-5 py-2.5 text-xs font-bold text-white transition-colors duration-200 hover:bg-orange-600 sm:text-sm lg:px-4 lg:py-1.5 cursor-pointer">
            Shop Now
          </button>
        </div>

        {/* Image Section */}
        <div className="absolute right-0 bottom-0 top-1/3 w-full sm:top-0 sm:h-90 sm:w-[55%]  lg:w-[48%] lg:h-92">
          <img
            src="/Image/hero3.png"
            alt="Featured products"
            className="h-full w-full object-cover object-center sm:object-right opacity-40 sm:opacity-100"
          />
        </div>

      </div>
    </div>
  );
}

export default Hero;