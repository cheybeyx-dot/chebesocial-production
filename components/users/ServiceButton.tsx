"use client";

import { Button } from "@/components/ui/button";
import { CategoryContext } from "@/context/CategoryProvider";
import Image from "next/image";
import { useContext } from "react";

interface CategoryButtonProps {
  category: string;
  iconPath: string; // Changed from iconName to iconPath
  serviceCount: number;
  isSelected: boolean;
}

export default function CategoryButton({
  category,
  iconPath,
  serviceCount,
  isSelected,
}: CategoryButtonProps) {
  const { setSelectedCategoryApi, setSelectedSubcategoryDb, setDbServiceId } =
    useContext(CategoryContext);

  return (
    <Button
      className="w-full h-full flex flex-col items-center justify-center py-2 px-2 rounded-lg text-center"
      variant={isSelected ? "default" : "outline"}
      onClick={() => {
        setSelectedCategoryApi(category);
        setSelectedSubcategoryDb(null);
        setDbServiceId(null);
      }}
    >
      <div className="relative w-6 h-6">
        <Image
          src={iconPath}
          alt={`${category} icon`}
          fill
          className="object-contain"
        />
      </div>
      <span className="font-medium">{category}</span>
      <p className="text-xs opacity-70">{serviceCount} services</p>
    </Button>
  );
}
