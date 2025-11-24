// /src/lib/booking/schema.ts
import { z } from "zod";

export const bookingSchema = z.object({
  homeSize: z.string().min(1, "Please select your home size"), 
  bathrooms: z.coerce.number().min(1, "At least 1 bathroom required"),

  cleaningType: z.enum(["standard", "deep"]),
  cleaningNeeds: z.enum(["one-time", "weekly", "bi-weekly", "monthly"]),
  
  isNewCustomer: z.boolean().default(false),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().min(5, "Address is required"),

  preferredDate: z.date({
    message: "Please select a date for your cleaning",
  }),

  timeSlot: z.enum(["morning", "afternoon", "evening"], {
    message: "Please select a preferred time slot"
  }),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;