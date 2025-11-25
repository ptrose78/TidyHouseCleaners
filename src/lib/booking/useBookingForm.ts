// /src/lib/booking/useBookingForm.ts
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookingFormValues, bookingSchema } from "./schema";

export function useBookingForm() {
  const [step, setStep] = useState(1);
  const [addOns, setAddOns] = useState<string[]>([]);

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      homeSize: "", 
      bathrooms: 1, 
      cleaningType: "standard",
      cleaningNeeds: "one-time",
      isNewCustomer: false,
      preferredDate: undefined,
      timeSlot: undefined,
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const toggleAddOn = (id: string) => {
    setAddOns(prev => prev.includes(id) 
      ? prev.filter(x => x !== id) 
      : [...prev, id]
    );
  };

  const goNext = async (fields: (keyof BookingFormValues)[]) => {
    // Cast fields to 'any' to avoid strict type checks on keys during trigger
    const valid = await form.trigger(fields as any);
    if (valid) setStep(prev => prev + 1);
  };

  const goBack = () => setStep(prev => prev - 1);

  // --- UPDATED SUBMIT LOGIC FOR STRIPE ---
  const onSubmit = async (values: BookingFormValues, estimatedPrice: number) => {
    try {
      // 1. Call the API to create a Stripe Checkout Session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Pass the data Stripe needs for the receipt/invoice
          email: values.email,
          name: values.name,
          date: values.preferredDate, // Valid Date object (will be stringified to ISO)
          cleaningType: values.cleaningType,
          price: estimatedPrice,
          
          // Optional: Pass other details if you want to save them in Stripe Metadata
          metadata: {
             phone: values.phone,
             address: values.address,
             homeSize: values.homeSize,
             addOns: addOns.join(", ")
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      // 2. Redirect to the secure Stripe URL
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment system is currently unavailable. Please try again.");
      }

    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong connecting to payment. Please try again.");
    }
  };

  return {
    step,
    setStep,
    addOns,
    toggleAddOn,
    goNext,
    goBack,
    onSubmit,
    form,
  };
}