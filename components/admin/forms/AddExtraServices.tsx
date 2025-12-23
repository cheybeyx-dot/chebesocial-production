"use client";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState, useCallback, useContext, useMemo } from "react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { useFirestoreCRUD } from "@/context/DatabaseHook";
import { CategoryContext } from "@/context/admin/AdminCatProvider";
import type { ApiService } from "@/components/users/OrderFormSection";
import type { FormattedServiceData } from "@/lib/action/organicMockData.action";
import type { FirebaseService } from "@/lib/processDataOrganicAdmin/processData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
interface ApiServicesProps {
  selectedCategoryApi: string | null;
  user: string;
  setApiService: (service: ApiService | null) => void;
  organicServices: FormattedServiceData[];
  organicServicesByCategory: Record<string, FirebaseService[]>;
}
export default function AdminExtraServices({
  organicServices,
  organicServicesByCategory,
}: ApiServicesProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [listOfSelectedServices, setListOfSelectedServices] = useState<
    FirebaseService[]
  >([]);
  const [selectedService, setSelectedService] =
    useState<FirebaseService | null>(null);
  const router = useRouter();
  const { addCollection, updateDocument, deleteDocument } = useFirestoreCRUD();
  const { selectedCategoryApi } = useContext(CategoryContext);

  const apiServiceSchema = z.object({
    category: z.string().min(1, "Category is required"),
    service: z.string().min(1, "Service is required").optional(),
    description: z.string().min(1, "Description is required"),
    minQty: z.coerce
      .number()
      .min(1, "Cannot be less than 1")
      .max(1000000, "Maximum of 1000000 required"),
    maxQty: z.coerce
      .number()
      .min(1, "Cannot be less than 1")
      .max(1000000, "Maximum of 1000000 required"),
    rate: z.coerce
      .number()
      .min(1, "Cannot be less than 1")
      .max(100000, "Maximum of 100000 required"),
    hours: z.coerce.number().min(0).max(23, "Hours must be between 0 and 23"),
    minutes: z.coerce
      .number()
      .min(0)
      .max(59, "Minutes must be between 0 and 59"),
    subService: z.string().min(1, "Sub service is required"),
  });

  type ApiServiceFormData = z.infer<typeof apiServiceSchema>;

  const form = useForm<ApiServiceFormData>({
    resolver: zodResolver(apiServiceSchema),
    defaultValues: {
      category: "",
      service: "",
      minQty: 0,
      maxQty: 0,
      rate: 0,
      description: "",
      hours: 0,
      minutes: 0,
      subService: "",
    },
  });

  const resetForm = useCallback(() => {
    form.reset({
      category: "",
      service: "",
      minQty: 0,
      maxQty: 0,
      rate: 0,
      description: "",
      hours: 0,
      minutes: 0,
      subService: "",
    });
    setIsEditMode(false);
    setServiceId(null);
    setSelectedService(null);
  }, [form]);

  const handleServiceChange = useCallback(
    (value: string) => {
      // Filter services that match the selected category
      const services = organicServices?.filter((s) =>
        s.serviceId.toLowerCase().includes(value.toLowerCase())
      );
      setListOfSelectedServices(services || []);
      form.setValue("category", value);

      // Reset subService when category changes
      form.setValue("subService", "");
      setSelectedService(null);
    },
    [organicServices, form]
  );
  console.log(selectedService);
  const handleSubServiceChange = useCallback(
    (value: string) => {
      // Find the exact service by serviceId
      const service = organicServices?.find((s) => s.serviceId === value);
      if (service) {
        setSelectedService(service);
        setIsEditMode(true);
        setServiceId(service.id || null);

        form.setValue("subService", value);
        form.setValue("service", service.serviceId || "");
        form.setValue("description", service.description || "");
        form.setValue("minQty", service.minQty || 0);
        form.setValue("maxQty", service.maxQty || 0);
        form.setValue("rate", service.rate || 0);
        form.setValue("hours", service.hours || 0);
        form.setValue("minutes", service.minutes || 0);
      }
    },
    [organicServices, form]
  );

  const handleSubmitOrder: SubmitHandler<ApiServiceFormData> = useCallback(
    async (data: ApiServiceFormData) => {
      const {
        service,
        category,
        description,
        minQty,
        maxQty,
        rate,
        hours,
        minutes,
      } = data;
      setIsSubmitting(true);
      try {
        if (
          !description ||
          !category ||
          hours === undefined ||
          minutes === undefined ||
          minQty === undefined ||
          maxQty === undefined ||
          rate === undefined ||
          !service
        ) {
          toast("Error",{
            description: "Please fill in all required fields.",
            className: "bg-red-500 text-white",
          });
          return;
        }

        if (isEditMode && serviceId) {
          // Update existing service
          await updateDocument("classic-media-extra-services", serviceId, {
            serviceId: service,
            category,
            description,
            hours,
            minutes,
            minQty,
            maxQty,
            rate,
          });
          toast("Success",{
            description: "Service updated successfully.",
            className: "bg-green-500 text-white",
          });
        } else {
          // Check if service already exists when creating new
          const existingService = organicServices?.find(
            (s) => s.serviceId === service
          );
          if (existingService) {
            toast("Error",{
              description: "Service already exists.",
              className: "bg-red-500 text-white",
            });
            return;
          }

          // Create new service
          await addCollection("classic-media-extra-services", {
            serviceId: service,
            category,
            description,
            hours,
            minutes,
            minQty,
            maxQty,
            rate,
          });
          toast("Success",{
            description: "Service created successfully.",
            className: "bg-green-500 text-white",
          });
        }
        router.refresh();
        resetForm();
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
    [addCollection, updateDocument, organicServices, isEditMode, serviceId, resetForm, router]
  );

  const handleDeleteService = useCallback(async () => {
    if (!serviceId) return;

    setIsSubmitting(true);
    try {
      await deleteDocument("classic-media-extra-services", serviceId);
      toast("Success",{
        description: "Service deleted successfully.",
        className: "bg-green-500 text-white",
      });
      router.refresh();
      resetForm();
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
  }, [deleteDocument, serviceId, resetForm, router]);

  const categoryOptions = useMemo(() => {
    if (selectedCategoryApi !== "organic") return [];

    return Object.entries(organicServicesByCategory).map(
      ([category, services]) => {
        const iconName = services[0]?.iconPath;
        return (
          <SelectItem key={category} value={category}>
            <div className="flex items-center gap-2 w-full">
              {iconName && (
                <div className="relative h-6 w-6 flex-shrink-0">
                  <Image
                    src={iconName || "/placeholder.svg"}
                    loading="lazy"
                    alt={`${category} icon`}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
              )}
              <span>{category}</span>
            </div>
          </SelectItem>
        );
      }
    );
  }, [organicServicesByCategory, selectedCategoryApi]);

  const subServiceOptions = useMemo(() => {
    return listOfSelectedServices?.map((subcat) => (
      <SelectItem key={subcat.serviceId} value={subcat.serviceId}>
        {subcat.serviceId}
      </SelectItem>
    ));
  }, [listOfSelectedServices]);

  // Check if category is selected
  const isCategorySelected = !!form.watch("category");

  return (
    <form onSubmit={form.handleSubmit(handleSubmitOrder)} className="space-y-4">
      <Select
        onValueChange={handleServiceChange}
        value={form.watch("category")}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>{categoryOptions}</SelectContent>
      </Select>

      <Select
        onValueChange={handleSubServiceChange}
        value={form.watch("subService")}
        disabled={!isCategorySelected}
      >
        <SelectTrigger
          className={`w-full ${
            !isCategorySelected ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <SelectValue
            placeholder={
              isCategorySelected
                ? "Select a service"
                : "Select a category first"
            }
          />
        </SelectTrigger>
        <SelectContent>{subServiceOptions}</SelectContent>
      </Select>

      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="service"
        label="Name of service"
        placeholder="Enter service"
        error={form.formState.errors.service?.message || ""}
        className="border-2 border-primary rounded-md"
      />
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="minQty"
        label="Min Qty"
        placeholder="1"
        type="number"
        error={form.formState.errors.minQty?.message || ""}
      />
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="maxQty"
        label="Max Qty"
        placeholder="1000000"
        type="number"
        error={form.formState.errors.maxQty?.message || ""}
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
        name="rate"
        label="Estimated price in NGN"
        placeholder="Enter price"
        error={form.formState.errors.rate?.message || ""}
      />
      <div className="flex space-x-4">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="hours"
          label="Hours"
          placeholder="0-23"
          type="number"
          error={form.formState.errors.hours?.message || ""}
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="minutes"
          label="Minutes"
          placeholder="0-59"
          type="number"
          error={form.formState.errors.minutes?.message || ""}
        />
      </div>

      <div className="flex space-x-2">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting
            ? "Processing..."
            : isEditMode
            ? "Update Service"
            : "Add Service"}
        </Button>

        {isEditMode && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  service.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteService}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {isEditMode && (
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
