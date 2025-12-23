interface ExchangeRates {
  USD_NGN: number;
  USD_USDT: number;
}

let exchangeRates: ExchangeRates = {
  USD_NGN: 1500, // Default value, 1 USD = 460 NGN
  USD_USDT: 1, // Default value, 1 USD = 1 USDT
};

export async function updateExchangeRates() {
  try {
    // Fetch latest exchange rates from an API
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    const data = await response.json();

    exchangeRates = {
      USD_NGN: data.rates.NGN,
      USD_USDT: 1, // USDT is typically pegged to USD
    };
  } catch (error) {
    console.error("Failed to update exchange rates:", error);
  }
}

export function convertUSDToNGN(usdAmount: number): number {
  return usdAmount * exchangeRates.USD_NGN;
}

export function convertNGNToUSD(ngnAmount: number): number {
  return ngnAmount / exchangeRates.USD_NGN;
}

export function convertUSDToUSDT(usdAmount: number): number {
  return usdAmount * exchangeRates.USD_USDT;
}

export function convertUSDTToUSD(usdtAmount: number): number {
  return usdtAmount / exchangeRates.USD_USDT;
}
