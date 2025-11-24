"use client";

import { ChevronLeft } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "@/lib/booking/schema";

interface Step5Props {
  form: UseFormReturn<BookingFormValues>;
  price: number;
  onBack: () => void;
}

export default function Step5Contact({ form, price, onBack }: Step5Props) {
  const { register, formState: { errors, isSubmitting } } = form;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center mb-6">Contact Information</h2>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-semibold">Full Name</label>
          <input {...register("name")} className="border p-3 rounded w-full" placeholder="John Doe" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-semibold">Email Address</label>
          <input {...register("email")} type="email" className="border p-3 rounded w-full" placeholder="john@example.com" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-semibold">Phone Number</label>
          <input {...register("phone")} type="tel" className="border p-3 rounded w-full" placeholder="(555) 123-4567" />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-semibold">Service Address</label>
          <input {...register("address")} className="border p-3 rounded w-full" placeholder="123 Main St" />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>
      </div>

      {/* Summary Box */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl border">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg">Estimated Total:</span>
          <span className="font-bold text-2xl text-primary">${price}</span>
        </div>
        <p className="text-sm text-gray-500">
          By clicking "Book Now", you agree to our terms of service. 
          Payment will be collected after the service is completed.
        </p>
      </div>

      <div className="flex justify-between items-center pt-6">
        <button type="button" onClick={onBack} className="text-primary flex items-center gap-2">
          <ChevronLeft /> Back
        </button>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-bold shadow-lg transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Booking..." : "Book Now"}
        </button>
      </div>
    </div>
  );
}