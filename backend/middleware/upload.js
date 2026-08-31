const multer = require("multer");

// =====================================================
// STORAGE CONFIGURATION (Memory Storage for Vercel)
// =====================================================
const storage = multer.memoryStorage();

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
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
});

module.exports = upload;