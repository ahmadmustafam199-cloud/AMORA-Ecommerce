import { useEffect, useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ProductTable from "./ProductTable";

function Clothes() {
  const [products, setProducts] = useState([]);

  // Edit modal
  const [editProduct, setEditProduct] = useState(null);

  // View modal
  const [viewProduct, setViewProduct] = useState(null);

  // Edit form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Clothes");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // =====================================================
  // GET CLOTHES PRODUCTS
  // =====================================================

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products/category/Clothes"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch clothes products");
        }

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        console.log("Clothes Fetch Error:", error);
      }
    };

    getProducts();
  }, []);

  // =====================================================
  // DELETE
  // =====================================================

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
    setCategory(product.category || "Clothes");
    setPrice(product.price || "");
    setStock(product.stock || "");
  };

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editProduct) return;

    const productId =
      editProduct._id || editProduct.id;

    try {
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
            category,
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
  // VIEW
  // =====================================================

  const handleView = (product) => {
    setViewProduct(product);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc]">

      <Sidebar />

      <Navbar />

      {/* MAIN */}
      <main className="ml-64 pt-20">

        <div className="p-8">

          <div className="mb-6">

            <h1 className="text-3xl font-bold text-slate-900">
              Clothes Products
            </h1>

            <p className="mt-1 text-slate-500">
              Manage all clothes products
            </p>

          </div>

          {/* PRODUCT TABLE */}

          <ProductTable
            products={products}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onView={handleView}
          />

        </div>

      </main>

      {
      /* =====================================================
          EDIT MODAL
      ===================================================== */}
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

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Clothes;