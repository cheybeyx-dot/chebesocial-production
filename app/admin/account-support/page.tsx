"use client";

import { Card } from "@/components/ui/card";
import { accountSupportRequests } from "@/lib/accountSupportData";

export default function AdminAccountSupportPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Account Support Requests</h2>

      {accountSupportRequests.length === 0 && (
        <p className="text-sm text-muted-foreground">No requests yet.</p>
      )}

      {accountSupportRequests.map((req) => (
        <Card key={req.id} className="p-4">
          <p className="font-semibold">{req.service}</p>
          <p className="text-sm">{req.issue}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Status: {req.status}
          </p>
        </Card>
      ))}
    </div>
  );
}
