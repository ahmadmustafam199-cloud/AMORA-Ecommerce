const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // =====================================================
    // PRODUCT NAME
    // =====================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // DESCRIPTION
    // =====================================================

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // CATEGORY
    // =====================================================

    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Electronics",
        "Phones",
        "Shoes",
        "Home & Kitchen",
        "Sports",
        "Clothes",
        "Accessories",
        "Computer",
        "Beauty",
        "Toys",
        "Bags",
      ],
    },

    // =====================================================
    // PRICE
    // =====================================================

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // =====================================================
    // STOCK
    // =====================================================

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    // =====================================================
    // IMAGES
    // Minimum 1
    // Maximum 10
    // =====================================================

    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return (
            Array.isArray(value) &&
            value.length >= 1 &&
            value.length <= 10
          );
        },
        message: "Product must have between 1 and 10 images",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);