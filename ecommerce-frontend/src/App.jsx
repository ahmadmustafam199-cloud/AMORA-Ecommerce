import { useState, useEffect } from "react";
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
import AdminOrders from "./AdminOrders";

import AdminProtectedRoute from "./AdminProtectedRoute";

function AppContent() {
  const location = useLocation();

  // =====================================================
  // SCROLL TO TOP ON EVERY PAGE CHANGE
  // =====================================================

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [location.pathname]);

  // =====================================================
  // SEARCH STATE
  // =====================================================

  const [search, setSearch] = useState("");

  // =====================================================
  // CATEGORY STATE
  // =====================================================

  const [selectedCategory, setSelectedCategory] = useState("");

  // =====================================================
  // ADMIN PAGES
  // Store Navbar + Footer hide honge
  // =====================================================

  const isAdminPage =
    location.pathname === "/admin" ||
    location.pathname === "/dashboard" ||
    location.pathname === "/AllProducts" ||
    location.pathname === "/all-products" ||
    location.pathname === "/AddProduct" ||
    location.pathname === "/add-product" ||
    location.pathname === "/admin-orders";

  return (
    <div className="min-h-screen flex flex-col">

      {/* STORE NAVBAR */}
      {!isAdminPage && (
        <StoreNavbar
          search={search}
          setSearch={setSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <Routes>

          {/* STORE PAGES */}

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

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/product/:id/reviews"
            element={<Reviews />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />

          <Route
            path="/orders"
            element={<Orders />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/deals"
            element={<Deals />}
          />

          {/* ADMIN LOGIN */}

          <Route
            path="/admin"
            element={<AdminLogin />}
          />

          {/* ADMIN DASHBOARD */}

          <Route
            path="/dashboard"
            element={
              <AdminProtectedRoute>
                <Dashboard />
              </AdminProtectedRoute>
            }
          />

          {/* ADMIN ALL PRODUCTS */}

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

          {/* ADMIN ADD PRODUCT */}

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

          {/* ADMIN ORDERS */}

          <Route
            path="/admin-orders"
            element={
              <AdminProtectedRoute>
                <AdminOrders />
              </AdminProtectedRoute>
            }
          />

        </Routes>
      </main>

      {/* STORE FOOTER */}
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