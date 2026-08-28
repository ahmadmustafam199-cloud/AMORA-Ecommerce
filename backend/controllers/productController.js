const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// GET SINGLE PRODUCT
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// GET PRODUCTS BY CATEGORY
const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.status(200).json(products);
  } catch (error) {
    console.error("GET CATEGORY PRODUCTS ERROR:", error);
    res.status(500).json({ message: "Error fetching category products", error: error.message });
  }
};

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const { name, category, price, stock, description } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ message: "Product name is required" });
    if (!category || !category.trim()) return res.status(400).json({ message: "Product category is required" });
    if (price === undefined || price === "") return res.status(400).json({ message: "Product price is required" });
    if (stock === undefined || stock === "") return res.status(400).json({ message: "Product stock is required" });

    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ message: "Please upload at least 1 image" });
    }

    if (req.files.length > 10) {
      return res.status(400).json({ message: "Maximum 10 images are allowed" });
    }

    const images = req.files.map((file) => `/uploads/${file.filename}`);

    const product = await Product.create({
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      stock: Number(stock),
      images,
      description: description || "",
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Product validation failed", error: error.message });
    }
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let updateData = { ...req.body };

    // Agar nayi images upload hui hain
    if (req.files && req.files.length > 0) {
      // Purani images delete karein
      if (product.images && product.images.length > 0) {
        product.images.forEach((image) => {
          const filePath = path.join(__dirname, "..", image.replace("/uploads/", "uploads/"));
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
      }
      updateData.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.images && product.images.length > 0) {
      product.images.forEach((image) => {
        const filePath = path.join(__dirname, "..", image.replace("/uploads/", "uploads/"));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Error deleting product", error: error.message });
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