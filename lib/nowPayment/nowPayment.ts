import NowPaymentsApi from "@nowpaymentsio/nowpayments-api-js";

const apiKey = process.env.NOWPAYMENTS_API_KEY;

if (!apiKey) {
  throw new Error("NOWPayments API key is not set");
}

export const nowPaymentsClient = new NowPaymentsApi({ apiKey });
