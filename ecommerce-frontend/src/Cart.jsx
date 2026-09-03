import { useContext } from "react";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalPrice,
  } = useContext(CartContext);

  // =====================================================
  // IMAGE URL HELPER
  // =====================================================

  const getImageUrl = (item) => {
    if (!item) return "";

    // Cart mein image already available
    if (item.image) {
      return item.image;
    }

    // Backend se images array aa rahi ho
    if (
      Array.isArray(item.images) &&
      item.images.length > 0
    ) {
      return item.images[0];
    }

    return "";
  };

  // Empty Cart
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Your Cart is Empty
          </h1>

          <p className="text-gray-500 mt-2">
            Add some products to your cart.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-5 px-6">

      <a
        href="/"
        className="inline-flex items-center px-3.5 py-2.5 ml-6
        bg-gray-400 text-white rounded-lg
        font-medium text-[14px]
        hover:bg-gray-900
        transition-all duration-200 shadow-sm"
      >
        ← Back to Dashboard
      </a>

      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <h1 className="text-3xl font-bold pt-6 text-gray-800 mb-4">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Products */}
          <div className="lg:col-span-2 space-y-5">

            {cart.map((item) => {
              // Convert price safely
              const price =
                typeof item.price === "string"
                  ? Number(
                      item.price
                        .replace("PKR", "")
                        .replace(/,/g, "")
                        .trim()
                    )
                  : Number(item.price);

              const productTotal = price * item.quantity;

              return (
                <div
                  key={item.name}
                  className="bg-white rounded-xl shadow-md p-5"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                    {/* Left Section: Image & Details */}
                    <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">

                      {/* Image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-100">
                        <img
                          src={getImageUrl(item)}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                          {item.category}
                        </p>

                        <h2 className="text-base font-bold text-gray-800 truncate">
                          {item.name}
                        </h2>

                        <p className="text-gray-500 text-sm mt-0.5">
                          {item.price}
                        </p>
                      </div>

                    </div>

                    {/* Center Section: Quantity Controls */}
                    <div className="flex items-center pr-25 gap-2 justify-center px-4 w-full sm:w-auto">

                      <span className="text-xs font-semibold text-gray-500 mr-1">
                        Qty:
                      </span>

                      <button
                        onClick={() =>
                          decreaseQuantity(item.name)
                        }
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center transition cursor-pointer"
                      >
                        −
                      </button>

                      <span className="font-bold text-sm text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(item.name)
                        }
                        className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center justify-center transition cursor-pointer"
                      >
                        +
                      </button>

                    </div>

                    {/* Right Section: Product Total & Remove */}
                    <div className="text-right flex flex-col justify-center items-end w-full sm:w-auto">

                      <p className="text-[11px] text-gray-400 font-medium uppercase">
                        Total
                      </p>

                      <p className="text-base sm:text-lg font-bold text-gray-900">
                        PKR {productTotal.toLocaleString()}
                      </p>

                      <button
                        onClick={() =>
                          removeFromCart(item.name)
                        }
                        className="text-red-500 text-xs font-semibold hover:text-red-700 mt-1 transition cursor-pointer"
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6 h-fit">

            <h2 className="text-[21px] font-bold mb-1">
              Order Summary
            </h2>

            {/* Total Items */}
            <div className="flex justify-between mb-2">

              <span className="text-gray-600">
                Total Items
              </span>

              <span className="font-bold">
                {cart.reduce(
                  (total, item) =>
                    total + item.quantity,
                  0
                )}
              </span>

            </div>

            {/* Total Price */}
            <div className="border-t pt-2 space-y-1.5">

              {/* Subtotal */}
              <div className="flex justify-between">

                <span className="text-[17px] font-semibold text-gray-700">
                  Subtotal
                </span>

                <span className="text-[15px] font-semibold text-gray-900">
                  PKR {totalPrice.toLocaleString()}
                </span>

              </div>

              {/* Delivery Charges */}
              <div className="flex justify-between">

                <span className="text-[17px] font-semibold text-gray-700">
                  Delivery
                </span>

                <span className="text-[15px] font-semibold text-gray-900">
                  PKR 500
                </span>

              </div>

              {/* Final Total */}
              <div className="flex justify-between border-t pt-2.5">

                <span className="text-[20px] font-bold text-gray-900">
                  Total
                </span>

                <span className="text-[16px] font-bold text-orange-500">
                  PKR{" "}
                  {(totalPrice + 500).toLocaleString()}
                </span>

              </div>

            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="
                mt-3
                w-full
                rounded-xl
                bg-orange-500
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-orange-600
                cursor-pointer
              "
            >
              CHECKOUT
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;