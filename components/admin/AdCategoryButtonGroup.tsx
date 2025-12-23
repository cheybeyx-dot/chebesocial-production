"use client";

import { useContext } from "react";
import { Service } from "@/lib/processDataApi/processData";
import { CategoryContext } from "@/context/admin/AdminCatProvider";
import AdminCategoryButton from "./AdminServiceButton";

interface CategoryButtonGroupProps {
  categories: string[];
  servicesByCategory: Record<string, Service[]>;
  refLink?: string;
  user: string;
}

export default function AdminCategoryButtonGroup({
  categories,
  servicesByCategory,
}: CategoryButtonGroupProps) {
  const { selectedCategoryApi } = useContext(CategoryContext);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 m-4">
      {categories.map((category) => {
        const iconName = servicesByCategory[category][0].iconPath;
        return (
          <div
            key={category}
            className="overflow-hidden transform transition duration-300 hover:scale-105"
          >
            <AdminCategoryButton
              category={category}
              iconPath={iconName}
              serviceCount={servicesByCategory[category].length}
              isSelected={selectedCategoryApi === category}
            />
          </div>
        );
      })}
    </div>
  );
}
