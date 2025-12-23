import type React from "react";
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
import type { Service } from "@/lib/processDataApi/processData";

import { useState, useCallback, useContext, useEffect } from "react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { useFirestoreCRUD } from "@/context/DatabaseHook";
import { where } from "firebase/firestore";
import { CategoryContext } from "@/context/admin/AdminCatProvider";
import { ApiService } from "@/components/users/OrderFormSection";
import { toast } from "sonner";

interface ApiServicesProps {
  servicesByCategory: Record<string, Service[]>;
  selectedCategoryApi: string | null;
  user: string;
  setApiService: (service: ApiService | null) => void;
}

export default function AdminApiServices({
  servicesByCategory,
  selectedCategoryApi,
  user,
  setApiService,
}: ApiServicesProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { collectionData, addCollection, listenToCollection } =
    useFirestoreCRUD();
  const { setSelectedServiceApi, setDbServiceId } = useContext(CategoryContext);
  const apiServiceSchema = z.object({
    service: z.string().min(1, "Service is required").optional(),
    description: z.string().min(1, "Description is required"),
    quantity: z.coerce
      .number()
      .refine(
        (val) =>
          !selectedService ||
          (val >= Number(selectedService.min) &&
            val <= Number(selectedService.max)),
        () => ({
          message: `Quantity must be between ${selectedService?.min || 0} and ${
            selectedService?.max || 0
          }`,
        })
      )
      .optional(),
    rate: z.number().optional(),
    hours: z.coerce.number().min(0).max(23, "Hours must be between 0 and 23"),
    minutes: z.coerce
      .number()
      .min(0)
      .max(59, "Minutes must be between 0 and 59"),
  });

  type ApiServiceFormData = z.infer<typeof apiServiceSchema>;

  const form = useForm<ApiServiceFormData>({
    resolver: zodResolver(apiServiceSchema),
    defaultValues: {
      service: "",
      quantity: 0,
      rate: Number(selectedService?.rate) || 0,
      description: "",
      hours: 0,
      minutes: 0,
    },
  });
  useEffect(() => {
    const unsubscribeApiService = user
      ? listenToCollection("classic-media-api-services", [
          where("serviceId", "==", selectedService && selectedService?.service),
        ])
      : () => {};
    return () => {
      unsubscribeApiService();
    };
  }, [listenToCollection, selectedService, selectedService?.service, user]);
  useEffect(() => {
    if (collectionData.length > 0) {
      setApiService(collectionData[0] as ApiService);
    }
  }, [collectionData, setApiService]);
  useEffect(() => {
    if (collectionData.length > 0) {
      setSelectedServiceApi(collectionData[0] as ApiService);
    } else {
      setDbServiceId(selectedService as string | null);
      setSelectedServiceApi(null);
    }
  }, [collectionData, selectedService, setDbServiceId, setSelectedServiceApi]);
  const handleServiceChange = (value: string) => {
    const service = servicesByCategory[selectedCategoryApi!].find(
      (s) => s.service === value
    );
    setSelectedService(service || null);
    form.setValue("service", value);
    form.setValue("quantity", Number(service?.min) || 1);
    form.setValue("rate", Number(service?.rate) || 0);
  };

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const quantity = Number(event.target.value);
    form.setValue("quantity", quantity);
  };

  const handleSubmitOrder: SubmitHandler<ApiServiceFormData> = useCallback(
    async (data: ApiServiceFormData) => {
      const { service, description, hours, minutes } = data;
      setIsSubmitting(true);
      try {
        if (!description || hours === undefined || minutes === undefined) {
          toast("Error",{
            description: "Please fill in all required fields.",
            className: "bg-red-500 text-white",
          });
          return;
        }
        listenToCollection("classic-media-api-services", [
          where("serviceId", "==", service),
        ]);
        if (
          collectionData.length > 0 &&
          collectionData[0]?.serviceId === service
        ) {
          toast("Error",{
            description: "Service already exists.",
            className: "bg-red-500 text-white",
          });
          return;
        }
        await addCollection("classic-media-api-services", {
          serviceId: service,
          description,
          hours,
          minutes,
          serviceName: selectedService?.category,
        });
        toast("Success",{
          description: "Order created successfully.",
          className: "bg-green-500 text-white",
        });
        form.reset();
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
    [
      listenToCollection,
      collectionData,
      addCollection,
      selectedService?.category,
      form,
    ]
  );

  return (
    <form onSubmit={form.handleSubmit(handleSubmitOrder)} className="space-y-4">
      <Select onValueChange={handleServiceChange} value={form.watch("service")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Service" />
        </SelectTrigger>
        <SelectContent>
          {selectedCategoryApi &&
            servicesByCategory[selectedCategoryApi].map((service) => (
              <SelectItem key={service.service} value={String(service.service)}>
                {service.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="quantity"
        label="Quantity"
        placeholder="100"
        type="number"
        onChange={handleQuantityChange}
        error={form.formState.errors.quantity?.message || ""}
        disabled={true}
      />
      {selectedService && <ServiceDetails service={selectedService} />}
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
        label="Estimated rate"
        placeholder="Value in USD"
        disabled={true}
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
      <Button className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Add Description"}
      </Button>
    </form>
  );
}

function ServiceDetails({ service }: { service: Service }) {
  return (
    <span className="text-sm text-gray-600">
      Min Order Qty: {service.min} - Max Order Qty: {service.max}
    </span>
  );
}
