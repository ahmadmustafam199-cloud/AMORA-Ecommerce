import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle,
  MessageSquare,
  Send,
  Star,
  User,
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "Smart Watch Series 7",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQHQB5xUdDL-l9mxXxlbp87e58TBP0VRohhOuAlU4X9Q&s=10",
  },
  {
    id: 2,
    name: "Men Casual T-Shirt",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJGr0Mhxvj7HqMZTjXlw8_TUS8WawtBQLym2NyiEwYUA&s=10",
  },
  {
    id: 3,
    name: "English Willow Bat",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2f54_okVCTZp2vH2th_leb8PhsMeF9DgBZ2xusPjXvg&s=10",
  },
  {
    id: 4,
    name: "Kitchen Appliances Set",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQOmVm0_J5ffFOSd2rK8uDsC1dXulrGpqwQyO3N_DYMg&s=10",
  },
  {
    id: 5,
    name: "Nike Air Max 270",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCYAAO0RuSAWHCbQaX2pVBwmJX-FuDyhxP3QtV5M4DVQ&s=10",
  },
  {
    id: 6,
    name: "Iphone 16 Pro Max",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROpLB32gV9-aHQiSvGtprFFXNqt_XcK_1bT4JB-5KMfA&s=10",
  },
  {
    id: 7,
    name: "Premium Logo Cap",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT77Gwg4kdQiOyueNTc4emEu4E4jYeHg-VFCQEZ_djI8A&s",
  },
  {
    id: 8,
    name: "Dell OptiPlex Core i5",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmyoqfUJ7yV1n9LxSSThnXsi9AUR2JHLfeXdWvkVaizg&s=10",
  },
  {
    id: 9,
    name: "Oud Wood",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPzdUq88ZsYzgoDDSPI-YVuLlGiHLCIDtRE7i5cSR0vg&s=10",
  },
  {
    id: 10,
    name: "BMW Remote Control Car",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROLDhyd4h-qd7lZWwyiSu3EnaYjXjxeZmPNw3fUDuPkQ&s=10",
  },
  {
    id: 11,
    name: "Premium Travel Bag",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRen09Tnx9RI1qQnUZn8ql2s3LlcFor4b_p-Yzgxl-fOw&s=10",
  },
  {
    id: 12,
    name: "Apple AirPods 4",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzkwuPkmcHtkthJZSTSmVcSGnMpnFDCGsIC9jZ1pH7OA&s=10",
  },
];

function Reviews() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // GET REVIEWS
  // =====================================================

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/reviews/${id}`
      );

      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Reviews Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  // =====================================================
  // SUBMIT REVIEW
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      setError("Please enter a valid Gmail address.");
      return;
    }

    if (!/^03[0-9]{9}$/.test(phone)) {
      setError(
        "Please enter a valid Pakistani phone number."
      );
      return;
    }

    if (comment.trim().length < 5) {
      setError(
        "Review must contain at least 5 characters."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        "http://localhost:5000/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: id,
            email,
            phone,
            rating,
            comment,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit review"
        );
      }

      setSuccess(true);

      setEmail("");
      setPhone("");
      setRating(0);
      setComment("");

      fetchReviews();

      setTimeout(() => {
        setSuccess(false);
      }, 4000);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <button
            onClick={() => navigate("/")}
            className="mt-4 rounded-lg bg-orange-500 px-5 py-2.5 text-xs font-bold text-white"
          >
            Back To Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-7 lg:px-10">

      {/* Back */}
      <button
        onClick={() => navigate(`/product/${id}`)}
        className="mb-5 flex items-center gap-2 text-xs font-semibold text-gray-600 transition hover:text-orange-500"
      >
        <ArrowLeft size={15} />
        Back To Product
      </button>

      {/* Header */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">

        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">

          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-gray-50">
            <img
              src={product.image}
              alt={product.name}
              className="h-20 w-20 object-contain"
            />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
              Product Reviews
            </p>

            <h1 className="mt-1 text-xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Genuine customer feedback and experiences.
            </p>
          </div>

        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* =================================================
            REVIEWS
        ================================================= */}

        <div className="lg:col-span-2">

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-lg md:p-6">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Customer Reviews
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {reviews.length} customer reviews
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                <MessageSquare size={20} />
              </div>

            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-gray-500">
                Loading reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
                <MessageSquare
                  size={32}
                  className="mx-auto text-gray-300"
                />

                <h3 className="mt-3 text-sm font-bold text-gray-800">
                  No Reviews Yet
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Be the first customer to review this product.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">

                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="rounded-xl border border-gray-100 p-4 transition hover:border-orange-100 hover:shadow-sm"
                  >

                    <div className="flex items-start gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
                        <User size={16} />
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col justify-between gap-2 sm:flex-row">

                          <div>
                            <p className="text-xs font-bold text-gray-900">
                              Verified Customer
                            </p>

                            <p className="mt-0.5 text-[10px] text-gray-400">
                              {review.email}
                            </p>
                          </div>

                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(
                              (star) => (
                                <Star
                                  key={star}
                                  size={13}
                                  className={
                                    star <= review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }
                                />
                              )
                            )}
                          </div>

                        </div>

                        <p className="mt-3 text-xs leading-5 text-gray-600">
                          {review.comment}
                        </p>

                        <p className="mt-2 text-[9px] text-gray-400">
                          {new Date(
                            review.createdAt
                          ).toLocaleDateString()}
                        </p>

                      </div>
                    </div>
                  </div>
                ))}

              </div>
            )}

          </div>
        </div>

        {/* =================================================
            WRITE REVIEW
        ================================================= */}

        <div>

          <div className="sticky top-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg md:p-6">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
                Your Opinion Matters
              </p>

              <h2 className="mt-1 text-lg font-bold text-gray-900">
                Write a Review
              </h2>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Share your experience with this product.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-5 space-y-4"
            >

              {/* Gmail */}
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

              {/* Phone */}
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
              </div>

              {/* Rating */}
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

              {/* Comment */}
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

              {/* Error */}
              {error && (
                <div className="rounded-lg bg-red-50 px-3 py-2.5 text-[11px] font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5 text-[11px] font-semibold text-green-600">
                  <CheckCircle size={15} />
                  Review submitted successfully!
                </div>
              )}

              {/* Submit */}
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