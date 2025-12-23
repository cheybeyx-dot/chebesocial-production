import React, { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Global cache for exchange rates
const exchangeRateCache = {
  rates: {},
  timestamp: 0,
  usdRate: null,
  usdTimestamp: 0,
};

// Cache validity duration (24 hours in milliseconds)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const CurrencyConverter = ({ amountInNaira = 0 }) => {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usdAmount, setUsdAmount] = useState(0);

  // Function to fetch and cache all exchange rates
  const fetchAllRates = useCallback(async () => {
    const now = Date.now();

    // If we have valid cached rates, use them
    if (
      exchangeRateCache.timestamp &&
      now - exchangeRateCache.timestamp < CACHE_DURATION
    ) {
      setCurrencies(Object.keys(exchangeRateCache.rates));
      return exchangeRateCache.rates;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_RATES_API_KEY}/latest/NGN`
      );
      const data = await response.json();

      if (data.result === "success") {
        // Cache the rates
        exchangeRateCache.rates = data.conversion_rates;
        exchangeRateCache.timestamp = now;

        // Store USD rate separately for quick access
        exchangeRateCache.usdRate = data.conversion_rates.USD;
        exchangeRateCache.usdTimestamp = now;

        setCurrencies(Object.keys(data.conversion_rates));
        return data.conversion_rates;
      } else {
        throw new Error("Failed to fetch exchange rates");
      }
    } catch (err) {
      setError("Failed to fetch exchange rates. Please try again later.");
      console.error("Exchange rate fetch error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Convert amount when currency or amount changes
  useEffect(() => {
    // Skip if amount is 0 or invalid
    if (!amountInNaira || isNaN(amountInNaira)) {
      setConvertedAmount(0);
      setUsdAmount(0);
      return;
    }

    const updateConversion = async () => {
      // For USD, we can use the cached USD rate directly
      if (selectedCurrency === "USD") {
        const now = Date.now();

        // If we have a valid cached USD rate
        if (
          exchangeRateCache.usdRate &&
          now - exchangeRateCache.usdTimestamp < CACHE_DURATION
        ) {
          setUsdAmount(amountInNaira * exchangeRateCache.usdRate);
          setConvertedAmount(amountInNaira * exchangeRateCache.usdRate);
          return;
        }
      }

      // For other currencies or if USD cache is invalid, get all rates
      const rates = await fetchAllRates();
      if (rates) {
        if (selectedCurrency === "USD") {
          setUsdAmount(amountInNaira * rates.USD);
        }
        setConvertedAmount(amountInNaira * rates[selectedCurrency]);
      }
    };

    // Debounce the conversion to prevent rapid API calls
    const debounceTimer = setTimeout(() => {
      updateConversion();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [amountInNaira, selectedCurrency, fetchAllRates]);

  // Load currencies on initial render
  useEffect(() => {
    fetchAllRates();
  }, [fetchAllRates]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const displayAmount =
    selectedCurrency === "USD" ? usdAmount : convertedAmount;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              value={loading ? "Loading..." : `$${usdAmount.toFixed(2)}`}
              disabled
              className="flex-1"
            />
            <span className="text-lg">→</span>
            <Select
              value={selectedCurrency}
              onValueChange={setSelectedCurrency}
              disabled={loading || currencies.length === 0}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                {currencies
                  .filter((curr) => curr !== "USD")
                  .map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center">Converting...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="text-xl font-semibold text-center">
              {formatCurrency(displayAmount, selectedCurrency)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;
