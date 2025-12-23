"use client";
import { SubCategories } from "@/lib/processDataApi/processData";
import { FirebaseService } from "@/lib/processDataOrganic/processData";
// categoryContext.ts
import { createContext, useState, Dispatch, SetStateAction } from "react";

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
  selectedOrganicService: FirebaseService[] | null;
  setSelectedOrganicService: Dispatch<SetStateAction<FirebaseService[] | null>>;
  organicServiceByCategory: string[] | null;
  setOrganicServiceByCategory: Dispatch<SetStateAction<string[] | null>>;
}

export const CategoryContext = createContext<CategoryContextType>({
  selectedCategoryApi: null,
  setSelectedCategoryApi: () => {},
  selectedSubCategoryDb: null,
  setSelectedSubcategoryDb: () => {},
  showFundingModal: true,
  setShowFundingModal: () => {},
  showWithdrawModal: true,
  setShowWithdrawModal: () => {},
  dbServiceId: "",
  setDbServiceId: () => {},
  selectedOrganicService: null,
  setSelectedOrganicService: () => {},
  organicServiceByCategory: null,
  setOrganicServiceByCategory: () => {},
});

// CategoryProvider component
export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [selectedCategoryApi, setSelectedCategoryApi] = useState<string | null>(
    ""
  );
  const [selectedSubCategoryDb, setSelectedSubcategoryDb] = useState<
    SubCategories[] | null
  >([]);
  const [selectedOrganicService, setSelectedOrganicService] = useState<
    FirebaseService[] | null
  >([]);
  const [organicServiceByCategory, setOrganicServiceByCategory] = useState<string[] | null>(null);
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [dbServiceId, setDbServiceId] = useState<string | null>("");
  return (
    <CategoryContext.Provider
      value={{
        showFundingModal,
        setShowFundingModal,
        selectedCategoryApi,
        setSelectedCategoryApi,
        selectedSubCategoryDb,
        setSelectedSubcategoryDb,
        showWithdrawModal,
        setShowWithdrawModal,
        dbServiceId,
        setDbServiceId,
        selectedOrganicService,
        setSelectedOrganicService,
        organicServiceByCategory,
        setOrganicServiceByCategory
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}
