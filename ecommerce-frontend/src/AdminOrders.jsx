import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL =
  "https://amora-backend-lake.vercel.app";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingOrder, setEditingOrder] =
    useState(null);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem(
      "adminToken"
    )}`,
  });

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/orders`,
        {
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch orders"
        );
      }

      setOrders(data);
    } catch (error) {
      console.error(
        "Admin Orders Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load orders"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // The function synchronizes component state
    // with the external orders API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders();
  }, [loadOrders]);

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this order?"
      );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orders/${id}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete order"
        );
      }

      setOrders((previous) =>
        previous.filter(
          (order) =>
            order._id !== id
        )
      );
    } catch (error) {
      alert(
        error.message ||
          "Failed to delete order"
      );
    }
  };

  const handleUpdate = async () => {
    if (!editingOrder) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orders/${editingOrder._id}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(
            editingOrder
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update order"
        );
      }

      setOrders((previous) =>
        previous.map((order) =>
          order._id ===
          editingOrder._id
            ? data.order
            : order
        )
      );

      setEditingOrder(null);
    } catch (error) {
      alert(
        error.message ||
          "Failed to update order"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw
            size={22}
            className="animate-spin"
          />

          <span className="font-semibold">
            Loading Orders...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <h2 className="text-xl font-bold text-red-500">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Customer Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all customer orders
          </p>
        </div>

        <div className="w-fit rounded-xl bg-orange-50 px-4 py-2">
          <span className="text-sm font-bold text-orange-600">
            {orders.length} Orders
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-lg">
        <table className="w-full min-w-225">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-5 py-4 text-left text-sm">
                Customer
              </th>

              <th className="px-5 py-4 text-left text-sm">
                Address
              </th>

              <th className="px-5 py-4 text-left text-sm">
                Phone
              </th>

              <th className="px-5 py-4 text-left text-sm">
                Products
              </th>

              <th className="px-5 py-4 text-left text-sm">
                Total
              </th>

              <th className="px-5 py-4 text-left text-sm">
                Status
              </th>

              <th className="px-5 py-4 text-left text-sm">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-5 py-14 text-center text-gray-400"
                >
                  No Orders Found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">
                      {order.customerName}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {order.customerEmail}
                    </p>
                  </td>

                  <td className="max-w-xs px-5 py-4">
                    <p className="text-sm text-gray-600">
                      {order.address}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {order.city}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {order.phone}
                  </td>

                  <td className="px-5 py-4">
                    <div className="space-y-2">
                      {order.products?.map(
                        (product, index) => (
                          <div
                            key={`${product.name}-${index}`}
                            className="flex items-center gap-2"
                          >
                            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                              {product.image ? (
                                <img
                                  src={
                                    product.image
                                  }
                                  alt={
                                    product.name
                                  }
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                                  N/A
                                </div>
                              )}
                            </div>

                            <div>
                              <p className="max-w-45 truncate text-xs font-semibold">
                                {product.name}
                              </p>

                              <p className="text-[11px] text-gray-500">
                                Qty:{" "}
                                {product.quantity}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4 font-bold text-orange-500">
                    PKR{" "}
                    {Number(
                      order.totalPrice
                    ).toLocaleString()}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-bold
                        ${
                          order.status ===
                          "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status ===
                              "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : order.status ===
                              "Processing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                        }
                      `}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setEditingOrder({
                            ...order,
                          })
                        }
                        title="Edit Order"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            order._id
                          )
                        }
                        title="Delete Order"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Customer Order
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Update order information
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingOrder(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Customer Name
                </label>

                <input
                  value={
                    editingOrder.customerName ||
                    ""
                  }
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      customerName:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Address
                </label>

                <textarea
                  rows="3"
                  value={
                    editingOrder.address ||
                    ""
                  }
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      address:
                        e.target.value,
                    })
                  }
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Phone
                </label>

                <input
                  value={
                    editingOrder.phone ||
                    ""
                  }
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      phone:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Status
                </label>

                <select
                  value={
                    editingOrder.status ||
                    "Pending"
                  }
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      status:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-500"
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
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() =>
                  setEditingOrder(null)
                }
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-600"
              >
                <Save size={17} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;