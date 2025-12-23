import Link from "next/link";
import { getAllFaqs } from "@/lib/firebase/faq";
import { Button } from "@/components/ui/button";

export default async function AdminFaqPage() {
  const faqs = await getAllFaqs();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">FAQs</h1>

        <Link href="/admin/faq/new">
          <Button>Add FAQ</Button>
        </Link>
      </div>

      {faqs.length === 0 ? (
        <p className="text-muted-foreground">No FAQs created yet.</p>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="rounded-lg border p-4 flex items-start justify-between"
            >
              <div>
                <h3 className="font-medium">{faq.question}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {faq.answer}
                </p>

                <span className="text-xs mt-2 inline-block">
                  Status:{" "}
                  {faq.isPublished ? (
                    <span className="text-green-600">Published</span>
                  ) : (
                    <span className="text-orange-500">Draft</span>
                  )}
                </span>
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/faq/${faq.id}`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
