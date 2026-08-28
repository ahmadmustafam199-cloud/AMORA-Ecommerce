import { useState } from "react";
import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Phone,
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
  Mail,
} from "lucide-react";
import { useCart } from "./useCart";

function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    totalPrice,
    clearCart,
  } = useCart();

 const [formData, setFormData] = useState({
  customerName: "",
  customerEmail: "",  
  address: "",
  phone: "",
});

  const [loading, setLoading] = useState(false);

  const deliveryCharges = 500;
  const finalTotal = totalPrice + deliveryCharges;

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const products = cart.map((item) => {
        const price =
          typeof item.price === "string"
            ? Number(
                item.price
                  .replace("PKR", "")
                  .replace(/,/g, "")
                  .trim()
              )
            : Number(item.price);

        return {
          name: item.name,
          price,
          quantity: item.quantity,
          image: item.image || "",
        };
      });

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

         body: JSON.stringify({
  customerName: formData.customerName,
  customerEmail: formData.customerEmail, // <- Yeh missing tha
  address: formData.address,
  phone: formData.phone,
  products,
  deliveryCharges,
  totalPrice: finalTotal,
}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order"
        );
      }

      // Empty cart
      clearCart();

      // Go to success
      navigate("/order-success");
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "Something went wrong while placing order."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">

          <ShoppingBag
            size={55}
            className="mx-auto text-gray-300"
          />

          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Your Cart is Empty
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Add some products before checkout.
          </p>

          <button
            onClick={() => navigate("/")}
            className="
              mt-6
              rounded-xl
              bg-orange-500
              px-6
              py-3
              text-sm
              font-bold
              text-white
              transition
              hover:bg-orange-600
              
            "
          >
            Continue Shopping
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">

      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <button
          onClick={() => navigate("/cart")}
          className="
            cursor-pointer
            mb-6
            flex
            items-center
            gap-1
            text-[15px]
            font-semibold
            text-gray-600
            transition
            hover:text-orange-500
          "
        >
          <ArrowLeft  size={18} />
          Back to Cart
        </button>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* =====================================
              CUSTOMER FORM
          ====================================== */}

          <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-lg">

            <div className="mb-6">

              <h1 className="text-2xl font-bold text-gray-900">
                Checkout
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Enter your delivery information
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Name */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      py-3
                      pl-10
                      pr-4
                      text-sm
                      outline-none
                      transition
                      focus:border-orange-500
                      focus:bg-white
                    "
                  />

                </div>

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                 <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
                 />

                </div>

              </div>

              {/* Phone */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="03XXXXXXXXX"
                    required
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      py-3
                      pl-10
                      pr-4
                      text-sm
                      outline-none
                      transition
                      focus:border-orange-500
                      focus:bg-white
                    "
                  />

                </div>

              </div>


              {/* Address */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Delivery Address
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="
                      absolute
                      left-3
                      top-4
                      text-gray-400
                    "
                  />

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your complete address"
                    required
                    rows="4"
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      py-3
                      pl-10
                      pr-4
                      text-sm
                      outline-none
                      transition
                      focus:border-orange-500
                      focus:bg-white
                    "
                  />

                </div>

               <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  City
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="
                      absolute
                      left-3
                      top-4
                      text-gray-400
                    "
                  />

                  <input
                    type="text"
                    name="City"
                    value={formData.City}
                    onChange={handleChange}
                    placeholder="Enter your City"
                    required
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      py-3
                      pl-10
                      pr-4
                      text-sm
                      mb-2
                      outline-none
                      transition
                      focus:border-orange-500
                      focus:bg-white
                    "
                  />

                </div>

               <div className="relative">
  <label className="text-sm font-semibold text-gray-700">
    Payment Method
  </label>

  <CreditCard
    size={18}
    className="absolute left-3 top-9 text-gray-900"
  />

  <select
    name="paymentMethod"
    value={formData.paymentMethod}
    onChange={handleChange}
    required
    className="
      w-full
      rounded-xl
      border
      border-gray-200
      bg-gray-50
      py-3
      pl-10
      pr-4
      text-sm
      outline-none
      transition
      focus:border-orange-500
      focus:bg-white
    "
  >
    <option value="">Select Payment Method</option>
    <option value="Cash on Delivery">Cash on Delivery</option>
  </select>
</div>
              </div>

            </div>
              
             {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-orange-500
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-orange-200
                  transition
                  hover:bg-orange-600
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  cursor-pointer
                "
              >
                {loading ? (
                  "Placing Order..."
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Place Order
                  </>
                )}
              </button>

            </form>

          </div>

          {/* =====================================
              ORDER SUMMARY
          ====================================== */}

          <div className="h-fit rounded-2xl bg-white p-6 shadow-lg">

            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            {/* Products */}
            <div className="mt-5 space-y-4">

              {cart.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3"
                >

                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />

                    <span className="absolute right-0 top-0 rounded-bl-md bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {item.quantity}
                    </span>

                  </div>

                  <div className="min-w-0 flex-1">

                    <h3 className="truncate text-sm font-bold text-gray-800">
                      {item.name}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {item.price}
                    </p>

                  </div>

                </div>
              ))}

            </div>

            {/* Price */}
            <div className="mt-6 space-y-3 border-t pt-5">

              <div className="flex justify-between">

                <span className="text-sm text-gray-600">
                  Subtotal
                </span>

                <span className="text-sm font-semibold">
                  PKR {totalPrice.toLocaleString()}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-sm text-gray-600">
                  Delivery
                </span>

                <span className="text-sm font-semibold">
                  PKR 500
                </span>

              </div>

              <div className="flex justify-between border-t pt-4">

                <span className="text-lg font-bold">
                  Total
                </span>

                <span className="text-lg font-bold text-orange-500">
                  PKR {finalTotal.toLocaleString()}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;