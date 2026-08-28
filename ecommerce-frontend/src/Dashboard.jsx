import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { ShoppingCart } from "lucide-react";

function Dashboard() {
  const [orders, setOrders] = useState([]);

  // EDIT MODAL
  const [showEditModal, setShowEditModal] = useState(false);

  // EDIT FORM DATA
  const [editForm, setEditForm] = useState({
    _id: "",
    customerName: "",
    address: "",
    phone: "",
    totalPrice: "",
    status: "Pending", // Added Status
  });

  // ==============================
  // FETCH ORDERS
  // ==============================
  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Orders:", data);
        setOrders(data);
      })
      .catch((error) => {
        console.log("Orders Error:", error);
      });
  }, []);

  // ==============================
  // EDIT ORDER
  // ==============================
  const handleEdit = (order) => {
    setEditForm({
      _id: order._id,
      customerName: order.customerName || "",
      address: order.address || "",
      phone: order.phone || "",
      totalPrice: order.totalPrice || "",
      status: order.status || "Pending", // Set status
    });

    setShowEditModal(true);
  };

  // ==============================
  // INPUT CHANGE
  // ==============================
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // UPDATE ORDER
  // ==============================
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

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${editForm._id}`,
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
            status: editForm.status, // Send Status to API
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order");
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
      alert("Order updated successfully!");
    } catch (error) {
      console.log("Update Order Error:", error);
      alert("Order update nahi ho saka.");
    }
  };

  // ==============================
  // DELETE ORDER
  // ==============================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${id}`,
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
    } catch (error) {
      console.log("Delete Order Error:", error);
      alert("Order delete nahi ho saka.");
    }
  };

  // Status Badge Colors Helper
  const getStatusBadge = (status = "Pending") => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default: // Pending
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* ================= SIDEBAR ================= */}
      <div className="w-50 shrink-0 z-20 border-r border-slate-200 bg-white">
        <Sidebar />
      </div>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-10 w-full border-b border-slate-200 bg-white shadow-xs">
          <Navbar />
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto pt-15 p-6">
          {/* ================= ORDERS CARD ================= */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
            {/* CARD HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <ShoppingCart size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Orders</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Manage all customer orders
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">Total</span>
                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                  {orders.length}
                </span>
              </div>
            </div>

            {/* EMPTY STATE */}
            {orders.length === 0 ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <ShoppingCart size={20} />
                  </div>
                  <p className="text-sm font-medium text-slate-600">
                    No orders found
                  </p>
                </div>
              </div>
            ) : (
              /* ================= TABLE (No Horizontal Scroll) ================= */
              <div className="w-full overflow-hidden">
                <table className="w-full table-fixed text-left">
                  {/* TABLE HEAD WITH FIXED PERCENTAGES */}
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="w-[5%] px-2 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        #
                      </th>
                      <th className="w-[15%] px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Customer
                      </th>
                      <th className="w-[20%] px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Address
                      </th>
                      <th className="w-[13%] px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Phone
                      </th>
                      <th className="w-[18%] px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Products & Qty
                      </th>
                      <th className="w-[12%] px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Total
                      </th>
                      <th className="w-[10%] px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </th>
                      <th className="w-[12%] px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* TABLE BODY */}
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((order, index) => (
                      <tr
                        key={order._id}
                        className="group transition-all duration-150 hover:bg-slate-50/80"
                      >
                        <td className="px-2 py-3 text-center">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600">
                            {index + 1}
                          </span>
                        </td>

                        <td className="px-3 py-3">
                          <p
                            className="truncate text-xs font-semibold text-slate-900"
                            title={order.customerName}
                          >
                            {order.customerName}
                          </p>
                        </td>

                        <td className="px-3 py-3">
                          <p
                            title={order.address}
                            className="truncate text-xs text-slate-600"
                          >
                            {order.address}
                          </p>
                        </td>

                        <td className="px-3 py-3">
                          <span className="inline-block truncate rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-medium text-slate-600">
                            {order.phone}
                          </span>
                        </td>

                        <td className="px-3 py-3">
                          <div className="flex flex-col gap-1 max-h-16 overflow-y-auto">
                            {order.products?.map((product, productIndex) => (
                              <div
                                key={productIndex}
                                className="flex items-center gap-1"
                              >
                                <span className="truncate rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-700">
                                  {product.name || "Product"}
                                </span>
                                <span className="whitespace-nowrap text-[11px] font-bold text-slate-400">
                                  ×{product.quantity || 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="px-3 py-3">
                          <span className="inline-block whitespace-nowrap rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-100">
                            Rs.{order.totalPrice?.toLocaleString() || 0}
                          </span>
                        </td>

                        <td className="px-3 py-3">
                          <span
                            className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {order.status || "Pending"}
                          </span>
                        </td>

                        <td className="px-2 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleEdit(order)}
                              className="cursor-pointer rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(order._id)}
                              className="cursor-pointer rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ================= EDIT ORDER MODAL ================= */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-xs">
          <div className="w-full  max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 ">
              <div>
                <h2 className="text-lg font-bold pt-2 text-slate-900">
                  Edit Order
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Update customer information
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={editForm.customerName}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Address
                </label>
                <textarea
                  name="address"
                  value={editForm.address}
                  onChange={handleEditChange}
                  rows="3"
                  className="w-full resize-none rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Total Price
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    Rs.
                  </span>
                  <input
                    type="number"
                    name="totalPrice"
                    value={editForm.totalPrice}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* NEW STATUS SELECT FIELD */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Order Status
                </label>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700"
                >
                  Update Order
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