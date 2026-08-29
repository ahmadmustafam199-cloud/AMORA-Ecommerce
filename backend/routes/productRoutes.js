const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProduct,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const upload = require("../middleware/upload");

// =====================================================
// GET ALL
// =====================================================

router.get("/", getProducts);

// =====================================================
// GET BY CATEGORY
// =====================================================

router.get(
  "/category/:category",
  getProductsByCategory
);

// =====================================================
// GET SINGLE
// =====================================================

router.get("/:id", getProduct);

// =====================================================
// CREATE
// =====================================================

router.post(
  "/",
  upload.array("images", 7),
  createProduct
);

// =====================================================
// UPDATE
// =====================================================

router.put(
  "/:id",
  upload.array("images", 7),
  updateProduct
);

// =====================================================
// DELETE
// =====================================================

router.delete("/:id", deleteProduct);

module.exports = router;