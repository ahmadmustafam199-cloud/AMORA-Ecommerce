const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },

    products: {
      type: Array,
      required: true,
    },

    deliveryCharges: {
      type: Number,
      default: 500,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
      enum: [
        "Pending",
        "Processing",
        "Delivered",
        "Cancelled",
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);