"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  History,
  Home,
  LayoutDashboard,
  Loader2,
  Menu,
  Pen,
  PersonStanding,
  Plus,
  Settings,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { ThemeToggle } from "../theme-toggle";

export function Header() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return null on server-side and first client-side render
  }
  const routes = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/admin/dashboard",
      label: "Dashboard",
    },
    {
      href: "/users/dashboard",
      label: "Users",
    },
    {
      href: "/admin/profile",
      label: "Profile",
    },
  ];
  const mobileRoutes = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/cancelled-transactions",
      label: "Cancelled Transactions",
      icon: History,
    },
    {
      href: "/admin/pending-transactions",
      label: "Pending Transactions",
      icon: PersonStanding,
    },
    {
      href: "/admin/edit-services",
      label: "Edit Services",
      icon: Pen,
    },
    {
      href: "/admin/api-service-select",
      label: "Api Service Select",
      icon: User,
    },
    {
      href: "/admin/services",
      label: "Add Services",
      icon: Plus,
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image
              src="/assets/chebelogo.png"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-auto rounded-full"
            />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === route.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <MobileLink
              href="/"
              className="flex items-center"
              onOpenChange={setOpen}
            >
              <Image
                src="/assets/chebelogo.png"
                alt="Logo"
                width={32}
                height={32}
                className="h-8 w-auto rounded-full"
              />
              {/* <span className="font-bold">Your Company</span> */}
            </MobileLink>
            <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {mobileRoutes.map((route) => (
                  <MobileLink
                    key={route.href}
                    href={route.href}
                    onOpenChange={setOpen}
                    className="flex items-center gap-3"
                  >
                    <route.icon className="h-5 w-5" />
                    <span>{route.label}</span>
                  </MobileLink>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add your search component here if needed */}
          </div>
          <nav className="flex items-center">
            <div className="mr-2 mt-2">
              <ClerkLoading>
                <Loader2 className="h-5 w-5 animate-spin" />
              </ClerkLoading>
            </div>
            <div className="mr-2">
              <SignedOut>
                <SignInButton />
              </SignedOut>
            </div>
            <div className="mr-2 mt-2">
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}

interface MobileLinkProps extends React.PropsWithChildren {
  href: string;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
}: MobileLinkProps) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false);
      }}
      className={cn(
        "flex w-full items-center py-2 text-foreground/70 transition-colors hover:text-foreground",
        pathname === href && "font-medium text-foreground",
        className
      )}
    >
      {children}
    </Link>
  );
}
