"use client";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { type Service } from "@/lib/processDataApi/processData";

import { FormData, formSchema } from "@/type";
import { CategoryContext } from "@/context/admin/AdminCatProvider";
import { ApiService } from "../users/OrderFormSection";
import AdminBuyAccountForm from "./forms/AdminBuyAccountForm";
import AdminDemoCard from "./AdminDemoCard";
import AdminApiServices from "./forms/AdminApiServiceForm";

interface OrderFormSectionProps {
  servicesByCategory: Record<string, Service[]>;
  user: string;
}

export default function AdminOrderFormSection({
  servicesByCategory,
  user,
}: OrderFormSectionProps) {
  const { selectedCategoryApi, dbServiceId } = useContext(CategoryContext);
  const [selectedServiceCategoryDb, setSelectedServiceCategoryDb] = useState<
    string | null
  >(null);

  const [apiService, setApiService] = useState<ApiService | null>(null);
  const isBuyAccount = dbServiceId === "cgqJWX1hbSib8N9qBYO9";
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: isBuyAccount ? "buyAccount" : "api",
      service: "",
      adlink: "",
      quantity: 0,
      price: 0,
    },
  });

  return (
    <Form {...form}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 shadow-lg">
            {isBuyAccount ? (
              <AdminBuyAccountForm
                setSelectedServiceCategoryDb={setSelectedServiceCategoryDb}
                user={user}
                setApiService={setApiService}
              />
            ) : (
              <AdminApiServices
                servicesByCategory={servicesByCategory}
                selectedCategoryApi={selectedCategoryApi}
                user={user}
                setApiService={setApiService}
              />
            )}
          </Card>
          <AdminDemoCard
            selectedServiceCategoryDb={selectedServiceCategoryDb}
            apiService={apiService}
          />
        </div>
      </div>
    </Form>
  );
}
