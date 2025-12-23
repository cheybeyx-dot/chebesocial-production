"use client";

import { useState, useEffect } from "react";
// Cache for exchange rates
const exchangeRateCache = {
  NGN_USD: { rate: null, timestamp: 0 },
};

// Cache validity duration (24 hours in milliseconds)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const CurrencyConverterUsd = ({ amountInNaira = 0 }) => {
  const [usdAmount, setUsdAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Skip API call if amount is 0 or invalid
    if (!amountInNaira || isNaN(amountInNaira)) {
      setUsdAmount(0);
      return;
    }

    const convertToUSD = async () => {
      try {
        // Check if we have a valid cached rate
        const now = Date.now();
        const cache = exchangeRateCache.NGN_USD;

        if (cache.rate && now - cache.timestamp < CACHE_DURATION) {
          // Use cached rate
          setUsdAmount(amountInNaira * cache.rate);
          return;
        }

        // If no valid cache, make API request
        setIsLoading(true);
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_RATES_API_KEY}/pair/NGN/USD/1`
        );
        const data = await response.json();

        if (data.result === "success") {
          // Cache the conversion rate (for 1 NGN to USD)
          exchangeRateCache.NGN_USD = {
            rate: data.conversion_rate,
            timestamp: now,
          };

          // Calculate amount using the rate
          setUsdAmount(amountInNaira * data.conversion_rate);
        }
      } catch (err) {
        console.error("USD conversion error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the conversion to prevent rapid API calls
    const debounceTimer = setTimeout(() => {
      convertToUSD();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [amountInNaira]);

  return (
    <div className="flex-1">
      {isLoading ? "Loading..." : `$${usdAmount.toFixed(2)}`}
    </div>
  );
};

export default CurrencyConverterUsd;
