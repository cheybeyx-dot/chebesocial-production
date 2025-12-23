import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PriceMultiplierSettings from "@/components/admin/forms/PriceMultiplierSettings";

export default function AdminSettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 px-6">Admin Settings</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Suspense fallback={<SettingsCardSkeleton />}>
          <PriceMultiplierSettings />
        </Suspense>

        {/* Add other settings cards here */}
      </div>
    </div>
  );
}

function SettingsCardSkeleton() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="h-7 w-3/4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </CardContent>
      <div className="p-6 pt-0">
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
      </div>
    </Card>
  );
}
