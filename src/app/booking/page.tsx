"use client";

import { useBookingForm } from "@/lib/booking/useBookingForm";
import { ADD_ONS } from "@/lib/booking/config-addons";
import { useQuoteCalculator } from "@/lib/booking/useQuoteCalculator";
import { Check } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "@/lib/booking/schema";
import { useSearchParams } from "next/navigation"; // <--- 1. Import this
import { useEffect, Suspense } from "react";       // <--- 2. Import this

// Import the NEW simplified steps
import Step1Quote from "./steps/Step1Quote";
import Step2Details from "./steps/Step2Details";
import Step3Finalize from "./steps/Step3Finalize";

// We separate the Logic into a sub-component to handle "Suspense" safely
function BookingFormContent() {
  const { form, step, setStep, goBack, addOns, toggleAddOn, onSubmit } = useBookingForm();

  // --- NEW CANCEL LOGIC START ---
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if Stripe sent the user back with ?canceled=true
    if (searchParams.get("canceled")) {
      alert("Payment was cancelled. You can try again when you are ready.");
      
      // Clean up the URL so the alert doesn't show again if they refresh
      window.history.replaceState(null, "", "/booking");
    }
  }, [searchParams]);
  // --- NEW CANCEL LOGIC END ---

  const values = form.watch();
  
  // 1. Calculate Price
  const selectedAddOns = addOns.map((id) => ADD_ONS.find(x => x.id === id)!);
  const estimatedPrice = useQuoteCalculator(values as unknown as BookingFormValues, selectedAddOns);

  // 2. Define the Fields for each step (for validation triggers)
  const handleNext = async () => {
    let fieldsToValidate: (keyof BookingFormValues)[] = [];

    if (step === 1) {
      // Validate Step 1 fields
      fieldsToValidate = ["homeSize", "bathrooms", "cleaningType"];
    } else if (step === 2) {
      // Validate Step 2 fields
      fieldsToValidate = ["preferredDate", "timeSlot"];
    }

    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) setStep((prev) => prev + 1);
  };

  return (
    <div className="py-16 px-4 max-w-4xl mx-auto">
      
      {/* 3-STEP PROGRESS BAR */}
      <div className="flex justify-center items-center mb-12">
        {[1, 2, 3].map(n => {
          const isCompleted = step > n;
          const isActive = step === n;
          return (
            <div key={n} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                ${isCompleted || isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}
              `}>
                {isCompleted ? <Check size={18} /> : n}
              </div>
              {n < 3 && (
                <div className={`w-16 h-1 mx-2 rounded ${isCompleted ? "bg-primary" : "bg-gray-100"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* MAIN FORM AREA */}
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <form onSubmit={form.handleSubmit((data) => 
          onSubmit(data as unknown as BookingFormValues, estimatedPrice)
        )}>
          
          {step === 1 && (
            <Step1Quote
              form={form as unknown as UseFormReturn<BookingFormValues>}
              price={estimatedPrice}
              onNext={handleNext}
            />
          )}

          {step === 2 && (
            <Step2Details
              form={form as unknown as UseFormReturn<BookingFormValues>}
              addOns={addOns}
              toggleAddOn={toggleAddOn}
              price={estimatedPrice}
              onNext={handleNext}
              onBack={goBack}
            />
          )}

          {step === 3 && (
            <Step3Finalize
              form={form as unknown as UseFormReturn<BookingFormValues>}
              price={estimatedPrice}
              onBack={goBack}
            />
          )}

        </form>
      </div>
    </div>
  );
}

// MAIN COMPONENT WRAPPER
// We wrap the content in Suspense to prevent Next.js build errors
// because we are using useSearchParams
export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading booking form...</div>}>
      <BookingFormContent />
    </Suspense>
  );
}