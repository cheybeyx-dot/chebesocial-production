"use client";

import React, { useState, useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { CategoryContext } from "@/context/CategoryProvider";
import { Card } from "@/components/ui/card";

const resolveSchema = z.object({
  type: z.literal("resolve"),
  platform: z.string().min(1, "Platform is required"),
  issueType: z.string().min(1, "Issue type is required"),
  profileLink: z.string().url("Enter a valid profile link"),
  issueDescription: z.string().min(10, "Please describe the issue clearly"),
});

type ResolveFormData = z.infer<typeof resolveSchema>;

interface ResolveAccountProps {
  user: string;
}

export default function BuyAccountForm({}: ResolveAccountProps) {
  const { selectedPlatformApi } = useContext(CategoryContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResolveFormData>({
    resolver: zodResolver(resolveSchema),
    defaultValues: {
      type: "resolve",
      platform: "",
      issueType: "",
      profileLink: "",
      issueDescription: "",
    },
  });

  const handleSubmit: SubmitHandler<ResolveFormData> = async () => {
    setIsSubmitting(true);

    // Manual review only — no automation here
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      {/* PLATFORM */}
      <Select
        onValueChange={(v) => form.setValue("platform", v)}
        value={form.watch("platform")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select platform" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Instagram">Instagram</SelectItem>
          <SelectItem value="Facebook">Facebook</SelectItem>
          <SelectItem value="TikTok">TikTok</SelectItem>
          <SelectItem value="Twitter / X">Twitter / X</SelectItem>
        </SelectContent>
      </Select>

      {/* ISSUE TYPE */}
      <Select
        onValueChange={(v) => form.setValue("issueType", v)}
        value={form.watch("issueType")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select issue type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Disabled Account">
            Disabled / Suspended Account
          </SelectItem>
          <SelectItem value="Locked Account">Locked Account</SelectItem>
          <SelectItem value="Hacked Account">Hacked Account</SelectItem>
          <SelectItem value="Verification Issue">
            Verification / Appeal Issue
          </SelectItem>
        </SelectContent>
      </Select>

      {/* PROFILE LINK */}
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="profileLink"
        label="Profile Link"
        placeholder="https://instagram.com/username"
        description="Paste the exact profile link affected"
      />

      {/* ISSUE DESCRIPTION */}
      <CustomFormField
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="issueDescription"
        label="Describe Your Issue"
        placeholder="Explain what happened, when it happened, and any action you've taken"
        description="The more details you provide, the faster resolution begins"
      />

      {/* NOTICE */}
      <Card className="p-3 text-xs text-muted-foreground">
        ⚠️ This service is handled manually. Resolution time depends on platform
        response and issue complexity. No instant fixes.
      </Card>

      <Button className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit for Review"}
      </Button>
    </form>
  );
}
