import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Check if the user is an admin
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get search params from the URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const offset = Number.parseInt(searchParams.get("offset") || "0");

    // Fetch users from Clerk with pagination
    const users = await (
      await clerkClient()
    ).users.getUserList({
      limit,
      offset,
      query: query ? query : undefined,
      orderBy: "-created_at",
    });
   
    // Get total count for pagination
    const totalCount = await (await clerkClient()).users.getCount();

    // Return the users and pagination info
    return NextResponse.json({
      users,
      pagination: {
        total: totalCount,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
