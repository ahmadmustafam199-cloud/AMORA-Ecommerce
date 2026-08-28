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

// =====================================================
// UPLOAD DIRECTORY (Local fallback)
// =====================================================
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// =====================================================
// MIDDLEWARE (CORS & Body Parsers)
// =====================================================
app.use(cors({
  origin: "*", // Sab origins allow karta hai (Cross-Origin errors se bachne ke liye)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded static files
app.use("/uploads", express.static(uploadDir));

// =====================================================
// MONGODB CONNECTION (Serverless Optimized)
// =====================================================
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    cachedDb = db;
    console.log("MongoDB Connected Successfully");
    return cachedDb;
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    throw error;
  }
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

// =====================================================
// API ROUTES
// =====================================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AMORA E-Commerce API is running on Vercel",
  });
});

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

// Local dev Server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Serverless Handler Export
module.exports = app;