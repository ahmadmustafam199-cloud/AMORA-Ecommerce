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

const API_BASE_URL =
  "https://amora-backend-lake.vercel.app";

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
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editCategory, setEditCategory] =
    useState("Electronics");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  // PRODUCT ID
  const getProductId = (product) => {
    return product?._id || product?.id || "";
  };

  // IMAGE URL
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

  // FETCH PRODUCTS
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
            const errorData =
              await response.json();

            if (errorData?.message) {
              errorMessage = errorData.message;
            }
          } catch (error) {
            console.error(
              "Product error response parse failed:",
              error
            );
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();

        const productList =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.products)
            ? data.products
            : Array.isArray(data?.data)
            ? data.data
            : [];

        if (cancelled) return;

        setProducts(productList);
        setFetchError("");
        setIsLoading(false);
      } catch (error) {
        console.error(
          "Products Fetch Error:",
          error
        );

        if (cancelled) return;

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

  // RETRY
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
          const errorData =
            await response.json();

          if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch (error) {
          console.error(
            "Retry error response parse failed:",
            error
          );
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      const productList =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data?.data)
          ? data.data
          : [];

      setProducts(productList);
      setFetchError("");
    } catch (error) {
      console.error(
        "Retry Products Error:",
        error
      );

      setProducts([]);
      setFetchError(
        error?.message ||
          "Unable to load products."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // DELETE
  const deleteProduct = async (id) => {
    if (!id) {
      window.alert("Product ID not found.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

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
      } catch (error) {
        console.error(
          "Delete response parse failed:",
          error
        );
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to delete product."
        );
      }

      setProducts(
        (previousProducts) =>
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
      console.error(
        "Delete Product Error:",
        error
      );

      window.alert(
        error?.message ||
          "Failed to delete product."
      );
    } finally {
      setDeletingId("");
    }
  };

  // EDIT
  const handleEdit = (product) => {
    if (!product) return;

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

  // UPDATE
  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editProduct) return;

    const productId =
      getProductId(editProduct);

    if (!productId) {
      window.alert("Product ID not found.");
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
            description: description.trim(),
            category: editCategory,
            price: numericPrice,
            stock: numericStock,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch (error) {
        console.error(
          "Update response parse failed:",
          error
        );
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

      setProducts(
        (previousProducts) =>
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
      console.error(
        "Update Product Error:",
        error
      );

      window.alert(
        error?.message ||
          "Failed to update product."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // VIEW
  const handleView = (product) => {
    setViewProduct(product);
  };

  // FILTER
  const filteredProducts = useMemo(() => {
    const searchText = String(search || "")
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

      const productDescription = String(
        product?.description || ""
      ).toLowerCase();

      const productCategory = String(
        product?.category || ""
      ).toLowerCase();

      const matchesSearch =
        !searchText ||
        productName.includes(searchText) ||
        productDescription.includes(searchText) ||
        productCategory.includes(searchText);

      const matchesCategory =
        categoryText === "all" ||
        productCategory === categoryText;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [products, search, category]);

  // COUNTS
  const totalProducts = products.length;

  const clothesCount = useMemo(() => {
    return products.filter(
      (product) =>
        String(
          product?.category || ""
        ).toLowerCase() === "clothes"
    ).length;
  }, [products]);

  const sportsCount = useMemo(() => {
    return products.filter(
      (product) =>
        String(
          product?.category || ""
        ).toLowerCase() === "sports"
    ).length;
  }, [products]);

  const closeEditModal = () => {
    if (isUpdating) return;

    setEditProduct(null);
  };

  const closeViewModal = () => {
    setViewProduct(null);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f9fc]">
      <Sidebar />
      <Navbar />

      {/* MAIN */}
      <main className="ml-0 min-h-screen pt-16 lg:pt-7 md:ml-52 ">
        <div className="w-full p-3 sm:p-5 md:p-6 lg:p-8">

          {/* HEADING */}
          <div className="mb-4">
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
              All Products
            </h1>

            <p className="text-xs text-slate-500 sm:text-sm">
              Manage and view all products
              in your store
            </p>
          </div>

          {/* STATS */}
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 xl:gap-7">

            {/* TOTAL */}
            <div className="flex min-h-20 w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Package size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-600">
                  Total Products
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {totalProducts}
                </p>
              </div>
            </div>

            {/* CLOTHES */}
            <div className="flex min-h-20 w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <Shirt size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-600">
                  Clothes
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {clothesCount}
                </p>
              </div>
            </div>

            {/* SPORTS */}
            <div className="flex min-h-20 w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                <CircleDot size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-600">
                  Sports
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {sportsCount}
                </p>
              </div>
            </div>

            {/* ADD PRODUCT */}
            <div className="flex min-h-20 w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <Link
                to="/add-product"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={18} />
                Add Product
              </Link>
            </div>
          </div>

          {/* SEARCH FILTER */}
          <div className="mb-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 lg:gap-6">

              {/* CATEGORY */}
              <div className="relative w-full sm:w-56">
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

                  {CATEGORIES.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-3.5 text-slate-500"
                />
              </div>

              {/* SEARCH */}
              <div className="relative min-w-0 flex-1">
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
                  className="pointer-events-none absolute right-4 top-3.5 text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* PRODUCTS */}
          {isLoading ? (
            <div className="flex h-56 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm sm:h-64">
              <Loader2 className="h-8 w-8 shrink-0 animate-spin text-blue-600" />

              <span className="ml-3 text-sm font-medium text-slate-600">
                Loading products...
              </span>
            </div>
          ) : fetchError ? (
            <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-5 text-center sm:h-64">
              <AlertCircle className="h-10 w-10 shrink-0 text-red-500" />

              <p className="mt-2 text-base font-semibold text-red-700">
                Failed to load products
              </p>

              <p className="mt-1 max-w-lg wrap-break-word text-xs text-red-500 sm:text-sm">
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

          {/* FOOTER */}
          {!isLoading && !fetchError && (
            <div className="mt-4 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">

              <p className="text-xs text-slate-700 sm:text-sm">
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

              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-lg border border-slate-200 px-2.5 py-2 text-xs text-slate-400 sm:px-4 sm:text-sm"
                >
                  Previous
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white sm:px-4 sm:text-sm"
                >
                  1
                </button>

                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs hover:bg-slate-50 sm:px-4 sm:text-sm"
                >
                  2
                </button>

                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs hover:bg-slate-50 sm:px-4 sm:text-sm"
                >
                  3
                </button>

                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs hover:bg-slate-50 sm:px-4 sm:text-sm"
                >
                  4
                </button>

                <span className="px-1 text-xs text-slate-500 sm:px-2 sm:text-sm">
                  ...
                </span>

                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs hover:bg-slate-50 sm:px-4 sm:text-sm"
                >
                  7
                </button>

                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs hover:bg-slate-50 sm:px-4 sm:text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* EDIT MODAL */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:items-center sm:p-5">

          <div className="my-3 max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:my-5 sm:p-6 md:p-7">

            {/* HEADER */}
            <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Edit Product
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Update product information
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={isUpdating}
                aria-label="Close edit modal"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:w-10"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleUpdate}
              className="space-y-4 sm:space-y-5"
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
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
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
                  className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* CATEGORY PRICE STOCK */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {/* CATEGORY */}
                <div className="min-w-0">
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
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
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
                <div className="min-w-0">
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
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* STOCK */}
                <div className="min-w-0">
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
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isUpdating}
                  className="w-full rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex w-full min-w-36 items-center justify-center gap-2 rounded-lg bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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

      {/* VIEW MODAL */}
      {viewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeViewModal();
            }
          }}
        >
          <div className="my-3 max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:my-5 sm:p-6 md:p-7">

            {/* HEADER */}
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="min-w-0 text-xl font-bold text-slate-900 sm:text-2xl">
                Product Details
              </h2>

              <button
                type="button"
                onClick={closeViewModal}
                aria-label="Close view modal"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* IMAGE */}
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
                getImageUrl(singleImage);

              if (!imageUrl) {
                return (
                  <div className="mb-5 flex h-48 w-full items-center justify-center rounded-xl bg-slate-100 sm:h-60">
                    <Package
                      size={45}
                      className="text-slate-300 sm:h-12.5 sm:w-12.5"
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
                  className="mb-5 h-48 w-full rounded-xl bg-slate-50 object-contain sm:h-60"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              );
            })()}

            {/* NAME */}
            <h3 className="wrap-break-word text-lg font-bold text-slate-900 sm:text-xl">
              {viewProduct?.name ||
                "Unnamed Product"}
            </h3>

            {/* DESCRIPTION */}
            <p className="mt-2 wrap-break-word text-sm leading-6 text-slate-500 sm:text-base">
              {viewProduct?.description ||
                "No description available."}
            </p>

            {/* DETAILS */}
            <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-700 sm:text-base">

              <p className="wrap-break-word">
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
            <div className="mt-6">
              <button
                type="button"
                onClick={closeViewModal}
                className="w-full rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
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