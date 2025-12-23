import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllReviews, approveReview } from "@/lib/firebase/reviews";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Reviews</h1>

      {reviews.map((r) => (
        <Card key={r.id} className="p-4 space-y-2">
          <div>User: {r.user}</div>
          <div>Rating: ⭐ {r.rating}</div>
          <p>{r.comment}</p>

          {!r.approved && (
            <form
              action={async () => {
                "use server";
                await approveReview(r.id);
              }}
            >
              <Button size="sm">Approve</Button>
            </form>
          )}

          {r.approved && (
            <span className="text-xs text-green-600">Approved</span>
          )}
        </Card>
      ))}
    </div>
  );
}
