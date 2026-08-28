import { useEffect, useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ProductTable from "./ProductTable";

function Sports() {
  const [products, setProducts] = useState([]);

  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // GET SPORTS
  useEffect(() => {
    fetch("http://localhost:5000/api/products/category/Sports")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.log("Fetch Error:", error);
      });
  }, []);

  // =========================
  // EDIT BUTTON
  // =========================
  const handleEdit = (product) => {
    setEditProduct(product);

    setName(product.name || "");
    setDescription(product.description || "");
    setCategory(product.category || "Sports");
    setPrice(product.price || "");
    setStock(product.stock || "");
  };

  // =========================
  // UPDATE PRODUCT
  // =========================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${editProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            category,
            price,
            stock,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      // IMPORTANT: backend returns data.product
      const updatedProduct = data.product;

      setProducts((oldProducts) =>
        oldProducts.map((product) =>
          product._id === updatedProduct._id
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

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
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

      setProducts((oldProducts) =>
        oldProducts.filter(
          (product) => product._id !== id
        )
      );

    } catch (error) {
      console.log("Delete Error:", error);
      alert("Product delete nahi hua.");
    }
  };

  // =========================
  // VIEW
  // =========================
  const handleView = (product) => {
    setViewProduct(product);
  };

  return (
    <div className="ml-64 min-h-screen bg-white">

      <Sidebar />

      <div className="main">

        <Navbar />

        <div className="content pt-28">

          <h1 className="mb-6 ml-3 text-3xl font-bold text-slate-900">
            Sports Products
          </h1>

          <ProductTable
            products={products}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onView={handleView}
          />

        </div>

      </div>

      {/* =========================
          EDIT MODAL
      ========================= */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">

        <div className="w-full max-w-2xl rounded-2xl bg-white p-7 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-2xl font-bold text-slate-900">
                Edit Product
              </h2>

              <button
                onClick={() => setEditProduct(null)}
                className="rounded-lg bg-slate-100 px-4 py-2 text-slate-600 hover:bg-slate-200"
              >
                X
              </button>

            </div>

            <form
              onSubmit={handleUpdate}
              className="space-y-4"
            >

              <div>
                <label className="mb-1 block font-medium">
                  Product Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="mb-1 block font-medium">
                    Price
                  </label>

                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">
                    Stock
                  </label>

                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3"
                    required
                  />
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="rounded-lg border border-slate-300 px-5 py-3"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Update Product
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =========================
          VIEW MODAL
      ========================= */}
      {viewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-5">


            <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                Product Details
              </h2>

              <button
                onClick={() => setViewProduct(null)}
                className="rounded-lg bg-slate-100 px-4 py-2"
              >
                X
              </button>

            </div>

            {viewProduct.images?.[0] && (
              <img
                src={viewProduct.images[0]}
                alt={viewProduct.name}
                className="mb-5 h-60 w-full rounded-xl object-cover"
              />
            )}

            <h3 className="text-xl font-bold">
              {viewProduct.name}
            </h3>
product
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
                Rs. {Number(viewProduct.price).toLocaleString()}
              </p>

              <p>
                <strong>Stock:</strong>{" "}
                {viewProduct.stock}
              </p>

            </div>x

          </div>

        </div>
      )}

    </div>
  );
}

export default Sports;