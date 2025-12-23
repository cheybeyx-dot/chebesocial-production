import React from "react";
import { Button } from "@/components/ui/button";
import {
  ShoppingCartIcon,
  DollarSignIcon,
  PackageIcon,
  TicketIcon,
} from "lucide-react";

export default function HeaderForm({ user }: { user: string }) {
  return (
    <div className="bg-green-900 text-white p-4 rounded-md flex justify-between items-center mt-6 mb-6">
      <div className="text-lg font-bold">
        Welcome, <span className="font-normal">Back! {user}</span>
      </div>

      <div className="hidden lg:flex gap-8">
        <Button variant="ghost" className="text-white">
          <ShoppingCartIcon className="w-6 h-6 mr-2" />
          New Order
        </Button>
        <Button variant="ghost" className="text-white">
          <DollarSignIcon className="w-6 h-6 mr-2" />
          Add Funds
        </Button>
        <Button variant="ghost" className="text-white">
          <PackageIcon className="w-6 h-6 mr-2" />
          Orders
        </Button>
        <Button variant="ghost" className="text-white">
          <TicketIcon className="w-6 h-6 mr-2" />
          Tickets
        </Button>
      </div>
    </div>
  );
}
