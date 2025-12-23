import { NextResponse } from "next/server";

const KORAPAY_API_URL =
  "https://api.korapay.com/merchant/api/v1/misc/currencies";
const KORAPAY_PUBLIC_KEY = process.env.KORAPAY_PUBLIC_KEY;

export async function GET() {
  try {
    const response = await fetch(KORAPAY_API_URL, {
      headers: {
        Authorization: `Bearer ${KORAPAY_PUBLIC_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch currencies from KoraPay");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching KoraPay currencies:", error);
    return NextResponse.json(
      { error: "Failed to fetch currencies" },
      { status: 500 }
    );
  }
}
