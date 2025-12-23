"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitReview, getApprovedReviews } from "@/lib/firebase/reviews";

type Review = {
  id: string;
  name: string;
  message: string;
  rating: number;
};

export default function ReviewsPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function loadReviews() {
      const data = await getApprovedReviews();
      setReviews(data as Review[]);
    }
    loadReviews();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await submitReview({ name, message, rating });
      setSuccess(true);
      setName("");
      setMessage("");
      setRating(5);
    } catch {
      alert("Failed to submit review. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-12 space-y-12 max-w-3xl">
      {/* SUBMIT REVIEW */}
      <Card className="p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Leave a Review</h1>

        {success && (
          <p className="text-green-600 text-center">
            Thank you! Your review will appear after approval.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Your name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />

          <Textarea
            placeholder="Your review"
            value={message}
            required
            onChange={(e) => setMessage(e.target.value)}
          />

          <Input
            type="number"
            min={1}
            max={5}
            value={rating}
            required
            onChange={(e) => setRating(Number(e.target.value))}
            placeholder="Rating (1–5)"
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </Card>

      {/* APPROVED REVIEWS */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-center">What Our Users Say</h2>

        {reviews.length === 0 && (
          <p className="text-center text-muted-foreground">No reviews yet.</p>
        )}

        {reviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{review.name}</h3>
              <span className="text-sm">⭐ {review.rating}/5</span>
            </div>
            <p className="text-muted-foreground mt-2">{review.message}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
