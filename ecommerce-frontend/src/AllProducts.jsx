import { useEffect, useMemo, useState } from "react";


import {
  Search,
  ChevronDown,
  Plus,
  Package,
  Shirt,
  CircleDot,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ProductTable from "./ProductTable";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Edit / View
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);

  // Edit Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // =====================================================
  // GET ALL PRODUCTS
  // =====================================================

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        // Handle both array and object API responses
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Products Error:", error);
        setProducts([]);
      }
    };

    getProducts();
  }, []);

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setProducts((prev) =>
        prev.filter(
          (product) =>
            (product._id || product.id) !== id
        )
      );

      alert("Product deleted successfully!");
    } catch (error) {
      console.log("Delete Error:", error);
      alert("Product delete nahi hua.");
    }
  };

  // =====================================================
  // EDIT BUTTON
  // =====================================================

  const handleEdit = (product) => {
    setEditProduct(product);

    setName(product.name || "");
    setDescription(product.description || "");
    setEditCategory(product.category || "Electronics");
    setPrice(product.price || "");
    setStock(product.stock || "");
  };

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editProduct) return;

    try {
      const productId =
        editProduct._id || editProduct.id;

      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            category: editCategory,
            price,
            stock,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Update failed"
        );
      }

      const updatedProduct = data.product;

      setProducts((prev) =>
        prev.map((product) =>
          (product._id || product.id) === productId
            ? updatedProduct
            : product
        )
      );

      setEditProduct(null);

      alert("Product updated successfully!");
    } catch (error) {
      console.log("Update Error:", error);
      alert("Product update nahi hua.");
    }
  };

  // =====================================================
  // VIEW PRODUCT
  // =====================================================

  const handleView = (product) => {
    setViewProduct(product);
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  // =====================================================
  // COUNTS
  // =====================================================

  const totalProducts = products.length;

  const clothesCount = products.filter(
    (product) =>
      product.category === "Clothes"
  ).length;

  const sportsCount = products.filter(
    (product) =>
      product.category === "Sports"
  ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f7f9fc]">

      <Sidebar />

      <Navbar />

      {/* MAIN */}
      <main className="ml-50 ">

        <div className="p-8">

          {/* HEADING */}
          <div className="mb-3">

            <h1 className="text-[18px] font-bold text-slate-900">
              All Products
            </h1>

            <p className="m text-[14px] text-slate-500">
              Manage and view all products in your store
            </p>

          </div>

          {/* =====================================================
              STATS
          ===================================================== */}

          <div className="mb-2.5 grid grid-cols-4 gap-7">

  {/* TOTAL PRODUCTS */}
  <div className="flex w-56 h-20 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 shadow-sm">
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
  <div className="flex w-56 h-20 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 shadow-sm">
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
  <div className="flex w-56 h-20 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 shadow-sm">
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
  <div className="flex w-56 h-20 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 shadow-sm">
    <Link
      to="/add-product"
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
    >
      <Plus size={18} />
      Add Product
    </Link>
  </div>

</div>

          {/* =====================================================
              SEARCH / FILTER
          ===================================================== */}

          <div className=" rounded-xl  h-20   ">

            <div className="flex gap-8">

              {/* CATEGORY */}
              <div className="relative w-56">

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  className="h-12 w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
                >

                  <option value="All">
                    All Categories
                  </option>

                  <option value="Electronics">
                    Electronics
                  </option>

                  <option value="Phones">
                    Phones
                  </option>

                  <option value="Shoes">
                    Shoes
                  </option>

                  <option value="Home & Kitchen">
                    Home & Kitchen
                  </option>

                  <option value="Sports">
                    Sports
                  </option>

                  <option value="Clothes">
                    Clothes
                  </option>

                  <option value="Accessories">
                    Accessories
                  </option>

                  <option value="Computer">
                   Computer
                  </option>

                  <option value="Beauty">
                    Beauty
                  </option>

                  <option value="Toys">
                    Toys
                  </option>

                  <option value="Bags">
                    Bags
                  </option>

                  
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
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search products..."
                  className="h-12 w-full rounded-lg border border-slate-300 px-4 pr-12 text-sm outline-none focus:border-blue-500"
                />

                <Search
                  size={21}
                  className="absolute right-4 top-3.5 text-slate-700"
                />

              </div>

            </div>

          </div>

          {/* =====================================================
              PRODUCT TABLE
          ===================================================== */}

          <ProductTable
            products={filteredProducts}
            onDelete={deleteProduct}
            onEdit={handleEdit}
            onView={handleView}
          />

          {/* =====================================================
              BOTTOM
          ===================================================== */}

          <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-6 py-4">

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

              <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400">
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

              <span className="px-2 text-slate-500">
                ...
              </span>

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

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">

          <div className="w-full max-w-2xl rounded-2xl bg-white p-7 shadow-2xl">

            {/* Modal Header */}
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
                onClick={() =>
                  setEditProduct(null)
                }
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleUpdate}
              className="space-y-5"
            >

              {/* Name */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Product Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  required
                />

              </div>

              {/* Description */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows="4"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

              {/* Category / Price / Stock */}
              <div className="grid grid-cols-3 gap-4">

                {/* Category */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>

                  <select
                    value={editCategory}
                    onChange={(e) =>
                      setEditCategory(e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  >

                    <option value="Electronics">
                      Electronics
                    </option>

                    <option value="Phones">
                      Phones
                    </option>

                    <option value="Shoes">
                      Shoes
                    </option>

                    <option value="Home & Kitchen">
                      Home & Kitchen
                    </option>

                    <option value="Sports">
                      Sports
                    </option>

                    <option value="Clothes">
                      Clothes
                    </option>

                  </select>

                </div>

                {/* Price */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Price
                  </label>

                  <input
                    type="number"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    required
                  />

                </div>

                {/* Stock */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Stock
                  </label>

                  <input
                    type="number"
                    value={stock}
                    onChange={(e) =>
                      setStock(e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    required
                  />

                </div>

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() =>
                    setEditProduct(null)
                  }
                  className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Update Product
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-5">

          <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                Product Details
              </h2>

              <button
                onClick={() =>
                  setViewProduct(null)
                }
                className="rounded-lg bg-slate-100 px-4 py-2"
              >
                X
              </button>

            </div>

            {viewProduct.images?.[0] && (
              <img
                src={
                  viewProduct.images[0].startsWith("http")
                    ? viewProduct.images[0]
                    : `http://localhost:5000${
                        viewProduct.images[0].startsWith("/")
                          ? viewProduct.images[0]
                          : `/${viewProduct.images[0]}`
                      }`
                }
                alt={viewProduct.name}
                className="mb-5 h-60 w-full rounded-xl object-cover"
              />
            )}

            <h3 className="text-xl font-bold">
              {viewProduct.name}
            </h3>

            <p className="mt-2 text-slate-500">
              {viewProduct.description}
            </p>

            <div className="mt-5 space-y-2">

              <p>
                <strong>Category:</strong>{" "}
                {viewProduct.category}
              </p>

              <p>
                <strong>Price:</strong>{" "}
                Rs.{" "}
                {Number(viewProduct.price).toLocaleString()}
              </p>

              <p>
                <strong>Stock:</strong>{" "}
                {viewProduct.stock}
              </p>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AllProducts;