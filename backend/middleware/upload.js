const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// =====================================================
// CLOUDINARY CONFIGURATION
// =====================================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =====================================================
// STORAGE (Cloudinary Storage Engine)
// =====================================================
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "amora_products", // Cloudinary mein folder ka naam
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "jfif"],
    public_id: (req, file) => {
      // Unique filename generate karne ke liye
      return Date.now() + "-" + Math.round(Math.random() * 1e9);
    },
  },
});

// =====================================================
// FILE FILTER
// =====================================================
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/jfif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPG, PNG, WEBP, GIF and JFIF images are allowed"),
      false
    );
  }
};

// =====================================================
// MULTER EXPORT
// =====================================================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: 7,
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;