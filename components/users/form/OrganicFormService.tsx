"use client";

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

import { useState, useEffect, useCallback, useContext } from "react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { CategoryContext } from "@/context/CategoryProvider";
import { useFirestoreCRUD } from "@/context/DatabaseHook";
import { toast } from "sonner";
import CurrencyConverter from "@/components/payments/ExchangeApiConversion";
import type { ApiService } from "../OrderFormSection";
import CurrencyConverterUsd from "@/components/payments/CurrencyConverter";
import { FirebaseService } from "@/lib/processDataOrganic/processData";
import Image from "next/image";
import { where } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { sendEmail } from "@/lib/action/serviceOrderMail";

interface OrganicServiceFormProps {
  user: string;
  setApiService: (value: ApiService | null) => void;
  organicServices: FirebaseService[];
  selectedCategoryApi: string | null;
  setSelectedServiceApi: (service: string | null) => void;
  setSelectedOrganicServicesDes: (service: FirebaseService | null) => void;
  organicServicesByCategory: Record<string, FirebaseService[]>;
}

export default function OrganicServiceForm({
  user,
  setApiService,
  organicServices,
  setSelectedOrganicServicesDes,
  organicServicesByCategory,
}: OrganicServiceFormProps) {
  const [selectedService, setSelectedService] =
    useState<FirebaseService | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listOfSelectedServices, setListOfSelectedServices] = useState<
    FirebaseService[]
  >([]);
  const { selectedCategoryApi } = useContext(CategoryContext);
  const { user: clerkUser } = useUser();
  const buyAccountSchema = z.object({
    type: z.literal("buyOrganicService"),
    service: z.string().min(1, "Service is required"),
    subService: z.string().min(1, "Sub service is required"),
    adlink: z.string().url("Invalid URL"),
    quantity: z.coerce.number().refine(
      (val) =>
        !selectedService ||
        (val >= selectedService.minQty && val <= selectedService.maxQty),
      () => ({
        message: `Quantity must be between ${
          selectedService?.minQty || 0
        } and ${selectedService?.maxQty || 0}`,
      })
    ),
    price: z.number().min(0, "Price must be non-negative"),
  });

  type BuyAccountFormData = z.infer<typeof buyAccountSchema>;
  const {
    documentData,
    listenToDocument,
    addCollection,
    updateBalance,
    listenToCollection,
    collectionData,
  } = useFirestoreCRUD();

  useEffect(() => {
    const unsubscribeDocument = listenToDocument("classic-media-users", user);
    return () => {
      unsubscribeDocument();
    };
  }, [listenToDocument, user]);
  useEffect(() => {
    const unsubscribeApiService = user
      ? listenToCollection("classic-media-extra-services", [
          where(
            "serviceId",
            "==",
            selectedService && selectedService?.serviceId
          ),
        ])
      : () => {};
    return () => {
      unsubscribeApiService();
    };
  }, [
    listenToCollection,
    listenToDocument,
    selectedService,
    selectedService?.serviceId,
    user,
  ]);
  useEffect(() => {
    if (collectionData.length > 0) {
      setSelectedOrganicServicesDes(collectionData[0] as FirebaseService);
    }
  }, [collectionData, setSelectedOrganicServicesDes]);

  const form = useForm<BuyAccountFormData>({
    resolver: zodResolver(buyAccountSchema),
    defaultValues: {
      type: "buyOrganicService",
      service: "",
      quantity: selectedService?.minQty || 1,
      price: 0,
      subService: "",
      adlink: "",
    },
  });

  const handleServiceChange = (value: string) => {
    // Filter services that match the selected category
    const services = organicServices?.filter((s) =>
      s.serviceId.toLowerCase().includes(value.toLowerCase())
    );
    setListOfSelectedServices(services || []);
    setSelectedService(null); // Clear the selected service when category changes
    setApiService(null);
    form.setValue("service", value); // Set the service (category) value
    form.setValue("subService", ""); // Clear the subService selection
    form.setValue("quantity", 1); // Reset quantity
    form.setValue("price", 0); // Reset price
    form.setValue("adlink", ""); // Reset adlink
  };
  const handleSubServiceChange = (value: string) => {
    // Find the exact service by serviceId
    const service = organicServices?.find((s) => s.serviceId === value);
    if (service) {
      setSelectedService(service);
      setApiService(null);
      form.setValue("subService", value);
      form.setValue("quantity", service.minQty || 1);
      updatePrice(service.minQty || 1);
    }
  };
  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const quantity = Number(event.target.value);
    updatePrice(quantity);
  };

  const updatePrice = useCallback(
    (quantity: number) => {
      if (selectedService) {
        form.setValue("price", selectedService.rate * quantity);
      }
    },
    [form, selectedService]
  );

  useEffect(() => {
    if (selectedService) {
      form.setValue("quantity", selectedService.minQty);
      updatePrice(selectedService.minQty);
    }
  }, [selectedService, form, updatePrice]);
  const handleSubmitOrder: SubmitHandler<BuyAccountFormData> = useCallback(
    async (data) => {
      const { price, adlink, quantity, service, type } = data;
      const amount = price;
      const currentBalance = documentData?.balance || 0;
      if (!currentBalance || currentBalance < amount) {
        toast("Error", {
          description: "Insufficient balance. Fund your account.",
          className: "bg-red-500 text-white",
        });
        return;
      }
      if (isSubmitting) return;

      setIsSubmitting(true);

      try {
        const orderData = {
          ...data,
          orderType: "Organic",
          approved: false,
          status: "pending",
          createdBy: user,
          userId: user,
        };

        await addCollection("classic-admin-payment", orderData);
        await updateBalance({
          userId: user,
          amount: price,
          type: "debit",
          description: `Payment for order ${selectedService?.description}`,
          category: "balance_payment",
          collectBalanceName: "classic-media-users",
        });
        await sendEmail({
          message: "User has ordered for a service",
          price,
          type,
          service,
          quantity,
          adlink,
          firstName: clerkUser?.firstName || "",
          email: clerkUser?.emailAddresses[0].emailAddress || "",
        });
        toast("Success", {
          description: "Order placed successfully",
          className: "bg-green-500 text-white",
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast("Error", {
            description: error.message,
            className: "bg-red-500 text-white",
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      documentData?.balance,
      isSubmitting,
      user,
      addCollection,
      updateBalance,
      selectedService?.description,
      clerkUser?.firstName,
      clerkUser?.emailAddresses,
    ]
  );
  return (
    <form onSubmit={form.handleSubmit(handleSubmitOrder)} className="space-y-4">
      <Select onValueChange={handleServiceChange} value={form.watch("service")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {selectedCategoryApi === "organic" &&
            Object.entries(organicServicesByCategory).map(
              ([category, services]) => {
                const iconName = services[0].iconPath;
                return (
                  <SelectItem key={category} value={category}>
                    <div className="flex items-center gap-2 w-full">
                      {iconName && (
                        <div className="relative h-6 w-6 flex-shrink-0">
                          <Image
                            src={iconName}
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
            )}
        </SelectContent>
      </Select>

      <Select
        onValueChange={handleSubServiceChange}
        value={form.watch("subService")}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a service" />
        </SelectTrigger>
        <SelectContent>
          {listOfSelectedServices?.map((subcat) => (
            <SelectItem key={subcat.serviceId} value={subcat.serviceId}>
              {subcat.serviceId}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="adlink"
        label="Enter Link"
        placeholder="https://www.example.com"
        error={form.formState.errors.adlink?.message || ""}
      />
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="quantity"
        label="Quantity"
        placeholder="1"
        type="number"
        onChange={handleQuantityChange}
        error={form.formState.errors.quantity?.message || ""}
      />
      {selectedService && <ServiceDetails service={selectedService} />}
      {/* <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="price"
        label="Rate"
        placeholder="100"
        type="number"
        onChange={handleQuantityChange}
        error={form.formState.errors.price?.message || ""}
        disabled={true}
      /> */}
      {/* Only render currency converter when price actually changes */}
      {form.watch("price") > 0 && (
        <CurrencyConverterUsd amountInNaira={form.watch("price") || 0} />
      )}

      {/* Only render currency converter when there's an actual price to convert */}
      {form.watch("price") > 0 && (
        <CurrencyConverter
          amountInNaira={form.watch("price")}
          key={`currency-${form.watch("price")}`}
        />
      )}
      <Button className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Pay for Organic"}
      </Button>
    </form>
  );
}

function ServiceDetails({ service }: { service: FirebaseService }) {
  return (
    <span className="text-sm text-gray-600">
      Min Order Qty: {service.minQty} - Max Order Qty: {service.maxQty}
    </span>
  );
}
