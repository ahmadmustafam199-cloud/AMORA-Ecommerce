const Product = require("../models/Product");

// =====================================================
// GET ALL PRODUCTS
// GET /api/products
// =====================================================

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE PRODUCT
// GET /api/products/:id
// =====================================================

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// =====================================================
// GET PRODUCTS BY CATEGORY
// GET /api/products/category/:category
// =====================================================

const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("GET CATEGORY PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching category products",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE PRODUCT
// POST /api/products
// =====================================================

const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      stock,
      description,
    } = req.body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product category is required",
      });
    }

    if (
      price === undefined ||
      price === "" ||
      Number.isNaN(Number(price))
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid product price is required",
      });
    }

    if (
      stock === undefined ||
      stock === "" ||
      Number.isNaN(Number(stock))
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid product stock is required",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least 1 image",
      });
    }

    if (req.files.length > 7) {
      return res.status(400).json({
        success: false,
        message: "Maximum 7 images are allowed",
      });
    }

    // -----------------------------
    // CLOUDINARY IMAGE URLS
    // -----------------------------

    const images = req.files.map((file) => file.path);

    // -----------------------------
    // CREATE
    // -----------------------------

    const product = await Product.create({
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      stock: Number(stock),
      images,
      description: description ? description.trim() : "",
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Product validation failed",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE PRODUCT
// PUT /api/products/:id
// =====================================================

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updateData = {
      ...req.body,
    };

    // -----------------------------
    // CLEAN VALUES
    // -----------------------------

    if (updateData.name) {
      updateData.name = updateData.name.trim();
    }

    if (updateData.category) {
      updateData.category = updateData.category.trim();
    }

    if (
      updateData.price !== undefined &&
      updateData.price !== ""
    ) {
      updateData.price = Number(updateData.price);
    }

    if (
      updateData.stock !== undefined &&
      updateData.stock !== ""
    ) {
      updateData.stock = Number(updateData.stock);
    }

    // -----------------------------
    // NEW IMAGES (CLOUDINARY)
    // -----------------------------

    if (req.files && req.files.length > 0) {
      if (req.files.length > 7) {
        return res.status(400).json({
          success: false,
          message: "Maximum 7 images are allowed",
        });
      }

      updateData.images = req.files.map((file) => file.path);
    }

    // -----------------------------
    // UPDATE
    // -----------------------------

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE PRODUCT
// DELETE /api/products/:id
// =====================================================

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
};