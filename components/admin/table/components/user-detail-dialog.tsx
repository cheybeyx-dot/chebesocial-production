"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import type { ClerkUser, FirestoreUser, UserOrder } from "@/types";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface UserDetailDialogProps {
  selectedUser: string | null;
  setSelectedUser: (userId: string | null) => void;
  users: ClerkUser[];
  firestoreUsers: Map<string, FirestoreUser>;
  userOrders: UserOrder[];
  handleApproveOrder: (orderId: string, userId: string) => Promise<void>;
  handleRejectOrder: (orderId: string) => Promise<void>;
  formatTimestamp: (timestamp: {
    seconds: number;
    nanoseconds: number;
  }) => string;
}

export function UserDetailDialog({
  selectedUser,
  setSelectedUser,
  users,
  firestoreUsers,
  userOrders,
  handleApproveOrder,
  handleRejectOrder,
  formatTimestamp,
}: UserDetailDialogProps) {
  if (!selectedUser) return null;

  const user = users.find((u) => u.id === selectedUser);
  const firestoreUser = firestoreUsers.get(selectedUser);
  const userOrdersList = userOrders.filter(
    (order) => order.userId === selectedUser
  );
  if (!user) return null;

  return (
    <Dialog
      open={!!selectedUser}
      onOpenChange={(open) => !open && setSelectedUser(null)}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected user
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">User Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Image
                  src={
                    user.imageUrl ||
                    `/placeholder.svg?height=64&width=64` ||
                    "/placeholder.svg"
                  }
                  width={64}
                  height={64}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-16 w-16 rounded-full"
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

              <div className="grid grid-cols-2 gap-2 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p>
                    {formatDistanceToNow(new Date(user.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Active</p>
                  <p>
                    {user.lastSignInAt
                      ? formatDistanceToNow(new Date(user.lastSignInAt), {
                          addSuffix: true,
                        })
                      : "Never"}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-xl font-medium flex items-center">
                  {firestoreUser?.balance || 0}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-medium mt-6 mb-2">
              Recent Balance History
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {firestoreUser?.balanceHistory
                ?.slice(0, 5)
                .map((entry, index) => (
                  <div key={index} className="border rounded p-2">
                    <div className="flex justify-between">
                      <span
                        className={
                          entry.type === "credit"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {entry.type === "credit" ? "+" : "-"}
                        {entry.amount}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatTimestamp(entry.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm">{entry.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.category}
                    </p>
                  </div>
                ))}
              {(!firestoreUser?.balanceHistory ||
                firestoreUser.balanceHistory.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No balance history available
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Orders</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {userOrdersList.map((order) => (
                <div key={order.id} className="border rounded p-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{order.service}</span>
                    <Badge
                      variant="outline"
                      className={
                        order.status === "success" ||
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled" ||
                            order.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-muted-foreground">
                      {formatTimestamp(order.createdAt)}
                    </span>
                    <span className="font-medium">${order.price}</span>
                  </div>

                  {order.status !== "success" &&
                    order.status !== "completed" &&
                    order.status !== "cancelled" &&
                    order.status !== "rejected" && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => handleApproveOrder(order.id, user.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-red-600"
                          onClick={() => handleRejectOrder(order.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                </div>
              ))}
              {userOrdersList.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No orders available
                </p>
              )}
              {user.id}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setSelectedUser(null)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
