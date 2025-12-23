"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { resolveAccountSchema } from "@/lib/validators/orderSchemas";
import { validateInput } from "@/lib/validators/validate";

export default function ResolveAccountForm({ user }: { user: string }) {
  const [platform, setPlatform] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    const validation = validateInput(resolveAccountSchema, {
      userId: user,
      email: user,
      platform,
      issueDescription,
    });

    if (!validation.success) {
      setError(validation.error);
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "account_issues"), {
        ...validation.data,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setPlatform("");
      setIssueDescription("");
    } catch (err) {
      setError("Failed to submit request. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-5 space-y-4">
      <h3 className="text-lg font-semibold">Account Support & Recovery</h3>

      <Input
        placeholder="Platform (e.g. Instagram, Facebook)"
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      />

      <Textarea
        placeholder="Describe your issue in detail"
        value={issueDescription}
        onChange={(e) => setIssueDescription(e.target.value)}
        rows={5}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">
          Request submitted successfully.
        </p>
      )}

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit Request"}
      </Button>
    </Card>
  );
}
