import { CheckCircle, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle
            size={45}
            className="text-green-500"
          />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Thank you for your order. Your order has been received.
        </p>

        <button
          onClick={() => navigate("/")}
          className="
            mt-6
            flex
            w-full
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
            cursor-pointer
          "
        >
          <ShoppingBag size={18} />
          Continue Shopping
        </button>

      </div>

    </div>
  );
}

export default OrderSuccess;