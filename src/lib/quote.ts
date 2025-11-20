// lib/quote.ts

export type CleaningNeeds = "one-time" | "weekly" | "bi-weekly" | "monthly";

export function calculateQuote({
  homeSqFt,
  bedrooms,
  bathrooms,
  cleaningType,
  cleaningNeeds,
  isNewCustomer,
}: {
  homeSqFt: string;
  bedrooms: number;
  bathrooms: number;
  cleaningType: "standard" | "deep";
  cleaningNeeds: CleaningNeeds;
  isNewCustomer: boolean;
}) {
  const sqFtBase = {
    under_1000: 100,
    "1001_1500": 130,
    "1501_2000": 160,
    "2001_2500": 200,
    "2501_3000": 240,
    "3001_3500": 280,
    "3501_4000": 320,
    "4001_plus": 360,
  };

  const frequencyDiscount = {
    "one-time": 0,
    weekly: 20,
    "bi-weekly": 15,
    monthly: 10,
  };

  let price = sqFtBase[homeSqFt] || 0;

  price += bedrooms * 15;
  price += bathrooms * 22;

  if (isNewCustomer && cleaningType === "standard") {
    price -= 35;
  }

  if (cleaningType === "deep") {
    price *= 1.5;
  }

  const discount = frequencyDiscount[cleaningNeeds];
  price = price - price * (discount / 100);

  return Math.max(80, Math.round(price));
}
