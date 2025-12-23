import Footer from "@/components/users/Footer";
import HeadersUser from "@/components/users/HeadersUser";
import SidebarUser from "@/components/users/SidebarUser";

import { CategoryProvider } from "@/context/CategoryProvider";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React, { JSX } from "react";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  // Only attempt Firebase operations in development
 
  return (
    <div className="flex min-h-screen flex-col">
      <HeadersUser />
      <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <SidebarUser className="hidden md:block" />
        <main className="flex w-full flex-col overflow-hidden">
          {" "}
          <CategoryProvider>
            {" "}
           
            {children}
            <Footer />
          </CategoryProvider>
        </main>
      </div>
    </div>
  );
}
