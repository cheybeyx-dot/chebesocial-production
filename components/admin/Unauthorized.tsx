import type React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const UnauthorizedAccess = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full text-center">
        <AlertTriangle className="mx-auto text-yellow-500 w-16 h-16 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 mb-6">
          Sorry, you do not have permission to access this admin page. Please
          log in with an authorized account or return to the home page.
        </p>
        <div className="space-y-2">
          <Button asChild className="w-full">
            <Link href="/users/dashboard">Return to dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
