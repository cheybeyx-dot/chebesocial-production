import { Card } from "@/components/ui/card";
import { reviewsData } from "@/lib/reviewData";

export default function ReviewsSection() {
  const approvedReviews = reviewsData.filter((r) => r.approved);

  return (
    <section className="py-10">
      <h2 className="text-2xl font-bold text-center mb-6">
        What Our Customers Say
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {approvedReviews.map((review) => (
          <Card key={review.id} className="p-5">
            <p className="font-semibold">
              {review.name} ⭐ {review.rating}/5
            </p>
            <p className="text-sm text-muted-foreground">{review.message}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
