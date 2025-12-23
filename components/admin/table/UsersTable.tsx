"use client";

import { useState, useEffect } from "react";
import { useFirestoreCRUD } from "@/context/DatabaseHook";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { UserTable } from "./components/user-table";

import type {
  ClerkUser,
  FirestoreUser,
  UserOrder,
  UserSearchParams,
  PaginationInfo,
} from "@/types";
import { Pagination } from "./components/Pagination";
import { UserDetailDialog } from "./components/user-detail-dialog";
import { UserSearch } from "./components/user-search";
import { UserFilters } from "./components/user-filters";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const { user: currentUser } = useUser();
  const {
    listenToCollection,
    collectionData,
    updateDocument,
    updateBalance,
    listenToCollectionWithQuery2,
  } = useFirestoreCRUD();

  const [users, setUsers] = useState<ClerkUser[]>([]);
  const [firestoreUsers, setFirestoreUsers] = useState<
    Map<string, FirestoreUser>
  >(new Map());
  const [userOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    total: 0,
    limit: 10,
    offset: 0,
  });
  const [searchParams, setSearchParams] = useState<UserSearchParams>({
    query: "",
    limit: 10,
    offset: 0,
  });

  // Check if we're on a mobile device

  // Add this useEffect to update the isMobile state only when the query result changes

  // Fetch Clerk users with search and pagination
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { query, limit, offset } = searchParams;
        const queryString = new URLSearchParams({
          query,
          limit: limit.toString(),
          offset: offset.toString(),
        }).toString();

        const response = await fetch(`/admin/api/users?${queryString}`);
        const { users, pagination } = await response.json();
        setUsers(users.data);
        setPaginationInfo(pagination);
        setTotalUsers(pagination.total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast("Error fetching users", {
          description: "Failed to fetch users. Please try again.",
          className: "bg-red-500 text-white",
        });
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchParams, listenToCollection, listenToCollectionWithQuery2]);

  // Listen to Firestore collections
  useEffect(() => {
    // Listen to users collection
    const unsubscribeUsers = listenToCollection("classic-media-users");
    const unsubscribeOrders = listenToCollectionWithQuery2(
      "classic-admin-payment"
    );
    return () => {
      unsubscribeUsers();
      unsubscribeOrders();
    };
  }, [listenToCollection, listenToCollectionWithQuery2]);

  useEffect(() => {
    if (collectionData.length > 0) {
      // Process users data
      const userMap = new Map<string, FirestoreUser>();

      collectionData.forEach((item) => {
        if (item && item.balance !== undefined) {
          // This is a user document
          userMap.set(item.id, {
            id: item.id,
            balance: item.balance || 0,
            balanceHistory: item.balanceHistory || [],
            pendingOrders: 0,
            totalOrders: 0,
          });
        }
      });

      setFirestoreUsers(userMap);
    }
  }, [collectionData]); // Only depend on collectionData

  // Process order data separately with a stable reference to firestoreUsers
  /* useEffect(() => {
    if (collectionDataWithQ.length > 0) {
      const orders: UserOrder[] = [];
      let needsUpdate = false;

    
      // Process orders
      collectionDataWithQ.forEach((item) => {
        if (item && item.status !== undefined && item.userId) {
          // This is an order document
          orders.push(item as UserOrder);

          const user = firestoreUsers.get(item.userId);
          if (user) {
            needsUpdate = true;
            user.totalOrders = (user.totalOrders || 0) + 1;
            if (
              item.status !== "success" &&
              item.status !== "processing" &&
              item.status !== "cancelled"
            ) {
              user.pendingOrders = (user.pendingOrders || 0) + 1;
            }
          }
        }
      });

      // Only update state if something changed
      if (needsUpdate) {
        setFirestoreUsers(new Map(firestoreUsers));
      }

      setUserOrders(orders);
    }
  }, [collectionDataWithQ]); // Only depend on collectionDataWithQ */

  // Handle search and pagination
  const handleSearch = (newParams: UserSearchParams) => {
    setSearchParams(newParams);
  };

  // Handle order approval
  const handleApproveOrder = async (orderId: string) => {
    try {
      await updateDocument("classic-admin-payment", orderId, {
        status: "success",
        approvedAt: new Date(),
        approvedBy: currentUser?.id,
      });

      toast("Order Approved", {
        description: "The order has been successfully approved.",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Error approving order:", error);
      toast("Error approving order", {
        description: "Failed to approve order. Please try again.",
        className: "bg-red-500 text-white",
      });
    }
  };

  // Handle order rejection
  const handleRejectOrder = async (orderId: string) => {
    try {
      await updateDocument("classic-admin-payment", orderId, {
        status: "rejected",
        rejectedAt: new Date(),
        rejectedBy: currentUser?.id,
      });

      toast("Order Rejected", {
        description: "The order has been rejected.",
        className: "bg-red-500 text-white",
      });
    } catch (error) {
      console.error("Error rejecting order:", error);
      toast("Error rejecting order", {
        description: "Failed to reject order. Please try again.",
        className: "bg-red-500 text-white",
      });
    }
  };

  // Handle balance adjustment
  const handleAdjustBalance = async (
    userId: string,
    amount: number,
    type: "credit" | "debit",
    description: string
  ) => {
    try {
      await updateBalance({
        userId,
        amount,
        type,
        description,
        category: "admin_adjustment",
        collectBalanceName: "classic-media-users",
      });

      toast("Balance Updated", {
        description: `User balance has been ${
          type === "credit" ? "increased" : "decreased"
        } by ${amount}.`,
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Error adjusting balance:", error);
      toast("Error adjusting balance", {
        description: "Failed to adjust balance. Please try again.",
        className: "bg-red-500 text-white",
      });
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: {
    seconds: number;
    nanoseconds: number;
  }) => {
    if (!timestamp) return "N/A";
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>
                User Management{" "}
                <span className="text-muted-foreground">{totalUsers}</span>
              </CardTitle>
              <CardDescription>
                Manage users, view balances, and approve orders
              </CardDescription>
            </div>
            <UserFilters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </div>
          <UserSearch onSearch={handleSearch} searchParams={searchParams} />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <UserTable
                users={users}
                firestoreUsers={firestoreUsers}
                userOrders={userOrders}
                statusFilter={statusFilter}
                setSelectedUser={setSelectedUser}
                handleApproveOrder={handleApproveOrder}
                handleRejectOrder={handleRejectOrder}
                handleAdjustBalance={handleAdjustBalance}
                formatTimestamp={formatTimestamp}
              />

              <Pagination
                paginationInfo={paginationInfo}
                searchParams={searchParams}
                onPageChange={handleSearch}
              />
            </>
          )}
        </CardContent>
      </Card>

      <UserDetailDialog
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        users={users}
        firestoreUsers={firestoreUsers}
        userOrders={userOrders.filter((order) => order.userId === selectedUser)}
        handleApproveOrder={handleApproveOrder}
        handleRejectOrder={handleRejectOrder}
        formatTimestamp={formatTimestamp}
      />
    </div>
  );
}
