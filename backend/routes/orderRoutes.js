require("dotenv").config(); // Top line par add karein
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Order = require("../models/Order");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 2. Transporter Connection Verification
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Nodemailer Auth Error:", error.message);
  } else {
    console.log("✅ Nodemailer is connected and ready to send emails");
  }
});

// CREATE ORDER ROUTE
router.post("/", async (req, res) => {
  try {
    const { customerName, customerEmail, address, phone, products, deliveryCharges, totalPrice, status } = req.body;

    if (!customerName || !address || !phone) {
      return res.status(400).json({ message: "Name, address and phone are required" });
    }

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 1. Save Order in Database
    const order = new Order({
      customerName,
      customerEmail,
      address,
      phone,
      products,
      deliveryCharges: deliveryCharges || 500,
      totalPrice,
      status: status || "Pending",
    });

    const savedOrder = await order.save();

    // 2. Format HTML Product List
    const productsHTML = products
      .map(
        (p) =>
          `<li><strong>${p.name || p.title || "Item"}</strong> - Qty: ${p.quantity || 1} | Price: PKR ${p.price || 0}</li>`
      )
      .join("");

    // 3. Send Email Notification
    try {
      const mailInfo = await transporter.sendMail({
        from: `"Store Notification" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `🛒 New Order Placed by ${customerName}`,
        html: `
          <h2>New Order Details</h2>
          <p><strong>Customer Name:</strong> ${customerName}</p>
          <p><strong>Customer Email:</strong> ${customerEmail || "Not Provided"}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Address:</strong> ${address}</p>
          <hr />
          <h3>Ordered Products:</h3>
          <ul>${productsHTML}</ul>
          <hr />
          <p><strong>Delivery Charges:</strong> PKR ${deliveryCharges || 500}</p>
          <p><strong>Total Price:</strong> PKR ${totalPrice}</p>
        `,
      });
      console.log("✅ Email sent successfully:", mailInfo.response);
    } catch (emailErr) {
      console.error("❌ Email send failed error details:", emailErr.message);
    }

    res.status(201).json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});

// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

// UPDATE ORDER
router.put("/:id", async (req, res) => {
  try {
    const { customerName, address, phone, totalPrice, status, products, deliveryCharges } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        customerName,
        address,
        phone,
        totalPrice,
        status,
        products,
        deliveryCharges,
      },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error: error.message });
  }
});

// DELETE ORDER
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error: error.message });
  }
});

module.exports = router;