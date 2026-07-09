import { useEffect, useState } from "react";
import { X } from "lucide-react";

import StarRating from "./StarRating";

const ReviewModal = ({ open, onClose, product, onSubmit, loading }) => {
  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!open || !product) return;

    setRating(product.existingReview?.rating || 0);

    setComment(product.existingReview?.comment || "");
  }, [open, product]);

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-md w-full max-w-[520px] overflow-hidden">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-[#eaeaec] px-6 py-4">
          <h2 className="text-[18px] font-semibold text-[#282c3f]">
            {product.existingReview ? "Edit Review" : "Rate & Review Product"}
          </h2>

          <button onClick={onClose} className="text-[#696b79]">
            <X size={22} />
          </button>
        </div>

        {/* Product */}

        <div className="px-6 py-6">
          <div className="flex gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 rounded object-cover border"
            />

            <div>
              <h3 className="font-semibold text-[#282c3f]">{product.name}</h3>

              <p className="mt-2 text-sm text-[#696b79]">
                Size: {product.size || "-"}
              </p>

              <p className="text-sm text-[#696b79]">Qty: {product.quantity}</p>
            </div>
          </div>
          {/* Rating */}

          <div className="mt-8">
            <h4 className="text-[15px] font-semibold text-[#282c3f]">
              Your Rating
            </h4>

            <div className="mt-3">
              <StarRating value={rating} onChange={setRating} size={34} />
            </div>
          </div>

          {/* Comment */}

          <div className="mt-8">
            <h4 className="text-[15px] font-semibold text-[#282c3f]">
              Write Your Review
            </h4>

            <textarea
              rows={6}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike about this product?"
              className="mt-3 w-full border border-[#d4d5d9] rounded-md p-4 text-[14px] resize-none outline-none focus:border-[#ff3f6c]"
            />
          </div>
          {/* Footer */}

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 border border-[#d4d5d9] rounded font-medium hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              disabled={loading || rating === 0}
              onClick={() =>
                onSubmit({
                  rating,
                  comment,
                })
              }
              className="bg-[#ff3f6c] hover:bg-[#ff527b] disabled:bg-[#ffb3c4] text-white font-semibold px-6 py-2 rounded"
            >
              {loading
                ? "Submitting..."
                : product.existingReview
                  ? "Update Review"
                  : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
