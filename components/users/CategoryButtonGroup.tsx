"use client";

import { useContext } from "react";
import CategoryButton from "./ServiceButton";
import { Service } from "@/lib/processDataApi/processData";
import { CategoryContext } from "@/context/CategoryProvider";

interface CategoryButtonGroupProps {
  categories: string[];
  servicesByCategory: Record<string, Service[]>;
  refLink: string;
  user: string;
}

export default function CategoryButtonGroup({
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
            <CategoryButton
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
