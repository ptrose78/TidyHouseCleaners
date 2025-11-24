"use client";

import { UseFormReturn, Controller } from "react-hook-form"; // Import Controller
import { BookingFormValues } from "@/lib/booking/schema";
import { ADD_ONS } from "@/lib/booking/config-addons";
import { Check, ChevronLeft, ChevronRight, Clock } from "lucide-react";

// Import your custom component
import { DatePicker } from "@/components/DatePicker"; 

interface Step2Props {
  form: UseFormReturn<BookingFormValues>;
  addOns: string[];
  toggleAddOn: (id: string) => void;
  price: number;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Details({ form, addOns, toggleAddOn, price, onNext, onBack }: Step2Props) {
  const { register, control, formState: { errors } } = form; // Add 'control' here

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Customize & Schedule</h2>
        <p className="text-gray-500">Select extras and choose a time.</p>
      </div>

      {/* SECTION 1: ADD ONS (Same as before) */}
      <div>
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          Select Add-ons
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ADD_ONS.map((addon) => {
            const isSelected = addOns.includes(addon.id);
            return (
              <button
                key={addon.id} type="button"
                onClick={() => toggleAddOn(addon.id)}
                className={`
                  p-4 border rounded-xl flex items-center gap-4 text-left transition-all
                  ${isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-gray-200 hover:border-primary/30"}
                `}
              >
                <div className={`
                  w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 transition-colors
                  ${isSelected ? "bg-primary border-primary text-white" : "bg-white border-gray-300"}
                `}>
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </div>
                <div className="flex-1">
                   <div className="font-semibold text-gray-900">{addon.label}</div>
                   <div className="text-primary font-bold text-sm">+${addon.price}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* SECTION 2: SCHEDULE */}
      <div>
        <h3 className="font-bold text-lg mb-3">When should we arrive?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* --- NEW DATE PICKER INTEGRATION --- */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 block">Preferred Date</label>
            
            <Controller
              control={control}
              name="preferredDate"
              render={({ field }) => (
                <DatePicker 
                  date={field.value} 
                  onSelect={field.onChange} 
                />
              )}
            />
            
            {errors.preferredDate && (
              <p className="text-red-500 text-xs font-medium mt-1">
                {errors.preferredDate.message}
              </p>
            )}
          </div>

          {/* Time Input (Remains the same) */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 block">Time Window</label>
            <div className="relative">
              <select 
                {...register("timeSlot")} 
                className="border p-3 pl-10 rounded-lg w-full bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
              >
                <option value="">Select window...</option>
                <option value="morning">Morning (8am - 12pm)</option>
                <option value="afternoon">Afternoon (12pm - 4pm)</option>
                <option value="evening">Evening (4pm - 6pm)</option>
              </select>
              <Clock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
            {errors.timeSlot && <p className="text-red-500 text-xs font-medium">{errors.timeSlot.message}</p>}
          </div>
        </div>
      </div>

      {/* SUMMARY & NAVIGATION */}
      <div className="pt-6 border-t mt-8">
        <div className="bg-gray-50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Estimated Total</div>
            <div className="text-4xl font-bold text-primary">${price}</div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <button 
              type="button" 
              onClick={onBack} 
              className="text-gray-500 font-medium hover:text-gray-900 px-4 py-2 flex items-center gap-2"
            >
              <ChevronLeft size={20}/> Back
            </button>

            <button 
              type="button" 
              onClick={onNext} 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
            >
              Final Step <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}