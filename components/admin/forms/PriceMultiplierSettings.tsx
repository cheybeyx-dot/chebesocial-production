"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFirestoreCRUD } from "@/context/DatabaseHook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const priceMultiplierSchema = z.object({
  priceMultiplier: z.coerce
    .number()
    .min(1, "Multiplier must be at least 1")
    .max(500, "Multiplier cannot exceed 500"),
});

type PriceMultiplierFormData = z.infer<typeof priceMultiplierSchema>;

export default function PriceMultiplierSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { documentData, addDocument, listenToDocument } = useFirestoreCRUD();
  const [initialLoaded, setInitialLoaded] = useState(false);

  const form = useForm<PriceMultiplierFormData>({
    resolver: zodResolver(priceMultiplierSchema),
    defaultValues: {
      priceMultiplier: 2, // Default initial value
    },
  });

  useEffect(() => {
    const unsubscribe = listenToDocument(
      "classic-media-settings",
      "api-pricing"
    );
    return () => {
      unsubscribe();
    };
  }, [listenToDocument]);

  // Update form value when document data changes
  useEffect(() => {
    if (documentData && documentData.priceMultiplier !== undefined) {
      form.setValue("priceMultiplier", documentData.priceMultiplier);
      setInitialLoaded(true);
    }
  }, [documentData, form]);


  const onSubmit = async (data: PriceMultiplierFormData) => {
    setIsLoading(true);
    try {
      await addDocument("classic-media-settings", "api-pricing", {
        priceMultiplier: data.priceMultiplier,
      });
      toast.success("Success", {
        description: "Price multiplier updated successfully",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Error updating price multiplier:", error);
      toast.error("Error", {
        description: "Failed to update price multiplier",
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>API Price Multiplier</CardTitle>
        <CardDescription>
          Set the multiplier used to calculate API service prices. This value
          multiplies the base rate.
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="priceMultiplier">Price Multiplier</Label>
              <Input
                id="priceMultiplier"
                type="number"
                step="0.1"
                {...form.register("priceMultiplier")}
                placeholder="Enter multiplier value"
              />
              {form.formState.errors.priceMultiplier && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.priceMultiplier.message}
                </p>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <p>
                Current formula: (Service Rate / 1000) × Quantity × Multiplier
              </p>
              <p className="mt-1">
                Example: With a multiplier of {form.watch("priceMultiplier")}, a
                service with rate 1000 and quantity 1000 would cost $
                {(1000 / 1000) * 1000 * form.watch("priceMultiplier")}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading || !initialLoaded}>
            {isLoading ? "Updating..." : "Update Price Multiplier"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
