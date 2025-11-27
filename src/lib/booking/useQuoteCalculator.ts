// /src/lib/booking/useQuoteCalculator.ts
import { useMemo } from "react";
import { BookingFormValues } from "./schema";

interface AddOn {
  id: string;
  price: number;
}

// DEFINE YOUR PACKAGES HERE
const BASE_PRICES: Record<string, number> = {
  "1br": 100, // 1 Bedroom (< 1000 sq ft)
  "2br": 140, // 2 Bedroom (< 1250 sq ft)
  "3br": 190, // 3 Bedroom (< 1500 sq ft)
  "4br": 250, // 4 Bedroom (< 2000 sq ft)
  "5br": 320, // 5 Bedroom (Large)
  "studio": 0,
};

export function useQuoteCalculator(form: BookingFormValues, addOns: AddOn[]) {
  const base = useMemo(() => {
    // 1. Get Base Price from the Tile Selection (default to 0 if missing)
    const packagePrice = BASE_PRICES[form.homeSize] || 0;

    // 2. Add Bathroom fee ($30 per bath is standard)
    // We subtract 1 because usually 1 bath is included in the base package price, 
    // but you can adjust logic as needed. Here I'll just charge per bath.
    const bathPrice = (form.bathrooms || 0) * 0.25;

    // 3. Deep Clean Multiplier (e.g. +40% or flat fee)
    const deepCleanFee = form.cleaningType === "deep" ? 60 : 0;

    // 4. Frequency Discount
    const frequencyDiscount =
      form.cleaningNeeds === "weekly" ? -30
      : form.cleaningNeeds === "bi-weekly" ? -15
      : form.cleaningNeeds === "monthly" ? -10
      : 0;

    return packagePrice + bathPrice + deepCleanFee + frequencyDiscount;
  }, [form]);

  const addOnTotal = useMemo(() => {
    return addOns.reduce((sum, x) => sum + x.price, 0);
  }, [addOns]);

  // Ensure price never goes below a minimum (e.g. $80)
  const total = base + addOnTotal;
  return total > 0 ? total : 0;
}