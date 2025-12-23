"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createFaq } from "@/lib/firebase/faq";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export default function CreateFaqPage() {
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!question || !answer) {
      alert("Question and answer are required");
      return;
    }

    try {
      setLoading(true);

      await createFaq({
        question,
        answer,
        isPublished,
      });

      router.push("/admin/faq");
    } catch (error) {
      console.error(error);
      alert("Failed to create FAQ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <Card className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Add New FAQ</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Question</label>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter the question"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Answer</label>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the answer"
              rows={5}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            <span className="text-sm">Publish immediately</span>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save FAQ"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
