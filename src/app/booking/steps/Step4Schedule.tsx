"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "@/lib/booking/schema";

interface Step4Props {
  form: UseFormReturn<BookingFormValues>;
  onNext: () => void;
  onBack: () => void;
}

export default function Step4Schedule({ form, onNext, onBack }: Step4Props) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center mb-6">When should we come?</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Picker */}
        <div>
          <label className="block mb-2 font-semibold">Preferred Date *</label>
          <input 
            type="date" 
            {...register("preferredDate")} 
            className="border p-3 rounded w-full" 
          />
          {errors.preferredDate && (
            <p className="text-red-500 text-sm mt-1">{errors.preferredDate.message}</p>
          )}
        </div>

        {/* Time Slot */}
        <div>
          <label className="block mb-2 font-semibold">Time Slot *</label>
          <select {...register("timeSlot")} className="border p-3 rounded w-full">
            <option value="">Select a time...</option>
            <option value="morning">Morning (8am - 12pm)</option>
            <option value="afternoon">Afternoon (12pm - 4pm)</option>
            <option value="evening">Evening (4pm - 6pm)</option>
          </select>
          {errors.timeSlot && (
            <p className="text-red-500 text-sm mt-1">{errors.timeSlot.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button type="button" onClick={onBack} className="text-primary flex items-center gap-2">
          <ChevronLeft /> Back
        </button>
        <button type="button" onClick={onNext} className="bg-primary px-6 py-3 rounded-lg flex items-center gap-2 text-white">
          Continue <ChevronRight />
        </button>
      </div>
    </div>
  );
}