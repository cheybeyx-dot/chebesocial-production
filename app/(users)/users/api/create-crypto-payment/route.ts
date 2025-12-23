import { nowPaymentsClient } from "@/lib/nowPayment/nowPayment";
import { NextResponse } from "next/server";

type PaymentResponse = {
  payment_id: string;
  pay_address: string;
  pay_amount: number;
  pay_currency: string;
  message?: string;
  network_fee: number;
};


export async function POST(request: Request) {
  const { amount, userId } = await request.json();

  if (!amount || !userId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const roundedAmount = Math.round(amount * 1000) / 1000;
    const payment = (await nowPaymentsClient.createPayment({
      price_amount: roundedAmount,
      price_currency: "usd", // Price is still in USD
      pay_currency: "usdtsol", // Changed to USDT TRC20
      order_id: `CRYPTO_${userId}_${Date.now()}`,
      order_description: "Add funds to wallet",
      fixed_rate: "true", // Ensures the exchange rate remains stable
    })) as PaymentResponse;
    // Check if payment is an error
    if ("message" in payment) {
      throw new Error(payment.message);
    }

    return NextResponse.json({
      paymentUrl: `https://nowpayments.io/payment/?iid=${payment.payment_id}`,
      paymentId: payment.payment_id,
      payAddress: payment.pay_address,
      payAmount: payment.pay_amount,
      payCurrency: payment.pay_currency,
      networkFee: payment.network_fee || 0, // Use 0 if network_fee is not provided
    });
  } catch (error) {
    console.error("Error creating USDT Solana payment:", error);
    return NextResponse.json(
      { message: "Error creating USDT Solana payment" },
      { status: 500 }
    );
  }
}
