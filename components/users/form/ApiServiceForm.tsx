"use client";

import React, { useContext, useState, useCallback, useEffect } from "react";
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
import type { Service } from "@/lib/processDataApi/processData";
import { Card } from "@/components/ui/card";

const apiOrderSchema = z.object({
  type: z.literal("api"),
  service: z.string().min(1, "Service is required"),
  adlink: z.string().url("Please enter a valid link"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0),
});

type ApiOrderFormData = z.infer<typeof apiOrderSchema>;

interface ApiServicesProps {
  servicesByCategory: Record<string, Service[]>;
  selectedCategoryApi: string | null;
  user: string;
  setSelectedServiceApi: (value: string | null) => void;
  setApiService: (value: any) => void;
}

export default function ApiServices({
  servicesByCategory,
  selectedCategoryApi,
  setSelectedServiceApi,
  setApiService,
}: ApiServicesProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { selectedPlatformApi } = useContext(CategoryContext);

  const form = useForm<ApiOrderFormData>({
    resolver: zodResolver(apiOrderSchema),
    defaultValues: {
      type: "api",
      service: "",
      adlink: "",
      quantity: 1,
      price: 0,
    },
  });

  const services =
    selectedCategoryApi && selectedPlatformApi
      ? servicesByCategory[selectedPlatformApi] || []
      : [];

  const handleServiceChange = (value: string) => {
    const service = services.find((s) => s.serviceId === value) || null;
    setSelectedService(service);
    setSelectedServiceApi(value);
    setApiService(service);
    form.setValue("service", value);
    form.setValue("quantity", service?.minQty || 1);
    form.setValue("price", service?.rate || 0);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const qty = Number(event.target.value);
    if (selectedService) {
      form.setValue("price", selectedService.rate * qty);
    }
  };

  return (
    <form className="space-y-4">
      {/* SERVICE SELECTION */}
      <Select onValueChange={handleServiceChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select API Service" />
        </SelectTrigger>
        <SelectContent>
          {services.map((service) => (
            <SelectItem key={service.serviceId} value={service.serviceId}>
              {service.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedService && (
        <p className="text-xs text-muted-foreground">
          {selectedService.description}
        </p>
      )}

      {/* LINK INPUT */}
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="adlink"
        label="Target Link"
        placeholder="https://example.com/post"
        description="Paste the link where the service should be delivered"
      />

      {/* QUANTITY */}
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="quantity"
        label="Quantity"
        type="number"
        onChange={handleQuantityChange}
        description={`Min: ${selectedService?.minQty ?? 1} — Max: ${
          selectedService?.maxQty ?? "∞"
        }`}
      />

      {/* PRICE DISPLAY */}
      <Card className="p-3 text-sm">
        <span className="font-medium">Total Price:</span> ₦
        {form.watch("price").toLocaleString()}
      </Card>

      <Button className="w-full" disabled>
        API Orders Are Auto-Processed
      </Button>
    </form>
  );
}
