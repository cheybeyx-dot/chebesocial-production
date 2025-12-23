"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getFaqById, updateFaq } from "@/lib/firebase/faq";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export default function EditFaqPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFaq() {
      try {
        const faq = await getFaqById(id);
        if (!faq) {
          alert("FAQ not found");
          router.push("/admin/faq");
          return;
        }

        setQuestion(faq.question);
        setAnswer(faq.answer);
        setIsPublished(faq.isPublished);
      } catch (error) {
        console.error(error);
        alert("Failed to load FAQ");
      } finally {
        setLoading(false);
      }
    }

    fetchFaq();
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await updateFaq(id, {
        question,
        answer,
        isPublished,
      });

      router.push("/admin/faq");
    } catch (error) {
      console.error(error);
      alert("Failed to update FAQ");
    }
  }

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-2xl">
      <Card className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Edit FAQ</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Question</label>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Answer</label>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            <span className="text-sm">Published</span>
          </div>

          <Button type="submit">Update FAQ</Button>
        </form>
      </Card>
    </div>
  );
}
