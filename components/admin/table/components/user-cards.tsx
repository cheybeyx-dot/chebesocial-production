"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  UserCheck,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ClerkUser, FirestoreUser, UserOrder } from "@/types";
import Image from "next/image";
import { toast } from "sonner";

interface UserCardsProps {
  users: ClerkUser[];
  firestoreUsers: Map<string, FirestoreUser>;
  userOrders: UserOrder[];
  statusFilter: string | null;
  setSelectedUser: (userId: string) => void;
  handleApproveOrder: (orderId: string, userId: string) => Promise<void>;
  handleRejectOrder: (orderId: string) => Promise<void>;
  handleAdjustBalance: (
    userId: string,
    amount: number,
    type: "credit" | "debit",
    description: string
  ) => Promise<void>;
  formatTimestamp: (timestamp: {
    seconds: number;
    nanoseconds: number;
  }) => string;
}

export function UserCards({
  users,
  firestoreUsers,
  userOrders,
  statusFilter,
  setSelectedUser,
  handleApproveOrder,
  handleRejectOrder,
  handleAdjustBalance,
}: UserCardsProps) {
  return (
    <div>
      {users.map((user) => {
        const firestoreUser = firestoreUsers.get(user.id);
        const hasPendingOrders =
          firestoreUser?.pendingOrders && firestoreUser.pendingOrders > 0;

        // Apply filters
        if (statusFilter === "pending" && !hasPendingOrders) return null;
        if (
          statusFilter === "hasBalance" &&
          (!firestoreUser || firestoreUser.balance <= 0)
        )
          return null;
        if (
          statusFilter === "noBalance" &&
          firestoreUser &&
          firestoreUser.balance > 0
        )
          return null;

        return (
          <Card key={user.id} className="mb-4">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Image
                    src={
                      user.imageUrl ||
                      `/placeholder.svg?height=32&width=32` ||
                      "/placeholder.svg"
                    }
                    width={32}
                    height={32}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedUser(user.id)}>
                      <UserCheck className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <DollarSign className="h-4 w-4 mr-2" />
                          Adjust Balance
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adjust User Balance</DialogTitle>
                          <DialogDescription>
                            Add or remove balance for {user.firstName}{" "}
                            {user.lastName}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Amount</label>
                            <Input
                              id={`amount-mobile-${user.id}`}
                              type="number"
                              className="col-span-3"
                              placeholder="Enter amount"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Description</label>
                            <Input
                              id={`description-mobile-${user.id}`}
                              className="col-span-3"
                              placeholder="Reason for adjustment"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              const amountInput = document.getElementById(
                                `amount-mobile-${user.id}`
                              ) as HTMLInputElement;
                              const descInput = document.getElementById(
                                `description-mobile-${user.id}`
                              ) as HTMLInputElement;
                              const amount = Number.parseFloat(
                                amountInput.value
                              );
                              const description = descInput.value;

                              if (isNaN(amount) || amount <= 0) {
                                toast("Invalid Amount",{
                                  description:
                                    "Please enter a valid amount greater than 0.",
                                  className: "bg-red-500 text-white",
                                });
                                return;
                              }

                              handleAdjustBalance(
                                user.id,
                                amount,
                                "debit",
                                description || "Admin deduction"
                              );
                            }}
                          >
                            Deduct
                          </Button>
                          <Button
                            onClick={() => {
                              const amountInput = document.getElementById(
                                `amount-mobile-${user.id}`
                              ) as HTMLInputElement;
                              const descInput = document.getElementById(
                                `description-mobile-${user.id}`
                              ) as HTMLInputElement;
                              const amount = Number.parseFloat(
                                amountInput.value
                              );
                              const description = descInput.value;

                              if (isNaN(amount) || amount <= 0) {
                                toast("Invalid Amount",{
                                  description:
                                    "Please enter a valid amount greater than 0.",
                                  className: "bg-red-500 text-white",
                                });
                                return;
                              }

                              handleAdjustBalance(
                                user.id,
                                amount,
                                "credit",
                                description || "Admin addition"
                              );
                            }}
                          >
                            Add Credit
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    {hasPendingOrders && (
                      <>
                        <DropdownMenuItem
                          onClick={() => {
                            const pendingOrders = userOrders.filter(
                              (order) =>
                                order.userId === user.id &&
                                order.status !== "success" &&
                                order.status !== "completed" &&
                                order.status !== "cancelled"
                            );

                            if (pendingOrders.length > 0) {
                              handleApproveOrder(pendingOrders[0].id, user.id);
                            }
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Order
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            const pendingOrders = userOrders.filter(
                              (order) =>
                                order.userId === user.id &&
                                order.status !== "success" &&
                                order.status !== "completed" &&
                                order.status !== "cancelled"
                            );

                            if (pendingOrders.length > 0) {
                              handleRejectOrder(pendingOrders[0].id);
                            }
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Order
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className="font-medium">N{firestoreUser?.balance || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Orders</p>
                  <p className="font-medium">
                    {firestoreUser?.totalOrders || 0} total
                    {hasPendingOrders && (
                      <Badge
                        variant="outline"
                        className="ml-2 bg-yellow-100 text-yellow-800 text-xs"
                      >
                        {firestoreUser?.pendingOrders} pending
                      </Badge>
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="text-sm">
                    {formatDistanceToNow(new Date(user.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge
                    variant={hasPendingOrders ? "outline" : "default"}
                    className={
                      hasPendingOrders
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {hasPendingOrders ? "Needs Review" : "Active"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
