"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  UserCheck,
  DollarSign,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";
import type { ClerkUser, UserOrder } from "@/types";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";

interface UserActionsProps {
  user: ClerkUser;
  hasPendingOrders: boolean;
  userOrders: UserOrder[];
  setSelectedUser: (userId: string) => void;
  handleApproveOrder: (orderId: string, userId: string) => Promise<void>;
  handleRejectOrder: (orderId: string) => Promise<void>;
  handleAdjustBalance: (
    userId: string,
    amount: number,
    type: "credit" | "debit",
    description: string
  ) => Promise<void>;
}

// Custom Modal Component
function CustomModal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function UserActions({
  user,
  hasPendingOrders,
  userOrders,
  setSelectedUser,
  handleApproveOrder,
  handleRejectOrder,
  handleAdjustBalance,
}: UserActionsProps) {
  // State for dropdown and modal
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);

  // Timeout ref for handling view details
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle view details action
  const handleViewDetails = () => {
    setIsDropdownOpen(false);

    // Use timeout to ensure dropdown is closed first
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSelectedUser(user.id);
    }, 100);
  };

  // Handle opening balance modal
  const handleOpenBalanceModal = () => {
    setIsDropdownOpen(false);

    // Use timeout to ensure dropdown is closed first
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowBalanceModal(true);
    }, 100);
  };

  // Handle balance form submission
  const handleBalanceSubmit = (
    e: React.FormEvent,
    type: "credit" | "debit"
  ) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const amount = Number.parseFloat(formData.get("amount") as string);
    const description = formData.get("description") as string;

    if (isNaN(amount) || amount <= 0) {
      toast("Invalid Amount", {
        description: "Please enter a valid amount greater than 0.",
        className: "bg-red-500 text-white",
      });
      return;
    }

    handleAdjustBalance(
      user.id,
      amount,
      type,
      description || (type === "credit" ? "Admin addition" : "Admin deduction")
    );

    // Close modal
    setShowBalanceModal(false);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleViewDetails}>
            <UserCheck className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleOpenBalanceModal}>
            <DollarSign className="h-4 w-4 mr-2" />
            Adjust Balance
          </DropdownMenuItem>

          {hasPendingOrders && (
            <DropdownMenuItem
              onClick={() => {
                const pendingOrders = userOrders.filter(
                  (order) =>
                    order.userId === user.id &&
                    order.status !== "success" &&
                    order.status !== "processing" &&
                    order.status !== "cancelled"
                );

                if (pendingOrders.length > 0) {
                  handleApproveOrder(pendingOrders[0].id, user.id);
                }
                setIsDropdownOpen(false);
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Pending Order
            </DropdownMenuItem>
          )}

          {hasPendingOrders && (
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                const pendingOrders = userOrders.filter(
                  (order) =>
                    order.userId === user.id &&
                    order.status !== "success" &&
                    order.status !== "processing" &&
                    order.status !== "cancelled"
                );

                if (pendingOrders.length > 0) {
                  handleRejectOrder(pendingOrders[0].id);
                }
                setIsDropdownOpen(false);
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Pending Order
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Custom Balance Modal - completely separate from shadcn/ui Dialog */}
      <CustomModal
        isOpen={showBalanceModal}
        onClose={() => setShowBalanceModal(false)}
        title={`Adjust Balance for ${user.firstName} ${user.lastName}`}
      >
        <form id="balance-form" className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor={`amount-${user.id}`} className="text-right">
              Amount
            </label>
            <Input
              id={`amount-${user.id}`}
              name="amount"
              type="number"
              className="col-span-3"
              placeholder="Enter amount"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor={`description-${user.id}`} className="text-right">
              Description
            </label>
            <Input
              id={`description-${user.id}`}
              name="description"
              className="col-span-3"
              placeholder="Reason for adjustment"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleBalanceSubmit(e as React.FormEvent, "debit")}
            >
              Deduct
            </Button>
            <Button
              type="button"
              onClick={(e) => handleBalanceSubmit(e as React.FormEvent, "credit")}
            >
              Add Credit
            </Button>
          </div>
        </form>
      </CustomModal>
    </>
  );
}
