"use client";

import React, { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { SubCategories } from "@/lib/processDataApi/processData";
import { CategoryContext } from "@/context/admin/AdminCatProvider";

interface BuyAccountSectionProps {
  logoUrl: string;
  name: string;
  serviceId: string;
  subCategories: SubCategories[] | undefined;
}

export default function AdminBuyAccountSections({
  logoUrl,
  name,
  serviceId,
  subCategories,
}: BuyAccountSectionProps) {
  const {
    setSelectedCategoryApi,
    setSelectedSubcategoryDb,
    setDbServiceId,
    dbServiceId,
  } = useContext(CategoryContext);
  // Track whether we're ready to use the data
  const [isDataReady, setIsDataReady] = useState(false);

  // Wait for data to be fully available
  useEffect(() => {
    if (subCategories) {
      setIsDataReady(true);
    }
  }, [serviceId, subCategories]);

  const handleClick = () => {
    if (!isDataReady) {
      return;
    }
    // Ensure we have the data before proceeding
    if (subCategories && serviceId) {
      setSelectedSubcategoryDb(subCategories);
      setSelectedCategoryApi(null);
      setDbServiceId(serviceId);
    }
  };

  if (!isDataReady) {
    return (
      <Card className="mb-6 py-6">
        <div className="flex items-center justify-center h-auto">
          <div className="overflow-hidden outline-4 font-bold">
            <Button className="justify-center ml-0" variant="outline" disabled>
              Loading...
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-6 py-6">
      <div className="flex items-center justify-center h-auto">
        <div className="overflow-hidden outline-4 font-bold">
          <Button
            className="justify-center ml-0"
            variant={serviceId === dbServiceId ? "default" : "outline"}
            onClick={handleClick}
          >
            <Image
              src={logoUrl || "/assets/icons/user.svg"}
              width={24}
              height={24}
              alt="Logo"
              className="rounded-full mr-2 md:mr-6 border-gray-300"
            />
            <span className="truncate">{name}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
