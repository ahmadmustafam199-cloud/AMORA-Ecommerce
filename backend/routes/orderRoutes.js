require("dotenv").config();

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const Order = require("../models/Order");
const adminAuth = require("../middleware/adminAuth");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error(
      "❌ Nodemailer Auth Error:",
      error.message
    );
  } else {
    console.log(
      "✅ Nodemailer is connected and ready to send emails"
    );
  }
});

// =====================================================
// CREATE ORDER - CUSTOMER
// =====================================================

router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      address,
      city,
      phone,
      paymentMethod,
      products,
      deliveryCharges,
      totalPrice,
    } = req.body;

    if (
      !customerName ||
      !customerEmail ||
      !address ||
      !city ||
      !phone
    ) {
      return res.status(400).json({
        message:
          "Name, email, address, city and phone are required",
      });
    }

    if (!products || products.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const order = new Order({
      customerName,
      customerEmail,
      address,
      city,
      phone,
      paymentMethod:
        paymentMethod || "Cash on Delivery",
      products,
      deliveryCharges:
        deliveryCharges || 500,
      totalPrice,
      status: "Pending",
    });

    const savedOrder = await order.save();

    // =================================================
    // CUSTOMER ORDER ID
    // =================================================

    const productsHTML = products
      .map(
        (p) =>
          `<li>
            <strong>${p.name || "Item"}</strong>
            - Qty: ${p.quantity || 1}
            | Price: PKR ${p.price || 0}
          </li>`
      )
      .join("");

    try {
      await transporter.sendMail({
        from: `"AMORA Store" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `🛒 New Order - ${customerName}`,
        html: `
          <h2>New Order Details</h2>

          <p>
            <strong>Customer Name:</strong>
            ${customerName}
          </p>

          <p>
            <strong>Email:</strong>
            ${customerEmail}
          </p>

          <p>
            <strong>Phone:</strong>
            ${phone}
          </p>

          <p>
            <strong>Address:</strong>
            ${address}
          </p>

          <p>
            <strong>City:</strong>
            ${city}
          </p>

          <p>
            <strong>Payment:</strong>
            ${paymentMethod || "Cash on Delivery"}
          </p>

          <hr />

          <h3>Products</h3>

          <ul>
            ${productsHTML}
          </ul>

          <hr />

          <p>
            <strong>Delivery:</strong>
            PKR ${deliveryCharges || 500}
          </p>

          <p>
            <strong>Total:</strong>
            PKR ${totalPrice}
          </p>
        `,
      });
    } catch (emailError) {
      console.error(
        "❌ Email send failed:",
        emailError.message
      );
    }

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error(
      "Create Order Error:",
      error
    );

    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
});

// =====================================================
// CUSTOMER - GET SINGLE OWN ORDER
// =====================================================

router.get("/customer/:id", async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});

// =====================================================
// ADMIN - GET ALL ORDERS
// =====================================================

router.get("/", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// =====================================================
// ADMIN - UPDATE ORDER
// =====================================================

router.put("/:id", adminAuth, async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      address,
      city,
      phone,
      paymentMethod,
      totalPrice,
      status,
      products,
      deliveryCharges,
    } = req.body;

    const updatedOrder =
      await Order.findByIdAndUpdate(
        req.params.id,
        {
          customerName,
          customerEmail,
          address,
          city,
          phone,
          paymentMethod,
          totalPrice,
          status,
          products,
          deliveryCharges,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order",
      error: error.message,
    });
  }
});

// =====================================================
// ADMIN - DELETE ORDER
// =====================================================

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const deletedOrder =
      await Order.findByIdAndDelete(
        req.params.id
      );

    if (!deletedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete order",
      error: error.message,
    });
  }
});

module.exports = router;