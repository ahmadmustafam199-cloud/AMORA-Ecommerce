const crypto = require("crypto");

function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Admin authentication required",
    });
  }

  const token = authHeader.split(" ")[1];

  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    return res.status(500).json({
      message: "Admin secret is not configured",
    });
  }

  const expectedToken = crypto
    .createHmac("sha256", secret)
    .update("AMORA_ADMIN_ACCESS")
    .digest("hex");

  if (token !== expectedToken) {
    return res.status(403).json({
      message: "Unauthorized admin access",
    });
  }

  next();
}

module.exports = adminAuth;