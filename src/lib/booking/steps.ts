// /lib/booking/steps.ts

import { BookingFormValues } from "./schema";

export const steps: Record<number, (keyof BookingFormValues)[]> = {
  1: ["homeSize", "bathrooms"],
  2: ["cleaningType", "cleaningNeeds"],
  3: [], 
  4: ["preferredDate", "timeSlot"],
  5: ["name", "email", "phone", "address"],
};
