import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  "https://amora-backend-lake.vercel.app";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid Email or Password"
        );
      }

      localStorage.setItem(
        "adminToken",
        data.token
      );

      localStorage.setItem(
        "adminLogin",
        "true"
      );

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.message ||
          "Unable to login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <h2 className="mb-2 text-center font-serif text-3xl font-extrabold tracking-wide text-cyan-600">
          Admin Login
        </h2>

        <p className="mb-7 text-center text-sm text-gray-400">
          Welcome back! Please login to continue.
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-6"
        >

          <div>
            <label className="mb-2 block font-serif text-sm font-bold text-cyan-600">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="
                w-full
                rounded-xl
                border border-gray-200
                bg-white
                px-4
                py-3.5
                text-gray-700
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-4
                focus:ring-cyan-500/20
              "
            />
          </div>

          <div>
            <label className="mb-2 block font-serif text-sm font-bold text-cyan-600">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              className="
                w-full
                rounded-xl
                border border-gray-200
                bg-white
                px-4
                py-3.5
                text-gray-700
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-4
                focus:ring-cyan-500/20
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              cursor-pointer
              rounded-xl
              bg-cyan-600
              py-3.5
              font-serif
              font-bold
              tracking-wide
              text-white
              shadow-lg
              shadow-cyan-500/30
              transition
              hover:bg-cyan-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AdminLogin;