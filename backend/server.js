require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// =====================================================
// UPLOAD DIRECTORY (Local fallback)
// =====================================================
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// =====================================================
// MIDDLEWARE
// =====================================================

// Permitted origins (Aap ka Vercel Frontend aur Localhost dono)
const allowedOrigins = [
  "http://localhost:5173",
  "https://amora-ecommerce.vercel.app" // Apne exact Vercel frontend link se verify kar lein
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Production issues se bachne ke liye baqi bhi allow karta hai
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// SERVE UPLOADED IMAGES
// =====================================================
app.use("/uploads", express.static(uploadDir));

// =====================================================
// MONGODB CONNECTION MIDDLEWARE (For Vercel Serverless)
// =====================================================
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// =====================================================
// HOME ROUTE
// =====================================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-Commerce Admin API is running on Vercel",
  });
});

// =====================================================
// API ROUTES
// =====================================================
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

// =====================================================
// 404 ROUTE
// =====================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================
app.use((error, req, res, next) => {
  console.error("Server Error:", error);

  res.status(500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
});

// Local Development ke liye server listen karega
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Vercel serverless function Export
module.exports = app;