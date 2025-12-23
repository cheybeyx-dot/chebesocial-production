"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import type { UserSearchParams } from "@/types";
import { useDebounce } from "@/hooks/use-debounce";

interface UserSearchProps {
  onSearch: (params: UserSearchParams) => void;
  searchParams: UserSearchParams;
}

export function UserSearch({ onSearch, searchParams }: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState(searchParams.query);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm !== searchParams.query) {
      onSearch({
        ...searchParams,
        query: debouncedSearchTerm,
        offset: 0, // Reset to first page when searching
      });
    }
  }, [debouncedSearchTerm, onSearch, searchParams]);

  return (
    <div className="flex items-center mt-4">
      <Search className="h-4 w-4 mr-2 text-muted-foreground" />
      <Input
        placeholder="Search users by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}
