"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, RefreshCw } from "lucide-react";

interface UserFiltersProps {
  statusFilter: string | null;
  setStatusFilter: (value: string | null) => void;
}

export function UserFilters({
  setStatusFilter,
}: UserFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => setStatusFilter(null)}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Reset Filters
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
            Has Pending Orders
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusFilter("hasBalance")}>
            Has Balance
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusFilter("noBalance")}>
            No Balance
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
