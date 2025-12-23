import { NextResponse } from "next/server";

const KORAPAY_SECRET_KEY = process.env.KORAPAY_SECRET_KEY;
const KORAPAY_API_URL =
  "https://api.korapay.com/merchant/api/v1/charges/initialize";

export async function POST(request: Request) {
  const { amount, userId, email } = await request.json();

  if (!amount || !userId || !email) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Generate a shorter reference - FIXED THE UNCLOSED STRING HERE
    const shortReference = `KP_${userId.slice(0, 8)}_${Date.now()
      .toString()
      .slice(-8)}`;

    // For local development, we'll use a placeholder URL
    // In production, you should use your actual domain
    const notificationUrl =
      "https://chebesocial.com/users/api/korapay-webhook";

    const payload = {
      amount: amount,
      currency: "NGN",
      reference: shortReference,
      notification_url: notificationUrl,
      customer: {
        email: email,
        name: userId,
      },
      narration: "Add funds to wallet",
    };

    // FIXED THE MISSING BACKTICKS HERE
    const response = await fetch(KORAPAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KORAPAY_SECRET_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("KoraPay API error:", responseData);
      throw new Error(
        `Failed to create KoraPay payment: ${response.status} ${response.statusText}`
      );
    }

    return NextResponse.json({
      paymentUrl: responseData.data.checkout_url,
      reference: responseData.data.reference,
      amountNGN: amount,
      amountUSD: amount,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error creating KoraPay payment:", error.message);
      return NextResponse.json(
        { message: "Error creating KoraPay payment", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
