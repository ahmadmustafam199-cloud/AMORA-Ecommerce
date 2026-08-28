const express = require("express");
const {
  getProducts,
  getProduct,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const upload = require("../middleware/upload");
const router = express.Router();

router.get("/", getProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProduct);

// CREATE PRODUCT
router.post("/", upload.array("images", 10), createProduct);

// UPDATE PRODUCT (Images modify karne ke liye)
router.put("/:id", upload.array("images", 10), updateProduct);

// DELETE PRODUCT
router.delete("/:id", deleteProduct);

module.exports = router;