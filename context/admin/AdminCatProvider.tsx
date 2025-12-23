"use client";

import { createContext, useState, Dispatch, SetStateAction } from "react";
import { ApiService } from "@/components/users/OrderFormSection";
import { SubCategories } from "@/lib/processDataApi/processData";

export interface CategoryContextType {
  selectedCategoryApi: string | null;
  setSelectedCategoryApi: Dispatch<SetStateAction<string | null>>;

  selectedSubCategoryDb: SubCategories[] | null;
  setSelectedSubcategoryDb: Dispatch<SetStateAction<SubCategories[] | null>>;

  showFundingModal: boolean;
  setShowFundingModal: Dispatch<SetStateAction<boolean>>;

  showWithdrawModal: boolean;
  setShowWithdrawModal: Dispatch<SetStateAction<boolean>>;

  dbServiceId: string | null;
  setDbServiceId: Dispatch<SetStateAction<string | null>>;

  selectedServiceApi: ApiService | null;
  setSelectedServiceApi: Dispatch<SetStateAction<ApiService | null>>;

  organicServiceByCategory: string[] | null;
  setOrganicServiceByCategory: Dispatch<SetStateAction<string[] | null>>;
}

/**
 * Throws error if used outside Provider
 * (prevents silent bugs)
 */
export const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [selectedCategoryApi, setSelectedCategoryApi] = useState<string | null>(
    null
  );

  const [selectedSubCategoryDb, setSelectedSubcategoryDb] = useState<
    SubCategories[] | null
  >(null);

  const [showFundingModal, setShowFundingModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const [dbServiceId, setDbServiceId] = useState<string | null>(null);

  const [selectedServiceApi, setSelectedServiceApi] =
    useState<ApiService | null>(null);

  const [organicServiceByCategory, setOrganicServiceByCategory] = useState<
    string[] | null
  >(null);

  return (
    <CategoryContext.Provider
      value={{
        selectedCategoryApi,
        setSelectedCategoryApi,
        selectedSubCategoryDb,
        setSelectedSubcategoryDb,
        showFundingModal,
        setShowFundingModal,
        showWithdrawModal,
        setShowWithdrawModal,
        dbServiceId,
        setDbServiceId,
        selectedServiceApi,
        setSelectedServiceApi,
        organicServiceByCategory,
        setOrganicServiceByCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}
