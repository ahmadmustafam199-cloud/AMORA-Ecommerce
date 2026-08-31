import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Package,
  Shirt,
  CircleDot,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ProductTable from "./ProductTable";

const API_BASE_URL = "https://amora-backend-lake.vercel.app";

const CATEGORIES = [
  "Electronics",
  "Phones",
  "Shoes",
  "Home & Kitchen",
  "Sports",
  "Clothes",
  "Accessories",
  "Computer",
  "Beauty",
  "Toys",
  "Bags",
];

function AllProducts() {
  // =====================================================
  // PRODUCTS
  // =====================================================

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // =====================================================
  // SEARCH / CATEGORY
  // =====================================================

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // =====================================================
  // MODALS
  // =====================================================

  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);

  // =====================================================
  // EDIT FORM
  // =====================================================

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editCategory, setEditCategory] = useState("Electronics");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  // =====================================================
  // PRODUCT ID HELPER
  // =====================================================

  const getProductId = (product) => {
    return product?._id || product?.id || "";
  };

  // =====================================================
  // IMAGE URL HELPER
  // SAFE AGAINST null
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

    return `${API_BASE_URL}${
      cleanImage.startsWith("/")
        ? cleanImage
        : `/${cleanImage}`
    }`;
  };

  // =====================================================
  // FETCH PRODUCTS
  // IMPORTANT:
  // Fetch is directly handled inside useEffect.
  // No getProducts() state-setting function is called
  // synchronously from useEffect.
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/products`
        );

        if (!response.ok) {
          let errorMessage =
            "Failed to fetch products from server.";

          try {
            const errorData = await response.json();

            if (errorData?.message) {
              errorMessage = errorData.message;
            }
          } catch {
            // Ignore invalid error JSON
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();

        const productList = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data?.data)
          ? data.data
          : [];

        if (cancelled) {
          return;
        }

        setProducts(productList);
        setFetchError("");
        setIsLoading(false);
      } catch (error) {
        console.error("Products Fetch Error:", error);

        if (cancelled) {
          return;
        }

        setProducts([]);
        setFetchError(
          error?.message ||
            "Unable to load products."
        );
        setIsLoading(false);
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // RETRY
  // =====================================================

  const handleRetry = async () => {
    setIsLoading(true);
    setFetchError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products`
      );

      if (!response.ok) {
        let errorMessage =
          "Failed to fetch products from server.";

        try {
          const errorData = await response.json();

          if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // Ignore invalid JSON
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      const productList = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setProducts(productList);
      setFetchError("");
    } catch (error) {
      console.error("Retry Products Error:", error);

      setProducts([]);
      setFetchError(
        error?.message ||
          "Unable to load products."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const deleteProduct = async (id) => {
    if (!id) {
      window.alert("Product ID not found.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to delete product."
        );
      }

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) =>
            getProductId(product) !== id
        )
      );

      if (
        viewProduct &&
        getProductId(viewProduct) === id
      ) {
        setViewProduct(null);
      }

      if (
        editProduct &&
        getProductId(editProduct) === id
      ) {
        setEditProduct(null);
      }

      window.alert(
        "Product deleted successfully!"
      );
    } catch (error) {
      console.error("Delete Product Error:", error);

      window.alert(
        error?.message ||
          "Failed to delete product."
      );
    } finally {
      setDeletingId("");
    }
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEdit = (product) => {
    if (!product) {
      return;
    }

    setEditProduct(product);

    setName(product.name || "");
    setDescription(
      product.description || ""
    );
    setEditCategory(
      product.category || "Electronics"
    );
    setPrice(
      product.price !== undefined &&
      product.price !== null
        ? String(product.price)
        : ""
    );
    setStock(
      product.stock !== undefined &&
      product.stock !== null
        ? String(product.stock)
        : ""
    );
  };

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editProduct) {
      return;
    }

    const productId =
      getProductId(editProduct);

    if (!productId) {
      window.alert(
        "Product ID not found."
      );
      return;
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (
      !name.trim() ||
      Number.isNaN(numericPrice) ||
      Number.isNaN(numericStock)
    ) {
      window.alert(
        "Please enter valid product information."
      );
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            description:
              description.trim(),
            category: editCategory,
            price: numericPrice,
            stock: numericStock,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update product."
        );
      }

      const updatedProduct =
        data?.product ||
        data?.data ||
        data;

      setProducts((previousProducts) =>
        previousProducts.map(
          (product) =>
            getProductId(product) ===
            productId
              ? {
                  ...product,
                  ...updatedProduct,
                }
              : product
        )
      );

      setEditProduct(null);

      window.alert(
        "Product updated successfully!"
      );
    } catch (error) {
      console.error("Update Product Error:", error);

      window.alert(
        error?.message ||
          "Failed to update product."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // =====================================================
  // VIEW PRODUCT
  // =====================================================

  const handleView = (product) => {
    setViewProduct(product);
  };

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {
    const searchText = String(
      search || ""
    )
      .toLowerCase()
      .trim();

    const categoryText = String(
      category || "All"
    )
      .toLowerCase()
      .trim();

    return products.filter((product) => {
      const productName = String(
        product?.name || ""
      ).toLowerCase();

      const productDescription =
        String(
          product?.description || ""
        ).toLowerCase();

      const productCategory =
        String(
          product?.category || ""
        ).toLowerCase();

      const matchesSearch =
        !searchText ||
        productName.includes(
          searchText
        ) ||
        productDescription.includes(
          searchText
        ) ||
        productCategory.includes(
          searchText
        );

      const matchesCategory =
        categoryText === "all" ||
        productCategory ===
          categoryText;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    products,
    search,
    category,
  ]);

  // =====================================================
  // PRODUCT COUNTS
  // =====================================================

  const totalProducts =
    products.length;

  const clothesCount = useMemo(() => {
    return products.filter(
      (product) =>
        String(
          product?.category || ""
        ).toLowerCase() ===
        "clothes"
    ).length;
  }, [products]);

  const sportsCount = useMemo(() => {
    return products.filter(
      (product) =>
        String(
          product?.category || ""
        ).toLowerCase() ===
        "sports"
    ).length;
  }, [products]);

  // =====================================================
  // CLOSE EDIT MODAL
  // =====================================================

  const closeEditModal = () => {
    if (isUpdating) {
      return;
    }

    setEditProduct(null);
  };

  // =====================================================
  // CLOSE VIEW MODAL
  // =====================================================

  const closeViewModal = () => {
    setViewProduct(null);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Sidebar />
      <Navbar />

      <main className="ml-50">
        <div className="p-8">

          {/* =================================================
              HEADING
          ================================================= */}

          <div className="mb-3">
            <h1 className="text-[18px] font-bold text-slate-900">
              All Products
            </h1>

            <p className="text-[14px] text-slate-500">
              Manage and view all products
              in your store
            </p>
          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="mb-6 grid grid-cols-4 gap-7">

            {/* TOTAL PRODUCTS */}

            <div className="flex h-20 w-56 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Package size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-600">
                  Total Products
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {totalProducts}
                </p>
              </div>
            </div>

            {/* CLOTHES */}

            <div className="flex h-20 w-56 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <Shirt size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-600">
                  Clothes
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {clothesCount}
                </p>
              </div>
            </div>

            {/* SPORTS */}

            <div className="flex h-20 w-56 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                <CircleDot size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-600">
                  Sports
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {sportsCount}
                </p>
              </div>
            </div>

            {/* ADD PRODUCT */}

            <div className="flex h-20 w-56 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 shadow-sm">
              <Link
                to="/add-product"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={18} />
                Add Product
              </Link>
            </div>
          </div>

          {/* =================================================
              SEARCH & FILTER
          ================================================= */}

          <div className="mb-6">
            <div className="flex gap-8">

              {/* CATEGORY */}

              <div className="relative w-56">
                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                  className="h-12 w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="All">
                    All Categories
                  </option>

                  {CATEGORIES.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-3.5 text-slate-500"
                />
              </div>

              {/* SEARCH */}

              <div className="relative flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search products..."
                  className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 pr-12 text-sm outline-none focus:border-blue-500"
                />

                <Search
                  size={21}
                  className="absolute right-4 top-3.5 text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* =================================================
              PRODUCTS CONTENT
          ================================================= */}

          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

              <span className="ml-3 text-sm font-medium text-slate-600">
                Loading products...
              </span>
            </div>
          ) : fetchError ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <AlertCircle className="h-10 w-10 text-red-500" />

              <p className="mt-2 text-base font-semibold text-red-700">
                Failed to load products
              </p>

              <p className="mt-1 max-w-lg text-sm text-red-500">
                {fetchError}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : (
           <ProductTable
  products={filteredProducts}
  onDelete={deleteProduct}
  onEdit={handleEdit}
  onView={handleView}
  deletingId={deletingId}
  getImageUrl={getImageUrl}
/>
          )}

          {/* =================================================
              FOOTER
          ================================================= */}

          {!isLoading &&
            !fetchError && (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-6 py-4">
                <p className="text-sm text-slate-700">
                  Showing{" "}
                  <strong>
                    {filteredProducts.length}
                  </strong>{" "}
                  of{" "}
                  <strong>
                    {products.length}
                  </strong>{" "}
                  products
                </p>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    1
                  </button>

                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                  >
                    2
                  </button>

                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                  >
                    3
                  </button>

                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                  >
                    4
                  </button>

                  <span className="px-2 text-slate-500">
                    ...
                  </span>

                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                  >
                    7
                  </button>

                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
        </div>
      </main>

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-7 shadow-2xl">

            {/* HEADER */}

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Edit Product
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update product information
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={isUpdating}
                aria-label="Close edit modal"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleUpdate}
              className="space-y-5"
            >

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Product Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  rows="4"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* CATEGORY / PRICE / STOCK */}

              <div className="grid grid-cols-3 gap-4">

                {/* CATEGORY */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>

                  <select
                    value={editCategory}
                    onChange={(event) =>
                      setEditCategory(
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  >
                    {CATEGORIES.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* PRICE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(event) =>
                      setPrice(
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* STOCK */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(event) =>
                      setStock(
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isUpdating}
                  className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex min-w-36 items-center justify-center gap-2 rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdating && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {isUpdating
                    ? "Updating..."
                    : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      {viewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeViewModal();
            }
          }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl">

            {/* HEADER */}

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Product Details
              </h2>

              <button
                type="button"
                onClick={closeViewModal}
                aria-label="Close view modal"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* PRODUCT IMAGE */}

            {(() => {
              const firstImage =
                Array.isArray(
                  viewProduct?.images
                )
                  ? viewProduct.images.find(
                      (item) =>
                        typeof item ===
                          "string" &&
                        item.trim()
                    )
                  : null;

              const singleImage =
                typeof viewProduct?.image ===
                  "string" &&
                viewProduct.image.trim()
                  ? viewProduct.image
                  : firstImage;

              const imageUrl =
                getImageUrl(
                  singleImage
                );

              if (!imageUrl) {
                return (
                  <div className="mb-5 flex h-60 w-full items-center justify-center rounded-xl bg-slate-100">
                    <Package
                      size={50}
                      className="text-slate-300"
                    />
                  </div>
                );
              }

              return (
                <img
                  src={imageUrl}
                  alt={
                    viewProduct?.name ||
                    "Product"
                  }
                  className="mb-5 h-60 w-full rounded-xl object-contain bg-slate-50"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              );
            })()}

            {/* NAME */}

            <h3 className="text-xl font-bold text-slate-900">
              {viewProduct?.name ||
                "Unnamed Product"}
            </h3>

            {/* DESCRIPTION */}

            <p className="mt-2 text-slate-500">
              {viewProduct?.description ||
                "No description available."}
            </p>

            {/* DETAILS */}

            <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-slate-700">

              <p>
                <strong>
                  Category:
                </strong>{" "}
                {viewProduct?.category ||
                  "N/A"}
              </p>

              <p>
                <strong>
                  Price:
                </strong>{" "}
                Rs.{" "}
                {Number(
                  viewProduct?.price || 0
                ).toLocaleString()}
              </p>

              <p>
                <strong>
                  Stock:
                </strong>{" "}
                {Number(
                  viewProduct?.stock || 0
                )}
              </p>
            </div>

            {/* CLOSE */}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={closeViewModal}
                className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllProducts;