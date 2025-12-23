"use client"
import { usePathname } from "next/navigation"
import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Loader2, LayoutDashboard, Home, User, HelpCircle, History } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

import { ClerkLoading, SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/nextjs"
import { ThemeToggle } from "../theme-toggle"
import TwoFactorSetup from "./TwoFactorSetup"
const HeadersUser = () => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { userId, isSignedIn } = useAuth()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return null // Return null on server-side and first client-side render
  }

  const routes = [
    { href: "/", label: "Home" },
    { href: "/users/dashboard", label: "Dashboard" },
    { href: "/users/profile", label: "Profile" },
    { href: "/users/contact", label: "Contact" },
  ]
  const mobileRoutes = [
    { href: "/", label: "Home", icon: Home },
    { href: "/users/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/users/transaction", label: "Transactions", icon: History },
    { href: "/users/all-transaction", label: "All Transactions", icon: History },
    { href: "/users/profile", label: "Profile", icon: User },
    { href: "/users/contact", label: "Contact", icon: HelpCircle },
  ]
  return (
    <header className="sticky top-0 z-50 w-full px-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/assets/chebelogo.png" alt="Logo" width={32} height={32} className="h-8 w-auto rounded-full" />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === route.href ? "text-foreground" : "text-foreground/60",
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
            <MobileLink href="/" className="flex items-center" onOpenChange={setOpen}>
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
                {isSignedIn && <TwoFactorSetup userId={userId} />}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">{/* Add your search component here if needed */}</div>
          <nav className="flex items-center">
            <ClerkLoading>
              <Loader2 className="h-5 w-5 animate-spin" />
            </ClerkLoading>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

interface MobileLinkProps extends React.PropsWithChildren {
  href: string
  onOpenChange?: (open: boolean) => void
  className?: string
}

function MobileLink({ href, onOpenChange, className, children }: MobileLinkProps) {
  const pathname = usePathname()
  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false)
      }}
      className={cn(
        "flex w-full items-center py-2 text-foreground/70 transition-colors hover:text-foreground",
        pathname === href && "font-medium text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  )
}

export default HeadersUser

