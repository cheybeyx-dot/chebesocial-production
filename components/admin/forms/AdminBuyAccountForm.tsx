"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
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
import type { SubCategories } from "@/lib/processDataApi/processData";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { useFirestoreCRUD } from "@/context/DatabaseHook";
import type { ApiService } from "@/components/users/OrderFormSection";
import { CategoryContext } from "@/context/admin/AdminCatProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BuyAccountFormProps {
  setSelectedServiceCategoryDb: (value: string) => void;
  user: string;
  setApiService: (value: ApiService | null) => void;
}

interface SubCategory {
  amount: number;
  description: string;
  maxOrderQuantity: number;
  minOrderQuantity: number;
  value: string;
}

export default function AdminBuyAccountForm({
  user,
  setApiService,
}: BuyAccountFormProps) {
  const [selectedService, setSelectedService] = useState<SubCategories | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedSubCategoryDb } = useContext(CategoryContext);
  const { listenToDocument, updateDocument, listenToDocument1 } =
    useFirestoreCRUD();
  const router = useRouter();
  const buyAccountSchema = z.object({
    type: z.literal("buyAccount"),
    service: z.string().min(1, "Service is required"),
    quantity: z.coerce.number().refine(
      (val) =>
        !selectedService ||
        (val >= selectedService.minOrderQuantity &&
          val <= selectedService.maxOrderQuantity),
      () => ({
        message: `Quantity must be between ${
          selectedService?.minOrderQuantity || 0
        } and ${selectedService?.maxOrderQuantity || 0}`,
      })
    ),
    amount: z.coerce.number().min(0, "Amount must be non-negative"),
    description: z.string().min(1, "Description is required"),
    minQty: z.coerce.number().min(0, "Min Quantity must be non-negative"),
    maxQty: z.coerce.number().min(0, "Max Quantity must be non-negative"),
  });

  type BuyAccountFormData = z.infer<typeof buyAccountSchema>;

  const form = useForm<BuyAccountFormData>({
    resolver: zodResolver(buyAccountSchema),
    defaultValues: {
      type: "buyAccount",
      service: "",
      amount: 0,
      description: "",
      minQty: 1,
      maxQty: 1,
      quantity: 1,
    },
  });

  useEffect(() => {
    const unsubscribeDocument = listenToDocument("classic-media-users", user);
    return () => {
      unsubscribeDocument();
    };
  }, [listenToDocument, user]);

  useEffect(() => {
    if (selectedService) {
      form.setValue("service", selectedService.value);
      form.setValue("amount", selectedService.amount);
      form.setValue("description", selectedService.description);
      form.setValue("minQty", selectedService.minOrderQuantity);
      form.setValue("maxQty", selectedService.maxOrderQuantity);
      form.setValue("quantity", selectedService.minOrderQuantity);
    }
  }, [selectedService, form]);

  useEffect(() => {
    const unsubscribeDocument1 = listenToDocument1(
      "classic-media-admin-services",
      "cgqJWX1hbSib8N9qBYO9"
    );
    return () => {
      unsubscribeDocument1();
    };
  }, [listenToDocument1]);
  const updateSubcategories = useCallback(
    async (formData: BuyAccountFormData) => {
      try {
        const newSubcategory: SubCategory = {
          amount: formData.amount,
          description: formData.description,
          maxOrderQuantity: formData.maxQty,
          minOrderQuantity: formData.minQty,
          value: formData.service,
        };

        const updatedSubcategories = selectedSubCategoryDb
          ? [...selectedSubCategoryDb]
          : [];
        const existingIndex = updatedSubcategories.findIndex(
          (subcat) => subcat.value === formData.service
        );

        if (existingIndex !== -1) {
          updatedSubcategories[existingIndex] = {
            ...updatedSubcategories[existingIndex],
            ...newSubcategory,
          };
        } else {
          updatedSubcategories.push(newSubcategory);
        }

        await updateDocument(
          "classic-media-admin-services",
          "cgqJWX1hbSib8N9qBYO9",
          {
            subcategories: updatedSubcategories,
          }
        );

        toast("Success",{
          description:
            existingIndex !== -1
              ? "Subcategory updated successfully"
              : "New subcategory added successfully",
          className: "bg-green-500 text-white",
        });
      } catch (error) {
        console.error("Error updating subcategories:", error);
        toast("Error",{
          description: "Failed to update subcategories",
          className: "bg-red-500 text-white",
        });
        throw error;
      }
    },
    [updateDocument, selectedSubCategoryDb]
  );

  const handleServiceChange = (value: string) => {
    const service = selectedSubCategoryDb?.find((s) => s.value === value);
    setSelectedService(service || null);
    setApiService(null);
  };

  const handleSubmitOrder: SubmitHandler<BuyAccountFormData> = useCallback(
    async (data) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      try {
        await updateSubcategories(data);

        toast("Success",{
          description: "Order placed and subcategories updated successfully",
          className: "bg-green-500 text-white",
        });
        form.reset();
        router.refresh();
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast("Error",{
            description: error.message,
            className: "bg-red-500 text-white",
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, updateSubcategories, form, router]
  );

  return (
    <form onSubmit={form.handleSubmit(handleSubmitOrder)} className="space-y-4">
      <Select onValueChange={handleServiceChange} value={form.watch("service")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a service" />
        </SelectTrigger>
        <SelectContent>
          {selectedSubCategoryDb?.map((subcat, index) => (
            <SelectItem key={index} value={subcat.value}>
              {subcat.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="service"
        label="Service"
        placeholder="Enter service"
        type="string"
        error={form.formState.errors.service?.message || ""}
      />
      <CustomFormField
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="description"
        label="Description"
        placeholder="Enter description"
        error={form.formState.errors.description?.message || ""}
      />
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="amount"
        label="Estimated price"
        placeholder="Value in USD"
        error={form.formState.errors.amount?.message || ""}
      />
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="minQty"
        label="Min Quantity"
        placeholder="Enter Quantity"
        type="number"
        error={form.formState.errors.minQty?.message || ""}
      />
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="maxQty"
        label="Max Quantity"
        placeholder="Enter max quantity"
        type="number"
        error={form.formState.errors.maxQty?.message || ""}
      />
      {selectedService && <ServiceDetails service={selectedService} />}
      <Button className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Update Services"}
      </Button>
    </form>
  );
}

function ServiceDetails({ service }: { service: SubCategories }) {
  return (
    <span className="text-sm text-gray-600">
      Min Order Qty: {service.minOrderQuantity} - Max Order Qty:{" "}
      {service.maxOrderQuantity}
    </span>
  );
}
