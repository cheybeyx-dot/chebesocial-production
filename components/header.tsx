"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Loader2, Menu } from "lucide-react";

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
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const routes = [
    { href: "/", label: "Home" },
    { href: "/users/dashboard", label: "Dashboard" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    {
      label: "Services",
      children: [
        { href: "/services/organic-smm-panel", label: "Organic SMM Panel" },
        {
          href: "/services/monetized-youtube-accounts",
          label: "Monetized YouTube Accounts",
        },
        {
          href: "/services/ads-account-recovery",
          label: "Ads Account Recovery",
        },
        { href: "/services/music-promotion", label: "Music Promotion" },
        { href: "/services/watch-hours", label: "Watch Hours" },
        {
          href: "/services/adult-platform-engagement",
          label: "Adult Platform Engagement",
        },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center">
        {/* Desktop Logo & Nav */}
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
            {routes.map((route) =>
              route.children ? (
                <div key={route.label} className="relative group">
                  <span className="cursor-pointer transition-colors hover:text-foreground/80">
                    {route.label}
                  </span>
                  <ul className="absolute hidden group-hover:block top-full left-0 bg-background border rounded-md mt-1 space-y-1 p-2 shadow-md">
                    {route.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block px-3 py-1 text-sm hover:bg-foreground/5 rounded"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
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
              )
            )}
          </nav>
        </div>

        {/* Mobile Menu */}
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
            </MobileLink>
            <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {routes.map((route) =>
                  route.children ? (
                    <div key={route.label} className="space-y-1">
                      <span className="font-semibold">{route.label}</span>
                      {route.children.map((child) => (
                        <MobileLink
                          key={child.href}
                          href={child.href}
                          onOpenChange={setOpen}
                          className="ml-4"
                        >
                          {child.label}
                        </MobileLink>
                      ))}
                    </div>
                  ) : (
                    <MobileLink
                      key={route.href}
                      href={route.href}
                      onOpenChange={setOpen}
                    >
                      {route.label}
                    </MobileLink>
                  )
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          <nav className="flex items-center">
            <div className="mr-2">
              <SignedOut>
                <SignInButton />
              </SignedOut>
            </div>
            <div className="mr-2 mt-2">
              <ClerkLoading>
                <Loader2 className="h-5 w-5 animate-spin" />
              </ClerkLoading>
            </div>
            <div className="mr-2 mt-2">
              <SignInButton>
                <UserButton />
              </SignInButton>
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
      onClick={() => onOpenChange?.(false)}
      className={cn(
        "text-foreground/70 transition-colors hover:text-foreground",
        pathname === href && "text-foreground",
        className
      )}
    >
      {children}
    </Link>
  );
}
