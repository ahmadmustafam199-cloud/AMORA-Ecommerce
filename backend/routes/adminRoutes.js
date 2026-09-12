const express = require("express");
const crypto = require("crypto");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminEmail || !adminPassword || !adminSecret) {
    return res.status(500).json({
      message: "Admin credentials are not configured",
    });
  }

  if (
    email !== adminEmail ||
    password !== adminPassword
  ) {
    return res.status(401).json({
      message: "Invalid Email or Password",
    });
  }

  const token = crypto
    .createHmac("sha256", adminSecret)
    .update("AMORA_ADMIN_ACCESS")
    .digest("hex");

  res.json({
    message: "Admin login successful",
    token,
  });
});

module.exports = router;