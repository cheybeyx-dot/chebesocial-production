import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json(
      { error: "Reference is required" },
      { status: 400 }
    );
  }

  try {
    const fundingDoc = await adminDb
      .collection("classic-admin-funding")
      .where("reference", "==", reference)
      .get();

    if (!fundingDoc.docs.length) {
      return NextResponse.json(
        { error: "Funding document not found" },
        { status: 404 }
      );
    }

    const status = fundingDoc.docs[0].data().status;
    return NextResponse.json({ status: status });
  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json(
      { error: "Failed to check payment status" },
      { status: 500 }
    );
  }
}
