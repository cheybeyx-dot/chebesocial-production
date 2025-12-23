"use client";

import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowBigDown } from "lucide-react";
import { FirebaseService } from "@/lib/processDataOrganic/processData";
import { useEffect, useState } from "react";
import { CategoryContext } from "@/context/admin/AdminCatProvider";
interface OrganicServiceProps {
  organicCategories: string[];
  organicServicesByCategory: Record<string, FirebaseService[]>;
}

export default function OrganicService({
  organicCategories,
}: OrganicServiceProps) {
  const {
    setSelectedCategoryApi,
    selectedCategoryApi,
    setOrganicServiceByCategory,
  } = useContext(CategoryContext);
  const [isDataReady, setIsDataReady] = useState(false);

  // Wait for data to be fully available
  useEffect(() => {
    if (organicCategories) {
      setIsDataReady(true);
    }
  }, [organicCategories]);
  const handleClick = () => {
    setSelectedCategoryApi("organic");
    setOrganicServiceByCategory(organicCategories);
  };
  // Ensure we have the data before proceeding
  /*  if (isDataReady && organicCategories) {
    setSelectedSubcategoryDb(null);
    setSelectedCategoryApi("organic");
    setDbServiceId(null);
    setOrganicServiceByCategory(organicCategories);
  } */
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
          variant={selectedCategoryApi === "organic" ? "default" : "outline"}
          onClick={handleClick}
        >
          <ArrowBigDown className="size-16 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-y-1 animate-bounce" />
          <span className="truncate font-bold">Admin Organic Services</span>
        </Button>
      </div>
    </Card>
  );
}
