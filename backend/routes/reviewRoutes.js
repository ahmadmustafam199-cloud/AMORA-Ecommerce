const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Review = require("../models/Review");

// =====================================================
// GET REVIEWS
// GET /api/reviews/:productId
// =====================================================

router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
      productId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get reviews",
      error: error.message,
    });
  }
});

// =====================================================
// ADD REVIEW
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

    // -----------------------------
    // REQUIRED FIELDS
    // -----------------------------

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

    // -----------------------------
    // EMAIL
    // -----------------------------

    const gmailRegex =
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!gmailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid Gmail address",
      });
    }

    // -----------------------------
    // PHONE
    // -----------------------------

    const phoneRegex = /^03[0-9]{9}$/;

    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid Pakistani phone number",
      });
    }

    // -----------------------------
    // RATING
    // -----------------------------

    const numericRating = Number(rating);

    if (
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // -----------------------------
    // COMMENT
    // -----------------------------

    const cleanComment = comment.trim();

    if (cleanComment.length < 5) {
      return res.status(400).json({
        success: false,
        message:
          "Review must contain at least 5 characters",
      });
    }

    if (cleanComment.length > 500) {
      return res.status(400).json({
        success: false,
        message:
          "Review cannot exceed 500 characters",
      });
    }

    // -----------------------------
    // CREATE REVIEW
    // -----------------------------

    const review = await Review.create({
      productId: productId.trim(),

      email: email
        .trim()
        .toLowerCase(),

      phone: phone.trim(),

      rating: numericRating,

      comment: cleanComment,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("ADD REVIEW ERROR:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message:
          "Review validation failed",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to submit review",
    });
  }
});

module.exports = router;