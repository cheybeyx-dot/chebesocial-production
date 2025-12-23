"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFirestoreCRUD } from "@/context/DatabaseHook";

type OrderType = "api" | "buyOrganicService" | "resolve" | "buyAccount";

interface Order {
  id: string;
  type: OrderType;
  service?: string;
  quantity?: number;
  price?: number;
  status: "pending" | "approved" | "rejected" | "success";
  createdBy: string;
}

export default function AdminOrdersPage() {
  const { getCollection, updateDocument } = useFirestoreCRUD();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderType | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getCollection("classic-admin-payment");
      setOrders((data as Order[]) || []);
      setLoading(false);
    };

    fetchOrders();
  }, [getCollection]);

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.type === filter);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    await updateDocument("classic-admin-payment", id, {
      status,
      approved: status === "approved",
    });

    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  if (loading) {
    return <p className="p-6">Loading orders...</p>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">📦 Orders</h1>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "api", "buyOrganicService", "resolve", "buyAccount"].map(
          (t) => (
            <Button
              key={t}
              variant={filter === t ? "default" : "outline"}
              onClick={() => setFilter(t as any)}
            >
              {t === "all" ? "All" : t}
            </Button>
          )
        )}
      </div>

      {filteredOrders.length === 0 && (
        <p className="text-muted-foreground">No orders found.</p>
      )}

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="font-medium">
                  {order.service || "Account / Resolve"}
                </p>
                <p className="text-sm text-muted-foreground">
                  User: {order.createdBy}
                </p>
                <p className="text-sm">
                  Qty: {order.quantity || "-"} | ₦
                  {order.price?.toLocaleString() || "-"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Type: {order.type}
                </p>
              </div>

              <Badge>{order.status}</Badge>
            </div>

            {order.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => updateStatus(order.id, "approved")}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => updateStatus(order.id, "rejected")}
                >
                  Reject
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
