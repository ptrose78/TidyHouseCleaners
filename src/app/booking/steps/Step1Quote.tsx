// /src/app/booking/steps/Step1Quote.tsx
"use client";

import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "@/lib/booking/schema";
import { ChevronRight, Home, Bath } from "lucide-react";

interface Step1Props {
  form: UseFormReturn<BookingFormValues>;
  price: number;
  onNext: () => void;
}

// CONFIGURATION FOR TILES
const HOME_OPTIONS = [
  { id: "studio", label: "Studio", sub: "Under 800 sq ft" },
  { id: "1br", label: "1 Bedroom", sub: "Under 1,000 sq ft" },
  { id: "2br", label: "2 Bedroom", sub: "Under 1,250 sq ft" },
  { id: "3br", label: "3 Bedroom", sub: "Under 1,500 sq ft" },
  { id: "4br", label: "4 Bedroom", sub: "Under 2,000 sq ft" },
  { id: "5br", label: "5 Bedroom", sub: "2,000+ sq ft" },
];

export default function Step1Quote({ form, price, onNext }: Step1Props) {
  const { watch, setValue, formState: { errors } } = form;

  const homeSize = watch("homeSize");
  const bathrooms = watch("bathrooms") || 1; // Default to 1 for display
  const cleaningType = watch("cleaningType");

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Select your home size</h2>
        <p className="text-gray-500">Choose the option that best matches your home.</p>
      </div>

      {/* 1. HOME SIZE TILES */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {HOME_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setValue("homeSize", opt.id)}
            className={`
              relative p-4 rounded-xl border-2 text-left transition-all hover:border-primary/50
              ${homeSize === opt.id 
                ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary" 
                : "border-gray-200 bg-white"
              }
            `}
          >
            <div className={`mb-3 w-8 h-8 rounded-full flex items-center justify-center ${homeSize === opt.id ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
              <Home size={16} />
            </div>
            <div className="font-bold text-gray-900">{opt.label}</div>
            <div className="text-xs text-gray-500 font-medium">{opt.sub}</div>
          </button>
        ))}
      </div>
      {errors.homeSize && <p className="text-red-500 text-center">{errors.homeSize.message}</p>}

      <hr className="border-gray-100" />

      {/* 2. BATHROOM COUNTER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
            <Bath size={20} />
          </div>
          <div>
             <h3 className="font-bold text-lg">How many bathrooms?</h3>
             <p className="text-sm text-gray-500">Full or half baths count the same</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm border">
          <button 
            type="button"
            onClick={() => setValue("bathrooms", Math.max(1, bathrooms - 1))}
            className="w-10 h-10 rounded-lg hover:bg-gray-100 font-bold text-xl text-gray-600 transition-colors"
          >
            -
          </button>
          <span className="w-8 text-center font-bold text-xl">{bathrooms}</span>
          <button 
            type="button"
            onClick={() => setValue("bathrooms", bathrooms + 1)}
            className="w-10 h-10 rounded-lg bg-primary text-white font-bold text-xl hover:bg-primary/90 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* 3. CLEANING TYPE TOGGLE */}
      <div className="grid grid-cols-2 gap-4">
        {["standard", "deep"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setValue("cleaningType", t as "standard" | "deep")}
            className={`
              p-4 rounded-xl border-2 capitalize font-semibold transition-all
              ${cleaningType === t ? "border-primary bg-primary/10 text-primary" : "border-gray-200 text-gray-600"}
            `}
          >
            {t} Clean
          </button>
        ))}
      </div>

      {/* FOOTER: PRICE & NEXT */}
      <div className="sticky bottom-4 z-10">
        <div className="bg-gray-900 text-white p-4 rounded-xl shadow-2xl flex justify-between items-center transform transition-all hover:scale-[1.01]">
          <div>
            <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Estimated Total</div>
            <div className="text-2xl font-bold">${price}</div>
          </div>
          <button
            type="button"
            onClick={onNext}
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 flex items-center gap-2"
          >
            Next Step <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}