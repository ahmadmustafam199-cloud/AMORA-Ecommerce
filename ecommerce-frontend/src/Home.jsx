import { useEffect } from "react";

import Hero from "./Hero";
import CategorySection from "./CategorySection";
import ProductCard from "./ProductCard";
import SEO from "./SEO";

function Home({
  search = "",
  selectedCategory = "",
  setSelectedCategory = () => {},
}) {
  // ==========================================
  // CATEGORY CLICK FROM CATEGORY SECTION
  // ==========================================
  const handleCategoryClick = (category) => {
    setSelectedCategory((previousCategory) =>
      previousCategory === category ? "" : category
    );
  };

  // ==========================================
  // CLEAR CATEGORY
  // ==========================================
  const clearCategory = () => {
    setSelectedCategory("");
  };

  // ==========================================
  // SEARCH ACTIVE HOTE HI CATEGORY CLEAR
  // ==========================================
  useEffect(() => {
    if (search.trim() !== "" && selectedCategory !== "") {
      setSelectedCategory("");
    }
  }, [search, selectedCategory, setSelectedCategory]);

  return (
    <>
      {/* ==========================================
          HOME PAGE SEO
      ========================================== */}
      <SEO
        title="AMORA – Elegance & Style | Premium Fashion & Lifestyle"
        description="Shop premium fashion, shoes, bags, electronics, beauty, sports and lifestyle products at AMORA. Discover quality products, modern style and a seamless online shopping experience."
        url="/"
      />

      <div className="min-h-screen bg-slate-50">

        {/* ==========================================
            HERO
        ========================================== */}
        <Hero />

        {/* ==========================================
            CATEGORIES
        ========================================== */}
        <section className="px-3 py-4 sm:px-5 lg:px-8">
          <CategorySection
            onCategoryClick={handleCategoryClick}
            selectedCategory={selectedCategory}
          />
        </section>

        {/* ==========================================
            FEATURED PRODUCTS HEADER
        ========================================== */}
        <section className="flex flex-col items-start justify-between gap-3 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-12 lg:pr-8">

          <div>

            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Featured Products
            </h2>

            {/* Selected Category */}
            {selectedCategory && (
              <p className="mt-1 text-sm text-gray-500">
                Showing products from{" "}
                <span className="font-bold text-orange-500">
                  {selectedCategory}
                </span>
              </p>
            )}

            {/* Search */}
            {!selectedCategory && search.trim() !== "" && (
              <p className="mt-1 text-sm text-gray-500">
                Search results for{" "}
                <span className="font-bold text-orange-500">
                  "{search}"
                </span>
              </p>
            )}

          </div>

          {/* SHOW ALL */}
          {selectedCategory && (
            <button
              type="button"
              onClick={clearCategory}
              className="
                rounded-lg
                bg-gray-900
                px-4
                py-2
                text-xs
                font-bold
                text-white
                transition
                hover:bg-orange-500
              "
            >
              SHOW ALL
            </button>
          )}

        </section>

        {/* ==========================================
            PRODUCTS
        ========================================== */}
        <ProductCard
          search={search}
          selectedCategory={selectedCategory}
        />

      </div>
    </>
  );
}

export default Home;