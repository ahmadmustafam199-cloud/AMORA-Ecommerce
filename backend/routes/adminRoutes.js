 
const express = require("express");
const crypto = require("crypto");

const router = express.Router();

// =====================================================
// ADMIN LOGIN
// =====================================================

router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminSecret = process.env.ADMIN_SECRET;

    // Check environment variables
    if (!adminEmail || !adminPassword || !adminSecret) {
      return res.status(500).json({
        success: false,
        message: "Admin credentials are not configured",
      });
    }

    // Check email and password
    if (
      email !== adminEmail ||
      password !== adminPassword
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Create admin token
    const token = crypto
      .createHmac("sha256", adminSecret)
      .update("AMORA_ADMIN_ACCESS")
      .digest("hex");

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    console.error(
      "ADMIN LOGIN ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Admin login failed",
    });
  }
});

module.exports = router;
 
