import { Card } from "@/components/ui/card";
import { getAllResolveRequests } from "@/lib/firebase/resolve";

export default async function AdminResolvePage() {
  const requests = await getAllResolveRequests();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Account Support Requests</h1>

      {requests.length === 0 && (
        <p className="text-muted-foreground">No requests yet.</p>
      )}

      {requests.map((req) => (
        <Card key={req.id} className="p-4 space-y-2">
          <div className="text-sm text-muted-foreground">User: {req.user}</div>

          <div>
            <strong>Platform:</strong> {req.platform}
          </div>

          <div>
            <strong>Issue:</strong>
            <p className="mt-1 text-sm">{req.issue}</p>
          </div>

          <div className="text-xs text-muted-foreground">
            Status: {req.status}
          </div>
        </Card>
      ))}
    </div>
  );
}
