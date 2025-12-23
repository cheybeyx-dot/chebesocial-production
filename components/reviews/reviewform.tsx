"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { submitReview } from "@/lib/firebase/reviews";

export default function ReviewForm({ user }: { user: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment) {
      alert("Please write a review");
      return;
    }

    try {
      setLoading(true);
      await submitReview({ user, rating, comment });
      alert("Review submitted for approval");
      setComment("");
    } catch {
      alert("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-5 space-y-4">
      <h3 className="font-semibold">Leave a Review</h3>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="w-full border rounded-md p-2"
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Stars
          </option>
        ))}
      </select>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border rounded-md p-2 min-h-[120px]"
        placeholder="Write your experience..."
      />

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </Card>
  );
}
