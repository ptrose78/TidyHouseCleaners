"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookingFormValues, bookingSchema } from "./schema";

export function useBookingForm() {
  const [step, setStep] = useState(1);
  const [addOns, setAddOns] = useState<string[]>([]);

  // FIX: Removed "<BookingFormValues>" generic here.
  // We let the zodResolver automatically define the types 
  // to handle the String -> Number coercion correctly.
  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      homeSize: "", // Start empty
      bathrooms: 1, // Start with 1
      cleaningType: "standard",
      cleaningNeeds: "one-time",
      isNewCustomer: false,
      // undefined allows these to be optional
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

  const onSubmit = async (values: BookingFormValues, estimatedPrice: number) => {
    try {
      await fetch("/api/submit-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, addOns, estimatedPrice }),
      });
      
      alert("Booking submitted successfully!");
      form.reset();
      setAddOns([]);
      setStep(1);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
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