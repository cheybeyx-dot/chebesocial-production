import { Card } from "@/components/ui/card";
import { getPublishedFaqs } from "@/lib/firebase/faq";

export const revalidate = 60;

export default async function FAQPage() {
  const faqs = await getPublishedFaqs();

  return (
    <div className="container mx-auto py-12 max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold text-center">
        Frequently Asked Questions
      </h1>

      {faqs.length === 0 && (
        <p className="text-center text-muted-foreground">
          No FAQs available at the moment.
        </p>
      )}

      {faqs.map((faq) => (
        <Card key={faq.id} className="p-6">
          <h3 className="font-semibold text-lg">{faq.question}</h3>
          <p className="text-muted-foreground mt-2">{faq.answer}</p>
        </Card>
      ))}
    </div>
  );
}
