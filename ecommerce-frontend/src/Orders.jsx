import { useEffect, useState } from "react";
import { RefreshCw, Package } from "lucide-react";

const API_BASE_URL =
  "https://amora-backend-lake.vercel.app";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadCustomerOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const orderIds = JSON.parse(
          localStorage.getItem(
            "customerOrderIds"
          ) || "[]"
        );

        if (orderIds.length === 0) {
          if (!cancelled) {
            setOrders([]);
            setLoading(false);
          }
          return;
        }

        const responses = await Promise.all(
          orderIds.map((id) =>
            fetch(
              `${API_BASE_URL}/api/orders/customer/${id}`
            )
          )
        );

        const orderData =
          await Promise.all(
            responses
              .filter(
                (response) =>
                  response.ok
              )
              .map((response) =>
                response.json()
              )
          );

        if (!cancelled) {
          setOrders(
            orderData.sort(
              (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
            )
          );
        }
      } catch (error) {
        console.error(
          "Customer Orders Error:",
          error
        );

        if (!cancelled) {
          setError(
            "Unable to load your orders."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCustomerOrders();

    return () => {
      cancelled = true;
    };
  }, []);

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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">

      <div className="mx-auto max-w-7xl">

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Orders
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View your order history and status
            </p>
          </div>

          <div className="w-fit rounded-xl bg-orange-50 px-4 py-2">
            <span className="text-sm font-bold text-orange-600">
              {orders.length} Orders
            </span>
          </div>

        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white px-5 py-14 text-center shadow-lg">

            <Package
              size={55}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 text-lg font-bold text-gray-700">
              No Orders Found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your orders will appear here.
            </p>

          </div>
        ) : (
          <div className="space-y-5">

            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl bg-white p-4 shadow-lg sm:p-6"
              >

                <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-xs text-gray-400">
                      Order ID
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-gray-700">
                      #{order._id}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">

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

                  </div>

                </div>

                <div className="grid gap-5 py-5 md:grid-cols-3">

                  <div>
                    <p className="text-xs font-semibold text-gray-400">
                      Customer
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {order.customerName}
                    </p>

                    <p className="mt-1 break-all text-xs text-gray-500">
                      {order.customerEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-400">
                      Delivery
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {order.address}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {order.city}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {order.phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-400">
                      Payment
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {order.paymentMethod ||
                        "Cash on Delivery"}
                    </p>

                    <p className="mt-3 text-xs font-semibold text-gray-400">
                      Total
                    </p>

                    <p className="mt-1 font-bold text-orange-500">
                      PKR{" "}
                      {Number(
                        order.totalPrice
                      ).toLocaleString()}
                    </p>
                  </div>

                </div>

                <div className="border-t pt-4">

                  <p className="mb-3 text-sm font-bold text-gray-800">
                    Products
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                    {order.products?.map(
                      (product, index) => (
                        <div
                          key={`${product.name}-${index}`}
                          className="flex items-center gap-3 rounded-xl bg-gray-50 p-3"
                        >

                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
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
                              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                N/A
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-800">
                              {product.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              Qty:{" "}
                              {product.quantity}
                            </p>

                            <p className="text-xs font-semibold text-orange-500">
                              PKR{" "}
                              {Number(
                                product.price
                              ).toLocaleString()}
                            </p>
                          </div>

                        </div>
                      )
                    )}

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Orders;