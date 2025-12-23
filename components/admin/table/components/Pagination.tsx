"use client";

import { Button } from "@/components/ui/button";
import { PaginationInfo } from "@/types";
import { UserSearchParams } from "@/types";

interface PaginationProps {
  paginationInfo: PaginationInfo;
  searchParams: UserSearchParams;
  onPageChange: (params: UserSearchParams) => void;
}

export function Pagination({
  paginationInfo,
  searchParams,
  onPageChange,
}: PaginationProps) {
  const { total, limit } = paginationInfo;
  const { offset } = searchParams;

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange({
        ...searchParams,
        offset: (currentPage - 2) * limit,
      });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange({
        ...searchParams,
        offset: currentPage * limit,
      });
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 py-4 mt-4">
      <Button onClick={handlePrevious} disabled={currentPage === 1}>
        Previous
      </Button>
      <span className="text-sm">
        Page {currentPage} of {totalPages || 1}
      </span>
      <Button onClick={handleNext} disabled={currentPage >= totalPages}>
        Next
      </Button>
    </div>
  );
}
