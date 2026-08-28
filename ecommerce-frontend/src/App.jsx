import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { CartProvider } from "./CartContext";

import StoreNavbar from "./Storenavbar";
import Footer from "./Footer";
import About from "./About";
import Contact from "./Contact";
import Deals from "./Deals";

import Home from "./Home";
import Cart from "./Cart";
import Checkout from "./Checkout";
import OrderSuccess from "./OrderSuccess";
import Orders from "./Orders";
import ProductDetails from "./ProductDetails";
import Reviews from "./Reviews";

import AdminLogin from "./AdminLogin";
import Dashboard from "./Dashboard";
import AllProducts from "./AllProducts";
import AddProduct from "./AddProduct";

import AdminProtectedRoute from "./AdminProtectedRoute";

function AppContent() {
  const location = useLocation();

  // =====================================================
  // SEARCH STATE
  // StoreNavbar + Home + ProductCard
  // =====================================================

  const [search, setSearch] = useState("");

  // =====================================================
  // CATEGORY STATE
  // StoreNavbar + Home + CategorySection + ProductCard
  // =====================================================

  const [selectedCategory, setSelectedCategory] = useState("");

  // =====================================================
  // ADMIN PAGES
  // Store Navbar/Footer hide hoga
  // =====================================================

  const isAdminPage =
    location.pathname === "/admin" ||
    location.pathname === "/dashboard" ||
    location.pathname === "/AllProducts" ||
    location.pathname === "/all-products" ||
    location.pathname === "/AddProduct" ||
    location.pathname === "/add-product";

  return (
    <div className="min-h-screen flex flex-col">

      {/* =================================================
          STORE NAVBAR
      ================================================= */}

      {!isAdminPage && (
        <StoreNavbar
          search={search}
          setSearch={setSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="flex-1">

        <Routes>

          {/* =================================================
              STORE PAGES
          ================================================= */}

          {/* HOME */}
          <Route
            path="/"
            element={
              <Home
                search={search}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            }
          />

          {/* =================================================
              PRODUCT DETAILS
          ================================================= */}

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          {/* =================================================
              PRODUCT REVIEWS
          ================================================= */}

          <Route
            path="/product/:id/reviews"
            element={<Reviews />}
          />

          {/* =================================================
              CART
          ================================================= */}

          <Route
            path="/cart"
            element={<Cart />}
          />

          {/* =================================================
              CHECKOUT
          ================================================= */}

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          {/* =================================================
              ORDER SUCCESS
          ================================================= */}

          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />

          {/* =================================================
              ORDERS
          ================================================= */}

          <Route
            path="/orders"
            element={<Orders />}
          />

          {/* =================================================
              ADMIN LOGIN
          ================================================= */}

          <Route
            path="/admin"
            element={<AdminLogin />}
          />

          {/* =================================================
              ADMIN DASHBOARD
          ================================================= */}

          <Route
            path="/dashboard"
            element={
              <AdminProtectedRoute>
                <Dashboard />
              </AdminProtectedRoute>
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/deals" element={<Deals />} />

          {/* =================================================
              ALL PRODUCTS
          ================================================= */}

          <Route
            path="/AllProducts"
            element={
              <AdminProtectedRoute>
                <AllProducts />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/all-products"
            element={
              <AdminProtectedRoute>
                <AllProducts />
              </AdminProtectedRoute>
            }
          />

          {/* =================================================
              ADD PRODUCT
          ================================================= */}

          <Route
            path="/AddProduct"
            element={
              <AdminProtectedRoute>
                <AddProduct />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/add-product"
            element={
              <AdminProtectedRoute>
                <AddProduct />
              </AdminProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />

        </Routes>

      </main>

      {/* =================================================
          STORE FOOTER
      ================================================= */}

      {!isAdminPage && <Footer />}

    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;