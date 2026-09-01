require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// =====================================================
// ROUTES
// =====================================================

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// =====================================================
// APP
// =====================================================

const app = express();

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: true,
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// STATIC UPLOADS
// =====================================================

// Product images stored inside /uploads folder
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// =====================================================
// MONGODB CONNECTION
// =====================================================

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  const mongoURI =
    process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error(
      "MONGO_URI is missing from environment variables"
    );
  }

  try {
    const db = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });

    cachedDb = db;

    console.log(
      "MongoDB Connected Successfully"
    );

    return cachedDb;
  } catch (error) {
    cachedDb = null;

    console.error(
      "MongoDB Connection Error:",
      error.message
    );

    throw error;
  }
};

// =====================================================
// DATABASE MIDDLEWARE
// =====================================================

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error(
      "DATABASE MIDDLEWARE ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AMORA E-Commerce API is running",
  });
});

// =====================================================
// API ROUTES
// =====================================================

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (error, req, res, next) => {
    console.error(
      "SERVER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error",
    });
  }
);

// =====================================================
// LOCAL SERVER
// =====================================================

if (require.main === module) {
  const PORT =
    process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );
  });
}

// =====================================================
// VERCEL EXPORT
// =====================================================

module.exports = app;