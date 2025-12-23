import { Header } from "@/components/admin/AdminHeader";
import { Sidebar } from "@/components/admin/AdminSidebar";
import UnauthorizedAccess from "@/components/admin/Unauthorized";
import { CategoryProvider } from "@/context/admin/AdminCatProvider";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await (await clerkClient()).users.getUser(userId);
  const isAdmin = user.publicMetadata.role === "admin";

  if (!isAdmin) {
    return (
      <>
        <UnauthorizedAccess />
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <Sidebar className="hidden md:block" />
        <main className="flex w-full flex-col overflow-hidden">
          {" "}
          <CategoryProvider>{children}</CategoryProvider>
        </main>
      </div>
    </div>
  );
}
