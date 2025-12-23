"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import type { ClerkUser, FirestoreUser, UserOrder } from "@/types";
import { UserActions } from "./user-actions";
import Image from "next/image";

interface UserTableProps {
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

export function UserTable({
  users,
  firestoreUsers,
  userOrders,
  statusFilter,
  setSelectedUser,
  handleApproveOrder,
  handleRejectOrder,
  handleAdjustBalance,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
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
              <TableRow key={user.id}>
                <TableCell className="font-medium whitespace-nowrap pr-4">
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
                      className="h-8 w-8 rounded-full"
                    />
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="truncate max-w-[200px]">
                  {user.emailAddresses[0]?.emailAddress}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  {user.lastSignInAt
                    ? formatDistanceToNow(new Date(user.lastSignInAt), {
                        addSuffix: true,
                      })
                    : "Never"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    N{firestoreUser?.balance || 0}
                  </div>
                </TableCell>
                <TableCell>
                  {firestoreUser?.totalOrders || 0} total
                  {hasPendingOrders && (
                    <Badge
                      variant="outline"
                      className="ml-2 bg-yellow-100 text-yellow-800"
                    >
                      {firestoreUser?.pendingOrders} pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-right">
                  <UserActions
                    user={user}
                    hasPendingOrders={hasPendingOrders || false}
                    userOrders={userOrders}
                    setSelectedUser={setSelectedUser}
                    handleApproveOrder={handleApproveOrder}
                    handleRejectOrder={handleRejectOrder}
                    handleAdjustBalance={handleAdjustBalance}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
