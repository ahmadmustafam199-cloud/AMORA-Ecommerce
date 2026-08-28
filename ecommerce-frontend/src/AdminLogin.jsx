import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary admin credentials
    if (email === "ahmad@gmail.com" && password === "@chisti*123") {
      localStorage.setItem("adminLogin", "true");
      navigate("/dashboard");
    } else {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-96 bg-white p-8 rounded-2xl shadow-lg">
       <h2 className="text-3xl font-extrabold font-serif text-center mb-2 text-cyan-600 tracking-wide">
  Admin Login
</h2>

<p className="text-center text-gray-400 text-sm mb-7">
  Welcome back! Please login to continue.
</p>

<form onSubmit={handleLogin} className="space-y-6">

  {/* Email */}
  <div className="relative">
    <label className="block mb-2 text-sm text-cyan-600 font-bold font-serif">
      Email Address
    </label>

    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500">
        ✉
      </span>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="
          w-full
          pl-11 pr-4 py-3.5
          bg-white
          border border-gray-200
          rounded-xl
          text-gray-700
          placeholder-gray-400
          outline-none
          transition-all duration-300
          focus:border-cyan-500
          focus:ring-4 focus:ring-cyan-500/20
          shadow-sm
        "
        required
      />
    </div>
  </div>

  {/* Password */}
  <div>
    <label className="block mb-2 text-sm text-cyan-600 font-bold font-serif">
      Password
    </label>

    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500">
        🔒
      </span>

      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="
          w-full
          pl-11 pr-4 py-3.5
          bg-white
          border border-gray-200
          rounded-xl
          text-gray-700
          placeholder-gray-400
          outline-none
          transition-all duration-300
          focus:border-cyan-500
          focus:ring-4 focus:ring-cyan-500/20
          shadow-sm
        "
        required
      />
    </div>
  </div>

  {/* Login Button */}
  <button
    type="submit"
    className="
      w-full
      py-3.5
      rounded-xl
      bg-cyan-600
      text-white
      font-bold
      font-serif
      tracking-wide
      shadow-lg
      shadow-cyan-500/30
      transition-all duration-300
      hover:bg-cyan-700
      hover:shadow-xl
      hover:shadow-cyan-500/40
      hover:-translate-y-0.5
      active:translate-y-0
      cursor-pointer
    "
  >
    Login
  </button>

</form>
      </div>
    </div>
  );
}

export default AdminLogin;