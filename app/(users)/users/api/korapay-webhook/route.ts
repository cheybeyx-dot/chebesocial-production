import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
/* import { convertNGNToUSD } from "@/lib/nowPayment/exchangeRate"; */
import { FieldValue } from "firebase-admin/firestore";
interface BalanceHistoryEntry {
  previousBalance: number;
  newBalance: number;
  amount: number;
  type: "credit" | "debit";
  description?: string;
  category?: string;
  createdBy: string;
  createdAt: Date;
}
const KORAPAY_SECRET_KEY = process.env.KORAPAY_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    // Get the raw body as text and log it for debugging
    const rawBody = await request.text();

    // For empty payloads
    if (!rawBody || rawBody.trim() === "") {
      console.error("Empty webhook body received");
      return NextResponse.json(
        { error: "Empty request body" },
        { status: 400 }
      );
    }

    // Parse the JSON body
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("Failed to parse webhook body:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    // Check for required fields
    if (!payload || !payload.event || !payload.data) {
      return NextResponse.json(
        { error: "Invalid payload structure" },
        { status: 400 }
      );
    }

    // Get the signature from headers
    const signature = request.headers.get("x-korapay-signature");

    // Verify signature if present
    if (signature) {
      try {
        const isValid = verifySignature(
          JSON.stringify(payload.data),
          signature
        );
        if (!isValid) {
          console.error("Invalid signature");
          return NextResponse.json(
            { error: "Invalid signature" },
            { status: 401 }
          );
        }
        console.log("Signature verified successfully");
      } catch (signError) {
        console.error("Error during signature verification:", signError);
        // Continuing despite verification error for debugging purposes
        // In production, you might want to return an error here
        if (signError instanceof Error)
          return NextResponse.json(
            {
              error: "Funding document not found",
              reference: signError,
            },
            { status: 404 }
          );
      }
    } else {
      console.warn("No signature provided in webhook headers");
    }
    // Process different webhook events
    if (payload.event === "charge.success") {
      // Extract payment data
      const reference = payload.data.reference;
      const amount = payload.data.amount;

      try {
        // Find the funding document by reference
        const fundingDoc = await getFundingDocument(reference);
        if (!fundingDoc) {
          console.error("No funding document found for reference:", reference);
          return NextResponse.json(
            {
              error: "Funding document not found",
              reference: reference,
            },
            { status: 404 }
          );
        }
        // Convert amount if needed
        /* const usdAmount = convertNGNToUSD(amount); */
        // Update funding status
        await updateStatus(fundingDoc.id);
        // Update user balance
        await updateUserBalance(fundingDoc.userId, amount);

        // Process referral if applicable
        /* if (usdAmount >= 10) {
          await processReferralBonus(fundingDoc.userId, usdAmount);
        } */

        return NextResponse.json({
          status: "success",
          message: "Payment processed successfully",
        });
      } catch (processingError) {
        if (processingError instanceof Error)
          console.log(processingError.message);
        return NextResponse.json(
          {
            error: "Payment processing failed",
            details:
              processingError instanceof Error
                ? processingError.message
                : "Unknown error",
          },
          { status: 500 }
        );
      }
    } else {
      console.log("Ignoring non-success event:", payload.event);
      return NextResponse.json({ status: "ignored" });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Webhook processing error",
          details: error.message,
        },
        { status: 500 }
      );
    }
  }
}

// Helper functions
function verifySignature(payload: string, signature: string): boolean {
  if (!KORAPAY_SECRET_KEY) {
    console.error("KORAPAY_SECRET_KEY is not configured");
    return false;
  }

  // Check KoraPay docs if this should be sha256, sha512, or another algorithm
  const hmac = crypto.createHmac("sha256", KORAPAY_SECRET_KEY);
  const calculatedSignature = hmac.update(payload).digest("hex");

  return calculatedSignature === signature;
}

