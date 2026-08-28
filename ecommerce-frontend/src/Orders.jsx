import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCw,
} from "lucide-react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/orders"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        if (!cancelled) {
          setOrders(data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Fetch Orders Error:", error);
          setError(
            "Unable to load orders. Please check your backend."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, []);

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
        `http://localhost:5000/api/orders/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete order"
        );
      }

      setOrders((previousOrders) =>
        previousOrders.filter(
          (order) => order._id !== id
        )
      );
    } catch (error) {
      console.error("Delete Order Error:", error);

      alert(
        error.message || "Failed to delete order"
      );
    }
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleEdit = (order) => {
    setEditingOrder({
      ...order,
    });
  };

  // ==========================================
  // UPDATE ORDER
  // ==========================================

  const handleUpdate = async () => {
    if (!editingOrder) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${editingOrder._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            customerName:
              editingOrder.customerName,

            address: editingOrder.address,

            phone: editingOrder.phone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order"
        );
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === editingOrder._id
            ? data.order
            : order
        )
      );

      setEditingOrder(null);
    } catch (error) {
      console.error("Update Order Error:", error);

      alert(
        error.message || "Failed to update order"
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

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

  // ==========================================
  // ERROR
  // ==========================================

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
    <div className="p-6">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold text-gray-900">
            Customer Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all customer orders
          </p>

        </div>

        <div className="rounded-xl bg-orange-50 px-4 py-2">

          <span className="text-sm font-bold text-orange-600">
            {orders.length} Orders
          </span>

        </div>

      </div>

      {/* ========================================
          ORDERS TABLE
      ======================================== */}

      <div className="overflow-x-auto rounded-2xl bg-white shadow-lg">

        <table className="w-full min-w-full">

          {/* TABLE HEADER */}

          <thead className="bg-gray-900 text-white">

            <tr>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Customer
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Address
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Phone
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Product
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Quantity
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Total Price
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Actions
              </th>

            </tr>

          </thead>

          {/* TABLE BODY */}

          <tbody>

            {orders.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="px-5 py-14 text-center"
                >

                  <div className="text-gray-400">

                    <p className="text-lg font-semibold">
                      No Orders Found
                    </p>

                    <p className="mt-1 text-sm">
                      Customer orders will appear here.
                    </p>

                  </div>

                </td>

              </tr>

            ) : (

              orders.map((order) => (

                <tr
                  key={order._id}
                  className="
                    border-b
                    border-gray-100
                    transition
                    hover:bg-gray-50
                  "
                >

                  {/* CUSTOMER */}

                  <td className="px-5 py-4">

                    <p className="font-semibold text-gray-900">
                      {order.customerName}
                    </p>

                  </td>

                  {/* ADDRESS */}

                  <td className="max-w-xs px-5 py-4">

                    <p className="truncate text-sm text-gray-600">
                      {order.address}
                    </p>

                  </td>

                  {/* PHONE */}

                  <td className="px-5 py-4">

                    <span className="text-sm text-gray-600">
                      {order.phone}
                    </span>

                  </td>

                  {/* PRODUCTS */}

                  <td className="px-5 py-4">

                    <div className="space-y-3">

                      {order.products?.map(
                        (product, index) => (

                          <div
                            key={`${product.name}-${index}`}
                            className="flex items-center gap-3"
                          >

                            {/* IMAGE */}

                            <div className="
                              h-10
                              w-10
                              shrink-0
                              overflow-hidden
                              rounded-lg
                              bg-gray-100
                            ">

                              {product.image ? (

                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="
                                    h-full
                                    w-full
                                    object-contain
                                  "
                                />

                              ) : (

                                <div className="
                                  flex
                                  h-full
                                  w-full
                                  items-center
                                  justify-center
                                  text-xs
                                  text-gray-400
                                ">
                                  N/A
                                </div>

                              )}

                            </div>

                            {/* NAME */}

                            <span className="
                            max-w-sm
                              truncate
                              text-sm
                              font-medium
                              text-gray-800
                            ">
                              {product.name}
                            </span>

                          </div>

                        )
                      )}

                    </div>

                  </td>

                  {/* QUANTITY */}

                  <td className="px-5 py-4">

                    <div className="space-y-3">

                      {order.products?.map(
                        (product, index) => (

                          <div
                            key={`${product.name}-qty-${index}`}
                            className="
                              flex
                              h-10
                              items-center
                              text-sm
                              font-bold
                              text-gray-700
                            "
                          >
                            {product.quantity}
                          </div>

                        )
                      )}

                    </div>

                  </td>

                  {/* TOTAL */}

                  <td className="px-5 py-4">

                    <span className="
                      whitespace-nowrap
                      font-bold
                      text-orange-500
                    ">
                      PKR{" "}
                      {Number(
                        order.totalPrice
                      ).toLocaleString()}
                    </span>

                  </td>

                  {/* ACTIONS */}

                  <td className="px-5 py-4">

                    <div className="flex gap-2">

                      {/* EDIT */}

                      <button
                        onClick={() =>
                          handleEdit(order)
                        }
                        title="Edit Order"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          bg-blue-50
                          text-blue-600
                          transition
                          hover:bg-blue-600
                          hover:text-white
                        "
                      >

                        <Pencil size={16} />

                      </button>

                      {/* DELETE */}

                      <button
                        onClick={() =>
                          handleDelete(order._id)
                        }
                        title="Delete Order"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          bg-red-50
                          text-red-600
                          transition
                          hover:bg-red-600
                          hover:text-white
                        "
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

      {/* ========================================
          EDIT MODAL
      ======================================== */}

      {editingOrder && (

        <div className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-black/50
          px-4
        ">

          <div className="
            w-full
            max-w-lg
            rounded-2xl
            bg-white
            p-6
            shadow-2xl
          ">

            {/* MODAL HEADER */}

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Edit Customer Order
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Update customer information
                </p>

              </div>

              <button
                onClick={() =>
                  setEditingOrder(null)
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  text-gray-400
                  transition
                  hover:bg-gray-100
                  hover:text-gray-700
                "
              >

                <X size={20} />

              </button>

            </div>

            {/* CUSTOMER NAME */}

            <div className="mt-6">

              <label className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-700
              ">
                Customer Name
              </label>

              <input
                type="text"
                value={editingOrder.customerName}
                onChange={(e) =>
                  setEditingOrder({
                    ...editingOrder,
                    customerName: e.target.value,
                  })
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-orange-500
                  focus:bg-white
                "
              />

            </div>

            {/* ADDRESS */}

            <div className="mt-4">

              <label className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-700
              ">
                Address
              </label>

              <textarea
                value={editingOrder.address}
                onChange={(e) =>
                  setEditingOrder({
                    ...editingOrder,
                    address: e.target.value,
                  })
                }
                rows="3"
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-orange-500
                  focus:bg-white
                "
              />

            </div>

            {/* PHONE */}

            <div className="mt-4">

              <label className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-700
              ">
                Phone Number
              </label>

              <input
                type="text"
                value={editingOrder.phone}
                onChange={(e) =>
                  setEditingOrder({
                    ...editingOrder,
                    phone: e.target.value,
                  })
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-orange-500
                  focus:bg-white
                "
              />

            </div>

            {/* MODAL BUTTONS */}

            <div className="mt-6 flex gap-3">

              <button
                onClick={() =>
                  setEditingOrder(null)
                }
                className="
                  flex-1
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  py-3
                  text-sm
                  font-bold
                  text-gray-700
                  transition
                  hover:bg-gray-50
                "
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-orange-500
                  py-3
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-orange-600
                "
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

export default Orders;