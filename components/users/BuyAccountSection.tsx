"use client";

import React, { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SubCategories } from "@/lib/processDataApi/processData";
import { CategoryContext } from "@/context/CategoryProvider";
import { ArrowBigDown } from "lucide-react";

interface BuyAccountSectionProps {
  logoUrl: string;
  name: string;
  serviceId: string;
  subCategories: SubCategories[] | undefined;
}

export default function BuyAccountSection({
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
     <Card className="mb-2 py-2 w-full md:w-2/3 lg:w-1/2 mx-auto">
      <div className="flex items-center justify-center h-auto">
        <Button
          className="w-full justify-center items-center bg-green-500 hover:bg-green-600 transition-all duration-300 hover:scale-105 active:scale-95 group text-lg py-6"
          variant={serviceId === dbServiceId ? "default" : "outline"}
          onClick={handleClick}
        >
          <ArrowBigDown className="size-16 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-y-1 animate-bounce" />
          <span className="truncate font-bold">{name}</span>
        </Button>
      </div>
    </Card>
  );
}
