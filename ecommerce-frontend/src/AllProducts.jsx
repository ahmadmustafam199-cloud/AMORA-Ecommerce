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

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);

  // Edit Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // ==========================================
  // GET PRODUCTS
  // ==========================================
  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products from server");
        }

        const data = await response.json();
        const productList = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
          ? data.products
          : [];

        setProducts(productList);
      } catch (error) {
        console.error("Products Error:", error);
        setFetchError(error.message);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    getProducts();
  }, []);

  // Helper function to extract product ID
  const getProductId = (prod) => prod?._id || prod?.id;

  // ==========================================
  // DELETE PRODUCT
  // ==========================================
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setProducts((prev) =>
        prev.filter((product) => getProductId(product) !== id)
      );

      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error);
      alert(error.message || "Failed to delete product.");
    }
  };

  // ==========================================
  // EDIT & UPDATE PRODUCT
  // ==========================================
  const handleEdit = (product) => {
    setEditProduct(product);
    setName(product.name || "");
    setDescription(product.description || "");
    setEditCategory(product.category || "Electronics");
    setPrice(product.price || "");
    setStock(product.stock || "");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editProduct) return;

    const productId = getProductId(editProduct);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            category: editCategory,
            price: Number(price),
            stock: Number(stock),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      const updatedProduct = data.product || data;

      setProducts((prev) =>
        prev.map((product) =>
          getProductId(product) === productId ? updatedProduct : product
        )
      );

      setEditProduct(null);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Update Error:", error);
      alert(error.message || "Failed to update product.");
    }
  };

  // ==========================================
  // VIEW PRODUCT
  // ==========================================
  const handleView = (product) => {
    setViewProduct(product);
  };

  // ==========================================
  // IMAGE URL HELPER
  // ==========================================
  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    return `${API_BASE_URL}${image.startsWith("/") ? image : `/${image}`}`;
  };

  // ==========================================
  // FILTER & COUNTS
  // ==========================================
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productName = product.name || "";
      const matchesSearch = productName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const totalProducts = products.length;
  const clothesCount = useMemo(
    () => products.filter((p) => p.category === "Clothes").length,
    [products]
  );
  const sportsCount = useMemo(
    () => products.filter((p) => p.category === "Sports").length,
    [products]
  );

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Sidebar />
      <Navbar />

      <main className="ml-50">
        <div className="p-8">
          {/* HEADING */}
          <div className="mb-3">
            <h1 className="text-[18px] font-bold text-slate-900">
              All Products
            </h1>
            <p className="text-[14px] text-slate-500">
              Manage and view all products in your store
            </p>
          </div>

          {/* STATS */}
          <div className="mb-6 grid grid-cols-4 gap-7">
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

            <div className="flex h-20 w-56 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <Shirt size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600">Clothes</p>
                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {clothesCount}
                </p>
              </div>
            </div>

            <div className="flex h-20 w-56 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                <CircleDot size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600">Sports</p>
                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {sportsCount}
                </p>
              </div>
            </div>

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

          {/* SEARCH & FILTER CONTROLS */}
          <div className="mb-6">
            <div className="flex gap-8">
              {/* CATEGORY DROPDOWN */}
              <div className="relative w-56">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-12 w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Phones">Phones</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Sports">Sports</option>
                  <option value="Clothes">Clothes</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Computer">Computer</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Toys">Toys</option>
                  <option value="Bags">Bags</option>
                </select>
                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-3.5 text-slate-500"
                />
              </div>

              {/* SEARCH INPUT */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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

          {/* CONTENT / PRODUCT TABLE */}
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
              <p className="mt-1 text-sm text-red-500">{fetchError}</p>
            </div>
          ) : (
            <ProductTable
              products={filteredProducts}
              onDelete={deleteProduct}
              onEdit={handleEdit}
              onView={handleView}
            />
          )}

          {/* PAGINATION / FOOTER */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-6 py-4">
            <p className="text-sm text-slate-700">
              Showing <strong>{filteredProducts.length}</strong> of{" "}
              <strong>{products.length}</strong> products
            </p>

            <div className="flex items-center gap-1">
              <button
                disabled
                className="cursor-not-allowed rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400"
              >
                Previous
              </button>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                1
              </button>
              <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">
                2
              </button>
              <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">
                3
              </button>
              <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">
                4
              </button>
              <span className="px-2 text-slate-500">...</span>
              <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">
                7
              </button>
              <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* EDIT MODAL */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-7 shadow-2xl">
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
                onClick={() => setEditProduct(null)}
                aria-label="Close edit modal"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Phones">Phones</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Sports">Sports</option>
                    <option value="Clothes">Clothes</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Computer">Computer</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Toys">Toys</option>
                    <option value="Bags">Bags</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Price
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="cursor-pointer rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Product Details
              </h2>
              <button
                type="button"
                onClick={() => setViewProduct(null)}
                aria-label="Close view modal"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {viewProduct.images?.[0] && (
              <img
                src={getImageUrl(viewProduct.images[0])}
                alt={viewProduct.name}
                className="mb-5 h-60 w-full rounded-xl object-cover"
              />
            )}

            <h3 className="text-xl font-bold text-slate-900">
              {viewProduct.name}
            </h3>

            <p className="mt-2 text-slate-500">{viewProduct.description}</p>

            <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-slate-700">
              <p>
                <strong>Category:</strong> {viewProduct.category}
              </p>
              <p>
                <strong>Price:</strong> Rs.{" "}
                {Number(viewProduct.price || 0).toLocaleString()}
              </p>
              <p>
                <strong>Stock:</strong> {viewProduct.stock}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllProducts;