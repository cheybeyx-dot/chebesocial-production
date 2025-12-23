"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { toast } from "sonner";

interface ResolveAccountFormProps {
  user: string;
}

export default function ResolveAccountForm({ user }: ResolveAccountFormProps) {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);

    if (filesArray.length > 3) {
      toast("Upload limit exceeded", {
        description: "Maximum of 3 files allowed",
        className: "bg-red-500 text-white",
      });
      return;
    }

    setAttachments(filesArray);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // For now we only simulate submission
      toast("Submitted", {
        description:
          "Your account issue has been received and is under review.",
        className: "bg-green-500 text-white",
      });

      // Later: send to Firebase / Admin collection
      console.log("Resolve Request:", {
        user,
        attachments,
      });
    } catch (error) {
      toast("Error", {
        description: "Something went wrong",
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CustomFormField
        fieldType={FormFieldType.TEXTAREA}
        name="issue"
        label="Describe Your Account Issue"
        placeholder="Explain what happened to your account..."
        control={undefined as any}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Upload Proof (screenshots, emails)
        </label>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="block w-full text-sm file:rounded-md file:border-0
                     file:bg-primary file:text-white file:px-4 file:py-2
                     hover:file:bg-primary/90"
        />

        {attachments.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {attachments.length} file(s) selected
          </p>
        )}
      </div>

      <Button className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit for Review"}
      </Button>
    </form>
  );
}