async function getFundingDocument(reference: string) {
  try {
    // Query your database for the funding document

    const snapshot = await adminDb
      .collection("classic-admin-funding")
      .where("reference", "==", reference)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      userId: doc.data().userId,
      amount: doc.data().amount,
      status: doc.data().status,
      // Include other relevant fields
    };
  } catch (error) {
    console.error("Error fetching funding document:", error);
  }
}
async function updateStatus(docId: string) {
  try {
    const docRef = adminDb.collection("classic-admin-funding").doc(docId);
    await docRef.update({
      status: "completed",
    });
  } catch (error) {
    console.error("Error updating status:", error);
  }
}
async function updateUserBalance(userId: string, amount: number) {
  try {
    const userRef = adminDb.collection("classic-media-users").doc(userId);
    const userDoc = await userRef.get();
    let currentBalance = 0;
    let existingBalanceHistory: BalanceHistoryEntry[] = [];

    if (!userDoc.exists) {
      // Create a new user document if it doesn't exist
      await userRef.set({
        balance: 0,
        balanceHistory: [],
        createdAt: FieldValue.serverTimestamp(),
        createdBy: userId,
      });
    } else {
      currentBalance = userDoc.data()?.balance ?? 0;
      existingBalanceHistory = userDoc.data()?.balanceHistory ?? [];

      // Process existing history entries to ensure timestamps are JavaScript Date objects
      existingBalanceHistory = existingBalanceHistory.map((entry) => {
        // Create a new object without the timestamp field
        const { createdAt, ...restOfEntry } = entry;

        // Handle Firestore timestamp conversion
        let dateValue: Date;
        if (createdAt instanceof Date) {
          dateValue = createdAt;
        } else if (
          typeof createdAt === "object" &&
          createdAt !== null &&
          "toDate" in createdAt
        ) {
          // This handles Firestore Timestamp objects
          dateValue = (createdAt as { toDate(): Date }).toDate();
        } else if (createdAt) {
          // Handle string or number timestamp
          dateValue = new Date(createdAt);
        } else {
          // Fallback
          dateValue = new Date();
        }

        // Return a new entry with the converted timestamp
        return {
          ...restOfEntry,
          createdAt: dateValue,
        };
      });
    }

    // Rest of your function remains the same
    const newBalance = Number(currentBalance) + Number(amount);

    const historyEntry = {
      previousBalance: Number(currentBalance),
      newBalance,
      amount: Number(amount),
      type: "credit" as const,
      description: "Kora Payment",
      category: "Kora Payment",
      createdAt: new Date(),
      createdBy: userId,
    };

    const updatedHistory = [historyEntry, ...existingBalanceHistory];

    await userRef.set(
      {
        balance: newBalance,
        lastUpdated: FieldValue.serverTimestamp(),
        lastUpdatedBy: userId,
        balanceHistory: updatedHistory,
      },
      { merge: true }
    );
    return { newBalance, historyEntry };
  } catch (error) {
    console.error("Error updating balance:", error);
    throw error;
  }
}
/* async function processReferralBonus(userId: string, usdAmount: number) {
  try {
    // Get user document to check for referrer
    const userDoc = await adminDb
      .collection("classic-media-users")
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      console.log("User document not found for referral processing");
      return false;
    }

    const userData = userDoc.data();
    if (!userData?.referredById) {
      console.log("No referrer found for user:", userId);
      return false;
    }

    // Calculate bonus (10% of deposit)
    const bonusAmount = usdAmount * 0.1;

    // Add bonus to referrer
    await adminDb
      .collection("classic-media-users")
      .doc(userData?.referredById)
      .update({
        totalReferralBonus: FieldValue.increment(bonusAmount),
        balance: FieldValue.increment(bonusAmount),
      });

    // Record the referral transaction
    await adminDb.collection("transactions").add({
      
    }
      userId: userData.referredById,
      amount: bonusAmount,
      type: "credit",
      description: `Referral bonus from ${userId}`,
      category: "referral_bonus",
      createdAt: new Date(),
    });

    console.log("Processed referral bonus for user:", userData.referredById);
    return true;
  } catch (error) {
    console.error("Error processing referral bonus:", error);
    throw error;
  }
}
 */
