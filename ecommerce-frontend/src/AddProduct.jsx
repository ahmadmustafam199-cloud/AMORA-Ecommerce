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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return alert("Please enter product name.");
    if (!form.description.trim()) return alert("Please enter product description.");
    if (form.price === "" || Number(form.price) < 0) return alert("Please enter a valid product price.");
    if (form.stock === "" || Number(form.stock) < 0) return alert("Please enter a valid stock quantity.");
    if (images.length < 1 || images.length > 10) return alert("Select between 1 and 10 product images.");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("category", form.category);
      formData.append("price", String(Number(form.price)));
      formData.append("stock", String(Number(form.stock)));
      formData.append("description", form.description.trim());

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to add product.");
      }

      alert("Product added successfully!");
      handleCancel();
    } catch (error) {
      console.error("Add Product Error:", error);
      alert(error.message || "Something went wrong while adding product.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: "",
      category: "Electronics",
      price: "",
      stock: "",
      description: "",
    });
    setImages([]);
    const fileInput = document.getElementById("productImages");
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <Navbar />

      <main className="pt-16 md:ml-52 md:pt-20">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
              Add Product
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Add a new product to your E-Commerce store.
            </p>
          </div>

          <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-8 sm:py-5">
              <h2 className="text-base font-semibold text-slate-800 sm:text-lg">
                Product Information
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Enter the details of your product below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-8">
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

              {/* CATEGORY, PRICE, STOCK GRID */}
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
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
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="5000"
                    min="0"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                <div className="sm:col-span-2 md:col-span-1">
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
                <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 sm:p-6">
                  <input
                    id="productImages"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImages}
                    required
                    className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-700 sm:px-4 sm:py-3 sm:text-sm sm:file:mr-4 sm:file:px-4 sm:file:py-2 sm:file:text-sm"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Select minimum 1 and maximum 10 images.
                  </p>

                  {images.length > 0 && (
                    <div className="mt-6">
                      <p className="mb-3 text-sm font-semibold text-slate-700">
                        Selected Images ({images.length}/10)
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
                        {images.map((image, index) => (
                          <div
                            key={`${image.name}-${index}`}
                            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                          >
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Product ${index + 1}`}
                              className="h-24 w-full object-cover sm:h-32"
                            />
                            <p className="px-2 py-1.5 text-center text-xs font-semibold text-slate-600">
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
                  rows="4"
                  required
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full cursor-pointer rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {loading ? "Adding Product..." : "+ Add Product"}
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