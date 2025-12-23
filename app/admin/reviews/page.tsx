import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllReviews, updateReviewStatus } from "@/lib/firebase/reviews";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Review Moderation</h1>

      {reviews.length === 0 && (
        <p className="text-muted-foreground">No reviews submitted yet.</p>
      )}

      {reviews.map((review: any) => (
        <Card key={review.id} className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{review.name}</h3>
              <p className="text-sm text-muted-foreground">
                Rating: {review.rating}/5
              </p>
            </div>

            <form
              action={async () => {
                "use server";
                await updateReviewStatus(review.id, !review.approved);
              }}
            >
              <Button
                type="submit"
                variant={review.approved ? "destructive" : "default"}
              >
                {review.approved ? "Unapprove" : "Approve"}
              </Button>
            </form>
          </div>

          <p className="text-muted-foreground">{review.message}</p>

          <span className="text-xs">
            Status: {review.approved ? "Approved" : "Pending"}
          </span>
        </Card>
      ))}
    </div>
  );
}
