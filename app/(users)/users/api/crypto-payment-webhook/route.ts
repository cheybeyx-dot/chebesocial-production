import * as crypto from "crypto";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

// This is a placeholder for your actual secret key
const NOWPAYMENTS_IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;

export async function POST(request: Request) {
  // Verify the webhook signature
  const signature = request.headers.get("x-nowpayments-sig");
  if (!signature || !verifySignature(await request.text(), signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = await request.json();

  // Check if the payment is completed and it's a USDT TRC20 payment
  if (
    payload.payment_status === "finished" &&
    payload.pay_currency === "usdttrc20"
  ) {
    try {
      // Fetch the funding document
      const fundingDoc = await getFundingDocument(payload.order_id);
      if (!fundingDoc) {
        throw new Error("Funding document not found");
      }

      // Update the funding document status
      const resPost = adminDb
        .collection("classic-admin-funding")
        .doc(fundingDoc.userId);

      await resPost.set(
        {
          status: "completed",
        },
        { merge: true }
      );

      // Update user's balance

      const udateBalanceCrypto = adminDb
        .collection("classic-media-users")
        .doc(fundingDoc.userId);
      await udateBalanceCrypto.update({
        amount: Number.parseFloat(payload.actually_paid),
        type: "credit",
        description: `Crypto payment - ID: ${payload.payment_id}`,
        category: "crypto_deposit",
      });

      // Handle referral bonus
      if (Number.parseFloat(payload.actually_paid) >= 10) {
        const userDoc = await getUserDocument(fundingDoc.userId);
        if (userDoc && userDoc.referredById) {
          await adminDb
            .collection("classic-media-users")
            .doc(userDoc.referredById)
            .update({
              totalReferralBonus:
                Number.parseFloat(payload.actually_paid) * 0.1,
            });
        }
      }

      return NextResponse.json({ status: "success" });
    } catch (error) {
      console.error("Error processing payment:", error);
      return NextResponse.json(
        { error: "Payment processing failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ status: "ignored" });
}

// Implement this function to verify the webhook signature
function verifySignature(payload: string, signature: string): boolean {
  if (!NOWPAYMENTS_IPN_SECRET) {
    console.error("NOWPAYMENTS_IPN_SECRET is not configured");
    return false;
  }

  try {
    // Create HMAC using SHA-512 and the IPN secret
    const hmac = crypto.createHmac("sha512", NOWPAYMENTS_IPN_SECRET);

    // Update HMAC with the raw payload
    hmac.update(payload);

    // Get the calculated signature in hex format
    const calculatedSignature = hmac.digest("hex");

    // Compare the calculated signature with the provided signature
    // Use a timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(calculatedSignature, "hex"),
      Buffer.from(signature, "hex")
    );
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}

// Implement this function to fetch the funding document from your database
async function getFundingDocument(orderId: string) {
  console.log(orderId);
  return { id: "some-id", userId: "user-id" };
}

// Implement this function to fetch the user document from your database
async function getUserDocument(userId: string) {
  console.log(userId);
  // Fetch and return the user document
  // This is a placeholder implementation
  return { referredById: "referrer-id" };
}
