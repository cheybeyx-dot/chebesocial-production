import { z } from "zod";
import type { Service, SubCategories } from "../processDataApi/processData";

export const createFormSchema = (
  selectedService: string | null,
  servicesByCategory: Record<string, Service[]>,
  selectedCategoryApi: string | null,
  selectedSubCategoryDb: SubCategories[] | null
) => {
  const currentService =
    selectedCategoryApi && selectedService
      ? servicesByCategory[selectedCategoryApi].find(
          (s) => s.service === selectedService
        )
      : null;

  const currentSubCategory =
    selectedSubCategoryDb && selectedService
      ? selectedSubCategoryDb?.find((sc) => sc.value === selectedService)
      : null;

  const baseSchema = {
    quantity: z.coerce
      .number()
      .min(
        Number(
          currentService?.min ?? currentSubCategory?.minOrderQuantity ?? 1
        ),
        `Minimum order quantity is ${
          currentService?.min ?? currentSubCategory?.minOrderQuantity ?? 1
        }`
      )
      .max(
        Number(
          currentService?.max ?? currentSubCategory?.maxOrderQuantity ?? 100
        ),
        `Maximum order quantity is ${
          currentService?.max ?? currentSubCategory?.maxOrderQuantity ?? 100
        }`
      ),
    price: z.number().min(0, "Price must be non-negative"),
  };

  return z.discriminatedUnion("type", [
    z.object({
      type: z.literal("buyAccount"),
      ...baseSchema,
      adlink: z.string().optional(),
    }),
    z.object({
      type: z.literal("regular"),
      ...baseSchema,
      adlink: z
        .string()
        .min(1, "URL is required")
        .url("Please enter a valid URL"),
    }),
    z.object({
      type: z.literal("api"),
      ...baseSchema,
      service: z.string().min(1, "Service is required"),
      adlink: z
        .string()
        .min(1, "URL is required")
        .url("Please enter a valid URL"),
    }),
  ]);
};
