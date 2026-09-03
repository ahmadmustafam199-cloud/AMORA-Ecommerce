require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// =====================================================
// MODELS
// =====================================================

const Product = require("./models/Product");

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
  if (
    cachedDb &&
    mongoose.connection.readyState === 1
  ) {
    return cachedDb;
  }

  const mongoURI =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI;

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
    message:
      "AMORA E-Commerce API is running",
  });
});

// =====================================================
// DYNAMIC PRODUCT SITEMAP
// =====================================================

app.get(
  "/sitemap-products.xml",
  async (req, res) => {
    try {
      // Get all products from MongoDB
      const products = await Product.find({})
        .select("_id updatedAt")
        .sort({ updatedAt: -1 })
        .lean();

      // Frontend website URL
     const SITE_URL =
     process.env.FRONTEND_URL ||
     "https://amora-ecommerce.vercel.app";

      // Generate product URLs
      const productUrls = products
        .map((product) => {
          const productId =
            product._id.toString();

          const lastModified =
            product.updatedAt
              ? new Date(
                  product.updatedAt
                ).toISOString()
              : new Date().toISOString();

          return `
  <url>
    <loc>${SITE_URL}/product/${productId}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        })
        .join("");

      // Complete XML sitemap
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${productUrls}
</urlset>`;

      res.set(
        "Content-Type",
        "application/xml; charset=utf-8"
      );

      res.status(200).send(sitemap);
    } catch (error) {
      console.error(
        "Product Sitemap Error:",
        error.message
      );

      res.status(500).send(
        "Unable to generate product sitemap"
      );
    }
  }
);

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