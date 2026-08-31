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
// STORAGE CONFIGURATION
// =====================================================
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // File format nikaalein extension se
    const fileExtension = file.originalname.split(".").pop().toLowerCase();

    return {
      folder: "amora_products",
      format: ["jpg", "jpeg", "png", "webp", "gif"].includes(fileExtension)
        ? fileExtension
        : "jpg",
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    };
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
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPG, JPEG, PNG, WEBP, and GIF images are allowed"),
      false
    );
  }
};

// =====================================================
// MULTER EXPORT
// =====================================================
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    files: 7,
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;