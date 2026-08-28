const express = require("express");
const router = express.Router();

const Review = require("../models/Review");

// =====================================================
// GET REVIEWS FOR A PRODUCT
// GET /api/reviews/:productId
// =====================================================

router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get reviews",
    });
  }
});

// =====================================================
// ADD NEW REVIEW
// POST /api/reviews
// =====================================================

router.post("/", async (req, res) => {
  try {
    const {
      productId,
      email,
      phone,
      rating,
      comment,
    } = req.body;

    if (
      !productId ||
      !email ||
      !phone ||
      !rating ||
      !comment
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const review = await Review.create({
      productId,
      email,
      phone,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Add Review Error:", error);

    res.status(500).json({
      success: false,
      message:
        error.message || "Failed to submit review",
    });
  }
});

module.exports = router;