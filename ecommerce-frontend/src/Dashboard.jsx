
import { useEffect, useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import {
  ShoppingCart,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

const API_URL = "https://amora-backend-lake.vercel.app";

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // EDIT MODAL
  const [showEditModal, setShowEditModal] = useState(false);

  // EDIT FORM
  const [editForm, setEditForm] = useState({
    _id: "",
    customerName: "",
    address: "",
    phone: "",
    totalPrice: "",
    status: "Pending",
  });

  // ==========================================
  // REFRESH ORDERS
  // ==========================================

  const refetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/orders`);

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Orders Error:", err);

      setError(
        err.message || "Something went wrong while fetching orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // INITIAL FETCH
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    const getOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/orders`);

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        if (isMounted) {
          setOrders(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Orders Error:", err);

        if (isMounted) {
          setError(
            err.message ||
              "Something went wrong while fetching orders."
          );

          setLoading(false);
        }
      }
    };

    getOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================
  // EDIT ORDER
  // ==========================================

  const handleEdit = (order) => {
    setEditForm({
      _id: order._id,
      customerName: order.customerName || "",
      address: order.address || "",
      phone: order.phone || "",
      totalPrice: order.totalPrice ?? "",
      status: order.status || "Pending",
    });

    setShowEditModal(true);
  };

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // UPDATE ORDER
  // ==========================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editForm.customerName.trim()) {
      alert("Customer name is required.");
      return;
    }

    if (!editForm.address.trim()) {
      alert("Address is required.");
      return;
    }

    if (!editForm.phone.trim()) {
      alert("Phone number is required.");
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(
        `${API_URL}/api/orders/${editForm._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName: editForm.customerName,
            address: editForm.address,
            phone: editForm.phone,
            totalPrice: Number(editForm.totalPrice),
            status: editForm.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order"
        );
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === editForm._id
            ? {
                ...order,
                customerName: editForm.customerName,
                address: editForm.address,
                phone: editForm.phone,
                totalPrice: Number(editForm.totalPrice),
                status: editForm.status,
              }
            : order
        )
      );

      setShowEditModal(false);
    } catch (err) {
      console.error("Update Order Error:", err);

      alert(
        err.message || "Order update error occurred."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // ==========================================
  // DELETE ORDER
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/api/orders/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== id)
      );
    } catch (err) {
      console.error("Delete Order Error:", err);

      alert("Order deletion failed.");
    }
  };

  // ==========================================
  // STATUS BADGE
  // ==========================================

  const getStatusBadge = (status = "Pending") => {
    switch (String(status).toLowerCase()) {
      case "delivered":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      case "processing":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "cancelled":
        return "border-rose-200 bg-rose-50 text-rose-700";

      default:
        return "border-amber-200 bg-amber-50 text-amber-700";
    }
  };

  // ==========================================
  // PRODUCTS
  // ==========================================

  const renderProducts = (products) => {
    if (!products || products.length === 0) {
      return (
        <span className="text-[10px] text-slate-400">
          No products
        </span>
      );
    }

    return products.map((product, productIndex) => (
      <div
        key={product._id || productIndex}
        className="flex min-w-0 items-center gap-1"
      >
        <span
          title={product.name}
          className="min-w-0 max-w-full truncate rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-700"
        >
          {product.name || "Product"}
        </span>

        <span className="shrink-0 text-[10px] font-bold text-slate-400">
          ×{product.quantity || 1}
        </span>
      </div>
    ));
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
        <Sidebar />
      </aside>

      {/* ======================================
          MAIN AREA
      ====================================== */}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* NAVBAR */}

        <header className="z-20 w-full shrink-0 border-b border-slate-200 bg-white shadow-sm">
          <Navbar />
        </header>

        {/* ====================================
            MAIN CONTENT
        ==================================== */}

        <main className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5">

          <div className="mx-auto w-full max-w-[1600px]">

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              {/* =================================
                  HEADER
              ================================= */}

              <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5 sm:py-4">

                <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <ShoppingCart size={17} />
                  </div>

                  <div className="min-w-0">

                    <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                      Orders
                    </h2>

                    <p className="hidden text-xs text-slate-500 sm:block">
                      Manage all customer orders
                    </p>

                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">

                  <span className="hidden text-xs font-medium text-slate-400 sm:block">
                    Total
                  </span>

                  <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600 sm:px-3">
                    {orders.length}
                  </span>

                </div>
              </div>

              {/* =================================
                  LOADING
              ================================= */}

              {loading && (
                <div className="flex min-h-60 flex-col items-center justify-center p-8 text-slate-500">

                  <Loader2 className="mb-2 h-6 w-6 animate-spin text-blue-600" />

                  <p className="text-sm font-medium">
                    Loading orders...
                  </p>

                </div>
              )}

              {/* =================================
                  ERROR
              ================================= */}

              {!loading && error && (
                <div className="flex min-h-60 flex-col items-center justify-center p-8 text-center text-rose-600">

                  <AlertCircle className="mb-2 h-6 w-6" />

                  <p className="max-w-md text-sm font-medium">
                    {error}
                  </p>

                  <button
                    onClick={refetchOrders}
                    className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                  >
                    Try Again
                  </button>

                </div>
              )}

              {/* =================================
                  EMPTY
              ================================= */}

              {!loading &&
                !error &&
                orders.length === 0 && (
                  <div className="flex min-h-60 items-center justify-center p-8">

                    <div className="text-center">

                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <ShoppingCart size={20} />
                      </div>

                      <p className="text-sm font-medium text-slate-600">
                        No orders found
                      </p>

                    </div>
                  </div>
                )}

              {/* =================================
                  TABLE
                  768px+
              ================================= */}

              {!loading &&
                !error &&
                orders.length > 0 && (
                  <div className="hidden md:block">

                    <table className="w-full table-fixed border-collapse text-left">

                      <thead className="border-b border-slate-200 bg-slate-50">

                        <tr>

                          <th className="w-[5%] px-2 py-3 text-center text-[9px] font-bold uppercase tracking-wide text-slate-500 lg:px-2.5 lg:text-[10px]">
                            #
                          </th>

                          <th className="w-[13%] px-2 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-500 lg:px-3 lg:text-[10px]">
                            Customer
                          </th>

                          <th className="w-[17%] px-2 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-500 lg:px-3 lg:text-[10px]">
                            Address
                          </th>

                          <th className="w-[12%] px-2 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-500 lg:px-3 lg:text-[10px]">
                            Phone
                          </th>

                          <th className="w-[19%] px-2 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-500 lg:px-3 lg:text-[10px]">
                            Products & Qty
                          </th>

                          <th className="w-[11%] px-2 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-500 lg:px-3 lg:text-[10px]">
                            Total
                          </th>

                          <th className="w-[10%] px-2 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-500 lg:px-3 lg:text-[10px]">
                            Status
                          </th>

                          <th className="w-[13%] px-2 py-3 text-center text-[9px] font-bold uppercase tracking-wide text-slate-500 lg:px-3 lg:text-[10px]">
                            Actions
                          </th>

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-slate-100">

                        {orders.map((order, index) => (

                          <tr
                            key={order._id || index}
                            className="group transition-colors hover:bg-slate-50"
                          >

                            {/* NUMBER */}

                            <td className="px-2 py-3 text-center lg:px-2.5">

                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-medium text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600">
                                {index + 1}
                              </span>

                            </td>

                            {/* CUSTOMER */}

                            <td className="min-w-0 px-2 py-3 lg:px-3">

                              <p
                                title={order.customerName}
                                className="truncate text-[10px] font-semibold text-slate-900 lg:text-xs"
                              >
                                {order.customerName || "N/A"}
                              </p>

                            </td>

                            {/* ADDRESS */}

                            <td className="min-w-0 px-2 py-3 lg:px-3">

                              <p
                                title={order.address}
                                className="truncate text-[10px] text-slate-600 lg:text-xs"
                              >
                                {order.address || "N/A"}
                              </p>

                            </td>

                            {/* PHONE */}

                            <td className="min-w-0 px-2 py-3 lg:px-3">

                              <span
                                title={order.phone}
                                className="block truncate rounded bg-slate-100 px-1.5 py-1 font-mono text-[9px] font-medium text-slate-600 lg:text-[10px]"
                              >
                                {order.phone || "N/A"}
                              </span>

                            </td>

                            {/* PRODUCTS */}

                            <td className="min-w-0 px-2 py-3 lg:px-3">

                              <div className="flex max-h-14 min-w-0 flex-col gap-1 overflow-hidden">
                                {renderProducts(order.products)}
                              </div>

                            </td>

                            {/* TOTAL */}

                            <td className="px-2 py-3 lg:px-3">

                              <span className="inline-block whitespace-nowrap rounded border border-emerald-100 bg-emerald-50 px-1.5 py-1 text-[9px] font-bold text-emerald-700 lg:px-2 lg:text-[10px]">
                                Rs.{" "}
                                {Number(
                                  order.totalPrice || 0
                                ).toLocaleString()}
                              </span>

                            </td>

                            {/* STATUS */}

                            <td className="px-2 py-3 lg:px-3">

                              <span
                                className={`inline-block whitespace-nowrap rounded-full border px-1.5 py-1 text-[9px] font-semibold capitalize lg:px-2 lg:text-[10px] ${getStatusBadge(
                                  order.status
                                )}`}
                              >
                                {order.status || "Pending"}
                              </span>

                            </td>

                            {/* ACTIONS */}

                            <td className="px-1.5 py-3 lg:px-2">

                              <div className="flex items-center justify-center gap-1">

                                <button
                                  onClick={() =>
                                    handleEdit(order)
                                  }
                                  title="Edit order"
                                  className="flex h-7 items-center gap-1 rounded border border-blue-200 bg-blue-50 px-1.5 text-[9px] font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white lg:px-2 lg:text-[10px]"
                                >

                                  <Pencil size={10} />

                                  <span className="hidden xl:inline">
                                    Edit
                                  </span>

                                </button>

                                <button
                                  onClick={() =>
                                    handleDelete(order._id)
                                  }
                                  title="Delete order"
                                  className="flex h-7 items-center gap-1 rounded border border-red-200 bg-red-50 px-1.5 text-[9px] font-semibold text-red-600 transition hover:bg-red-600 hover:text-white lg:px-2 lg:text-[10px]"
                                >

                                  <Trash2 size={10} />

                                  <span className="hidden xl:inline">
                                    Delete
                                  </span>

                                </button>

                              </div>

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>
                )}

              {/* =================================
                  MOBILE CARDS
                  < 768px
              ================================= */}

              {!loading &&
                !error &&
                orders.length > 0 && (
                  <div className="space-y-3 bg-slate-50 p-3 md:hidden">

                    {orders.map((order, index) => (

                      <div
  key={order._id || index}
  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
>

                        {/* CARD HEADER */}

                        <div className="flex items-start justify-between gap-3">

                          <div className="flex min-w-0 items-center gap-2.5">

                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                              {index + 1}
                            </span>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-bold text-slate-900">
                                {order.customerName ||
                                  "Unknown Customer"}
                              </p>

                              <p className="mt-0.5 truncate text-[11px] text-slate-500">
                                {order.phone || "No phone"}
                              </p>

                            </div>

                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold capitalize ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {order.status || "Pending"}
                          </span>

                        </div>

                        {/* ADDRESS */}

                        <div className="mt-4">

                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Address
                          </p>

                          <p className="wrap-break-word text-xs leading-5 text-slate-600">
                            {order.address || "No address"}
                          </p>

                        </div>

                        {/* PRODUCTS */}

                        <div className="mt-4">

                          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Products
                          </p>

                          <div className="flex flex-col gap-1.5">

                            {order.products?.map(
                              (product, productIndex) => (

                                <div
                                  key={
                                    product._id ||
                                    productIndex
                                  }
                                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2"
                                >

                                  <span className="min-w-0 truncate text-xs font-medium text-slate-700">
                                    {product.name ||
                                      "Product"}
                                  </span>

                                  <span className="shrink-0 text-xs font-bold text-slate-500">
                                    ×{product.quantity || 1}
                                  </span>

                                </div>

                              )
                            )}

                          </div>

                        </div>

                        {/* CARD FOOTER */}

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">

                          <div>

                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                              Total
                            </p>

                            <p className="mt-0.5 text-sm font-bold text-emerald-700">
                              Rs.{" "}
                              {Number(
                                order.totalPrice || 0
                              ).toLocaleString()}
                            </p>

                          </div>

                          <div className="flex items-center gap-2">

                            <button
                              onClick={() =>
                                handleEdit(order)
                              }
                              className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                            >
                              <Pencil size={12} />
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(order._id)
                              }
                              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>
                )}

            </div>
          </div>
        </main>
      </div>

      {/* ======================================
          EDIT MODAL
      ====================================== */}

      {showEditModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 px-3 py-4 backdrop-blur-sm sm:px-4"
          onClick={() => {
            if (!isUpdating) {
              setShowEditModal(false);
            }
          }}
        >

          <div
            className="my-auto max-h-[95vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-6">

              <div className="min-w-0">

                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  Edit Order
                </h2>

                <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
                  Update customer information
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                disabled={isUpdating}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={17} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleUpdate}
              className="space-y-4 p-4 sm:p-6"
            >

              {/* CUSTOMER NAME */}

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Customer Name
                </label>

                <input
                  type="text"
                  name="customerName"
                  value={editForm.customerName}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />

              </div>

              {/* ADDRESS */}

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Address
                </label>

                <textarea
                  name="address"
                  rows={3}
                  value={editForm.address}
                  onChange={handleEditChange}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />

              </div>

              {/* PHONE */}

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />

              </div>

              {/* TOTAL */}

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Total Price (Rs.)
                </label>

                <input
                  type="number"
                  name="totalPrice"
                  value={editForm.totalPrice}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />

              </div>

              {/* STATUS */}

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Order Status
                </label>

                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Processing">
                    Processing
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end sm:gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowEditModal(false)
                  }
                  disabled={isUpdating}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >

                  {isUpdating && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}

                  {isUpdating
                    ? "Saving..."
                    : "Save Changes"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}
    </div>
  );
}

export default Dashboard;

