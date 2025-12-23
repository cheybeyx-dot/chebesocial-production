"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  User,
  HelpCircle,
  History,
} from "lucide-react";
import TwoFactorSetup from "./TwoFactorSetup";
import { useAuth } from "@clerk/nextjs";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/users/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transaction History",
    href: "/users/transaction",
    icon: History,
  },
  {
    title: "All Transactions",
    href: "/users/all-transaction",
    icon: History,
  },
  {
    title: "Profile",
    href: "/users/profile",
    icon: User,
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
  },
];


const SidebarUser = ({ className }: { className?: string }) => {
     const pathname = usePathname();
     const { userId, isLoaded, isSignedIn } = useAuth();
     if (!isLoaded) {
       return <div>Loading...</div>;
     }

     if (!isSignedIn) {
       return <div>Sign in to view this page</div>;
     }
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Menu
          </h2>
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              Home
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1">
            <ScrollArea className="h-auto px-1">
              {sidebarNavItems.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              ))}
              <TwoFactorSetup userId={userId} />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarUser;
