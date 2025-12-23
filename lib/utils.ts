import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Cache for exchange rates to avoid too many API calls
let exchangeRateCache: { rate: number; timestamp: number } | null = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function formatCurrency(amount: number, currency: string = "USD") {
  try {
    let finalAmount = amount;

    // If the amount is in NGN and we want USD, convert it
    if (currency === "USD" && amount > 0) {
      if (
        !exchangeRateCache ||
        Date.now() - exchangeRateCache.timestamp > CACHE_DURATION
      ) {
        const rate = await getExchangeRate("NGN", "USD");
        exchangeRateCache = { rate, timestamp: Date.now() };
      }
      finalAmount = amount * exchangeRateCache.rate;
    }

    const currencyLocales: Record<string, string> = {
      USD: "en-US",
      NGN: "en-NG",
    };

    const locale = currencyLocales[currency] || "en-US";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(finalAmount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    // Fallback to basic USD formatting if conversion fails
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / 1000); // Rough NGN to USD conversion as fallback
  }
}

interface ExchangeRateResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: Record<string, number>;
}

export async function convertCurrency(
  amount: number,
  fromCurrency: string = "NGN",
  toCurrency: string = "USD"
): Promise<number> {
  try {
    if (
      !exchangeRateCache ||
      Date.now() - exchangeRateCache.timestamp > CACHE_DURATION
    ) {
      const rate = await getExchangeRate(fromCurrency, toCurrency);
      exchangeRateCache = { rate, timestamp: Date.now() };
    }

    const convertedAmount = amount * exchangeRateCache.rate;
    return Number(convertedAmount.toFixed(2));
  } catch (error) {
    console.error("Currency conversion error:", error);
    // Fallback to approximate conversion
    return Number((amount / 1000).toFixed(2)); // Rough NGN to USD conversion
  }
}

// Utility to get the latest exchange rate without converting
export async function getExchangeRate(
  fromCurrency: string = "NGN",
  toCurrency: string = "USD"
): Promise<number> {
  try {
    const apiKey = process.env.EXCHANGE_RATES_API_KEY;
    if (!apiKey) {
      throw new Error("Exchange Rates API key is not configured");
    }

    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ExchangeRateResponse = await response.json();

    if (!data.conversion_rates || !data.conversion_rates[toCurrency]) {
      throw new Error(`Conversion rate for ${toCurrency} not found`);
    }

    return data.conversion_rates[toCurrency];
  } catch (error) {
    console.error("Exchange rate fetch error:", error);
    return 1 / 1000; // Fallback rate for NGN to USD
  }
}
