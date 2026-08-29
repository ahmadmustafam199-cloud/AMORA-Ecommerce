import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const API_BASE_URL = "https://amora-backend-lake.vercel.app";

function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    category: "Electronics",
    price: "",
    stock: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // IMAGE SELECT
  // ==========================================

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length < 1) {
      alert("Please select at least 1 image.");
      e.target.value = "";
      setImages([]);
      return;
    }

    if (files.length > 10) {
      alert("You can select maximum 10 images.");
      e.target.value = "";
      setImages([]);
      return;
    }

    setImages(files);
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!form.description.trim()) {
      alert("Please enter product description.");
      return;
    }

    if (form.price === "" || Number(form.price) < 0) {
      alert("Please enter a valid product price.");
      return;
    }

    if (form.stock === "" || Number(form.stock) < 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    if (images.length < 1) {
      alert("Please select at least 1 product image.");
      return;
    }

    if (images.length > 10) {
      alert("You can select maximum 10 product images.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "category",
        form.category
      );

      formData.append(
        "price",
        String(Number(form.price))
      );

      formData.append(
        "stock",
        String(Number(form.stock))
      );

      formData.append(
        "description",
        form.description.trim()
      );

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch(
        `${API_BASE_URL}/api/products`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to add product."
        );
      }

      alert("Product added successfully!");

      setForm({
        name: "",
        category: "Electronics",
        price: "",
        stock: "",
        description: "",
      });

      setImages([]);

      const fileInput =
        document.getElementById("productImages");

      if (fileInput) {
        fileInput.value = "";
      }

    } catch (error) {
      console.error("Add Product Error:", error);

      alert(
        error.message ||
          "Something went wrong while adding product."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CANCEL
  // ==========================================

  const handleCancel = () => {
    setForm({
      name: "",
      category: "Electronics",
      price: "",
      stock: "",
      description: "",
    });

    setImages([]);

    const fileInput =
      document.getElementById("productImages");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100">

      <Sidebar />

      <Navbar />

      <main className="ml-50 pt-2">

        <div className="p-8">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
              Add Product
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Add a new product to your E-Commerce store.
            </p>
          </div>

          <div className="max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-8 py-5">

              <h2 className="text-lg font-semibold text-slate-800">
                Product Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the details of your product below.
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="p-8"
            >

              {/* NAME */}

              <div className="mb-6">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Nike Air Max Pro"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

              </div>

              {/* CATEGORY PRICE STOCK */}

              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
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

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="5000"
                    min="0"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="20"
                    min="0"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>

              </div>

              {/* IMAGES */}

              <div className="mb-6">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Product Images
                </label>

                <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6">

                  <input
                    id="productImages"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImages}
                    required
                    className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Select minimum 1 and maximum 10 images.
                  </p>

                  {images.length > 0 && (
                    <div className="mt-6">

                      <p className="mb-3 text-sm font-semibold text-slate-700">
                        Selected Images ({images.length}/10)
                      </p>

                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                        {images.map((image, index) => (
                          <div
                            key={`${image.name}-${index}`}
                            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                          >

                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Product ${index + 1}`}
                              className="h-32 w-full object-cover"
                            />

                            <p className="px-2 py-2 text-center text-xs font-semibold text-slate-600">
                              Image {index + 1}
                            </p>

                          </div>
                        ))}

                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* DESCRIPTION */}

              <div className="mb-8">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Write product description..."
                  rows="5"
                  required
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">

                <button
                  type="button"
                  onClick={handleCancel}
                  className="cursor-pointer rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Adding Product..."
                    : "+ Add Product"}
                </button>

              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddProduct;