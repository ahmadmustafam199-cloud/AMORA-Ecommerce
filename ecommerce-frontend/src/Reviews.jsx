 
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle,
  MessageSquare,
  Send,
  ShoppingCart,
  Star,
  User,
} from "lucide-react";

// =====================================================
// BACKEND URL
// =====================================================

const API_URL = "https://amora-backend-lake.vercel.app";

// =====================================================
// SAFE JSON HELPER
// =====================================================

const getJsonResponse = async (response) => {
  const contentType =
    response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Server returned ${response.status} ${response.statusText}.`
    );
  }

  return response.json();
};

// =====================================================
// SAFE IMAGE URL HELPER
// =====================================================

const getImageUrl = (image) => {
  if (!image || typeof image !== "string") {
    return "";
  }

  const cleanImage = image.trim();

  if (!cleanImage) {
    return "";
  }

  if (
    cleanImage.startsWith("http://") ||
    cleanImage.startsWith("https://")
  ) {
    return cleanImage;
  }

  if (cleanImage.startsWith("/")) {
    return `${API_URL}${cleanImage}`;
  }

  return `${API_URL}/${cleanImage}`;
};

// =====================================================
// REVIEWS COMPONENT
// =====================================================

function Reviews() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // PRODUCT + REVIEWS STATE
  // =====================================================

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [loadingProduct, setLoadingProduct] =
    useState(Boolean(id));

  const [loadingReviews, setLoadingReviews] =
    useState(Boolean(id));

  // =====================================================
  // FORM STATE
  // =====================================================

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PRODUCT + REVIEWS
  // =====================================================

  useEffect(() => {
    if (!id) {
      return;
    }

    let ignore = false;

    const loadData = async () => {
      try {
        setLoadingProduct(true);
        setLoadingReviews(true);
        setError("");

        // =================================================
        // LOAD PRODUCT
        // =================================================

        const productResponse = await fetch(
          `${API_URL}/api/products/${id}`
        );

        const productData =
          await getJsonResponse(productResponse);

        if (!productResponse.ok) {
          throw new Error(
            productData.message ||
              "Product not found."
          );
        }

        const productResult =
          productData.product ||
          productData.data ||
          productData;

        if (!ignore) {
          setProduct(productResult);
          setLoadingProduct(false);
        }

        // =================================================
        // LOAD REVIEWS
        // =================================================

        try {
          const reviewsResponse = await fetch(
            `${API_URL}/api/reviews/${id}`
          );

          const reviewsData =
            await getJsonResponse(reviewsResponse);

          if (
            !ignore &&
            reviewsResponse.ok &&
            reviewsData.success
          ) {
            setReviews(
              Array.isArray(reviewsData.reviews)
                ? reviewsData.reviews
                : []
            );
          } else if (!ignore) {
            setReviews([]);
          }
        } catch (reviewError) {
          console.error(
            "Load Reviews Error:",
            reviewError
          );

          if (!ignore) {
            setReviews([]);
          }
        }

        if (!ignore) {
          setLoadingReviews(false);
        }
      } catch (error) {
        if (!ignore) {
          console.error(
            "Load Reviews Page Error:",
            error
          );

          setProduct(null);
          setReviews([]);

          setError(
            error.message ||
              "This product could not be loaded."
          );

          setLoadingProduct(false);
          setLoadingReviews(false);
        }
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, [id]);

  // =====================================================
  // SUBMIT REVIEW
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    // =================================================
    // RATING VALIDATION
    // =================================================

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    // =================================================
    // GMAIL VALIDATION
    // =================================================

    if (
      !/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(
        email.trim()
      )
    ) {
      setError(
        "Please enter a valid Gmail address."
      );
      return;
    }

    // =================================================
    // PHONE VALIDATION
    // =================================================

    if (!/^03[0-9]{9}$/.test(phone.trim())) {
      setError(
        "Please enter a valid Pakistani phone number."
      );
      return;
    }

    // =================================================
    // COMMENT VALIDATION
    // =================================================

    if (comment.trim().length < 5) {
      setError(
        "Review must contain at least 5 characters."
      );
      return;
    }

    if (comment.trim().length > 500) {
      setError(
        "Review cannot exceed 500 characters."
      );
      return;
    }

    try {
      setSubmitting(true);

      // =================================================
      // SEND REVIEW
      // =================================================

      const response = await fetch(
        `${API_URL}/api/reviews`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            productId: id,
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            rating: Number(rating),
            comment: comment.trim(),
          }),
        }
      );

      const data =
        await getJsonResponse(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit review."
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      setSuccess(true);
      setError("");

      setEmail("");
      setPhone("");
      setRating(0);
      setComment("");

      // =================================================
      // RELOAD REVIEWS
      // =================================================

      try {
        const reviewsResponse = await fetch(
          `${API_URL}/api/reviews/${id}`
        );

        const reviewsData =
          await getJsonResponse(
            reviewsResponse
          );

        if (
          reviewsResponse.ok &&
          reviewsData.success
        ) {
          setReviews(
            Array.isArray(
              reviewsData.reviews
            )
              ? reviewsData.reviews
              : []
          );
        }
      } catch (reviewError) {
        console.error(
          "Reload Reviews Error:",
          reviewError
        );
      }

      // =================================================
      // HIDE SUCCESS MESSAGE
      // =================================================

      setTimeout(() => {
        setSuccess(false);
      }, 4000);
    } catch (error) {
      console.error(
        "Submit Review Error:",
        error
      );

      setError(
        error.message ||
          "Failed to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // LOADING PRODUCT
  // =====================================================

  if (loadingProduct) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

          <p className="mt-4 text-sm font-semibold text-gray-500">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PRODUCT NOT FOUND
  // =====================================================

  if (!product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">

          <ShoppingCart
            size={40}
            className="mx-auto text-gray-300"
          />

          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error ||
              "This product could not be loaded."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-5 rounded-lg bg-orange-500 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-orange-600"
          >
            Back To Home
          </button>

        </div>
      </div>
    );
  }

  // =====================================================
  // SAFE PRODUCT IMAGE
  // =====================================================

  const productImage =
    typeof product?.image === "string" &&
    product.image.trim()
      ? product.image
      : Array.isArray(product?.images) &&
        typeof product.images[0] === "string"
      ? product.images[0]
      : "";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-7 lg:px-10">

      {/* BACK BUTTON */}

      <button
        type="button"
        onClick={() =>
          navigate(`/product/${id}`)
        }
        className="mb-5 flex items-center gap-2 text-xs font-semibold text-gray-600 transition hover:text-orange-500"
      >
        <ArrowLeft size={15} />
        Back To Product
      </button>

      {/* PRODUCT HEADER */}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">

        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">

          {/* PRODUCT IMAGE */}

          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">

            {productImage ? (
              <img
                src={getImageUrl(productImage)}
                alt={product.name || "Product"}
                className="h-20 w-20 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />
            ) : (
              <ShoppingCart
                size={30}
                className="text-gray-300"
              />
            )}

          </div>

          {/* PRODUCT INFORMATION */}

          <div>

            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
              Product Reviews
            </p>

            <h1 className="mt-1 text-xl font-bold text-gray-900">
              {product.name ||
                "Unnamed Product"}
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Genuine customer feedback and
              experiences.
            </p>

          </div>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* REVIEWS SECTION */}

        <div className="lg:col-span-2">

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-lg md:p-6">

            {/* REVIEWS HEADER */}

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-lg font-bold text-gray-900">
                  Customer Reviews
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {reviews.length}{" "}
                  customer{" "}
                  {reviews.length === 1
                    ? "review"
                    : "reviews"}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                <MessageSquare size={20} />
              </div>

            </div>

            {/* LOADING REVIEWS */}

            {loadingReviews ? (
              <div className="py-12 text-center">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

                <p className="mt-3 text-xs text-gray-500">
                  Loading reviews...
                </p>

              </div>
            ) : reviews.length === 0 ? (

              /* NO REVIEWS */

              <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">

                <MessageSquare
                  size={32}
                  className="mx-auto text-gray-300"
                />

                <h3 className="mt-3 text-sm font-bold text-gray-800">
                  No Reviews Yet
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Be the first customer to
                  review this product.
                </p>

              </div>
            ) : (

              /* REVIEWS LIST */

              <div className="mt-5 space-y-3">

                {reviews.map(
                  (review, index) => (
                    <div
                      key={
                        review?._id ||
                        review?.id ||
                        index
                      }
                      className="rounded-xl border border-gray-100 p-4 transition hover:border-orange-100 hover:shadow-sm"
                    >

                      <div className="flex items-start gap-3">

                        {/* USER ICON */}

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
                          <User size={16} />
                        </div>

                        <div className="min-w-0 flex-1">

                          {/* REVIEW HEADER */}

                          <div className="flex flex-col justify-between gap-2 sm:flex-row">

                            <div>

                              <p className="text-xs font-bold text-gray-900">
                                Verified Customer
                              </p>

                              <p className="mt-0.5 break-all text-[10px] text-gray-400">
                                {review?.email ||
                                  "Customer"}
                              </p>

                            </div>

                            {/* RATING */}

                            <div className="flex">

                              {[1, 2, 3, 4, 5].map(
                                (star) => (
                                  <Star
                                    key={star}
                                    size={13}
                                    className={
                                      star <=
                                      Number(
                                        review?.rating ||
                                          0
                                      )
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }
                                  />
                                )
                              )}

                            </div>

                          </div>

                          {/* COMMENT */}

                          <p className="mt-3 text-xs leading-5 text-gray-600">
                            {review?.comment ||
                              "No comment provided."}
                          </p>

                          {/* DATE */}

                          <p className="mt-2 text-[9px] text-gray-400">

                            {review?.createdAt
                              ? new Date(
                                  review.createdAt
                                ).toLocaleDateString(
                                  "en-PK",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : ""}

                          </p>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </div>

        {/* WRITE REVIEW */}

        <div>

          <div className="sticky top-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg md:p-6">

            {/* FORM HEADER */}

            <div>

              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
                Your Opinion Matters
              </p>

              <h2 className="mt-1 text-lg font-bold text-gray-900">
                Write a Review
              </h2>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Share your experience with
                this product.
              </p>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-5 space-y-4"
            >

              {/* EMAIL */}

              <div>

                <label className="mb-1.5 block text-[11px] font-bold text-gray-700">
                  Gmail Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="example@gmail.com"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs outline-none transition focus:border-orange-400 focus:bg-white"
                />

              </div>

              {/* PHONE */}

              <div>

                <label className="mb-1.5 block text-[11px] font-bold text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      )
                    )
                  }
                  placeholder="03001234567"
                  maxLength={11}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs outline-none transition focus:border-orange-400 focus:bg-white"
                />

                <p className="mt-1 text-[9px] text-gray-400">
                  Example: 03001234567
                </p>

              </div>

              {/* RATING */}

              <div>

                <label className="mb-1.5 block text-[11px] font-bold text-gray-700">
                  Your Rating
                </label>

                <div className="flex items-center gap-1">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() =>
                          setRating(star)
                        }
                        className="transition hover:scale-110"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          size={24}
                          className={
                            star <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      </button>
                    )
                  )}

                  {rating > 0 && (
                    <span className="ml-2 text-xs font-bold text-gray-600">
                      {rating}/5
                    </span>
                  )}

                </div>

              </div>

              {/* COMMENT */}

              <div>

                <label className="mb-1.5 block text-[11px] font-bold text-gray-700">
                  Your Review
                </label>

                <textarea
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value)
                  }
                  placeholder="Tell us about your experience..."
                  rows={5}
                  maxLength={500}
                  required
                  className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs leading-5 outline-none transition focus:border-orange-400 focus:bg-white"
                />

                <p className="mt-1 text-right text-[9px] text-gray-400">
                  {comment.length}/500
                </p>

              </div>

              {/* ERROR */}

              {error && (
                <div className="rounded-lg bg-red-50 px-3 py-2.5 text-[11px] font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {success && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5 text-[11px] font-semibold text-green-600">
                  <CheckCircle size={15} />
                  Review submitted
                  successfully!
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={15} />

                {submitting
                  ? "Submitting..."
                  : "Submit Review"}
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Reviews;
 
