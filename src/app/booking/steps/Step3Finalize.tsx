"use client";

import { ChevronLeft, Lock, CreditCard } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "@/lib/booking/schema";

interface Step3Props {
  form: UseFormReturn<BookingFormValues>;
  price: number;
  onBack: () => void;
}

export default function Step3Finalize({ form, price, onBack }: Step3Props) {
  const { register, formState: { errors, isSubmitting } } = form;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Finalize Booking</h2>
        <p className="text-gray-500">Enter your details to secure your slot.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT COLUMN: Contact Info */}
        <div className="space-y-5">
          <h3 className="font-semibold text-lg border-b pb-2">Contact Details</h3>
          
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input {...register("name")} className="border p-3 rounded w-full" placeholder="Jane Doe" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input {...register("email")} type="email" className="border p-3 rounded w-full" placeholder="jane@example.com" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input {...register("phone")} type="tel" className="border p-3 rounded w-full" placeholder="(555) 123-4567" />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Service Address</label>
            <input {...register("address")} className="border p-3 rounded w-full" placeholder="123 Main St, Apt 4B" />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>
        </div>

        {/* RIGHT COLUMN: Payment Placeholder */}
        <div className="space-y-5">
          <h3 className="font-semibold text-lg border-b pb-2 flex items-center gap-2">
            <Lock size={16} className="text-green-600" /> Payment Method
          </h3>

          <div className="bg-gray-50 p-4 rounded-xl border space-y-4">
            {/* Visual Card Input (Not connected to Form yet) */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                  className="border p-3 rounded w-full pl-10 bg-white" 
                  disabled 
                />
                <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry</label>
                <input type="text" placeholder="MM / YY" className="border p-3 rounded w-full bg-white" disabled />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVC</label>
                <input type="text" placeholder="123" className="border p-3 rounded w-full bg-white" disabled />
              </div>
            </div>

            <div className="text-xs text-center text-gray-400 mt-2">
              <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-[10px] font-bold">TEST MODE</span>
              <span className="ml-2">Payment integration coming soon.</span>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-primary/5 p-5 rounded-xl border border-primary/20">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-600">Total Estimate</span>
              <span className="text-3xl font-bold text-primary">${price}</span>
            </div>
            <p className="text-xs text-gray-500 text-right">Includes taxes & fees</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t mt-8">
        <button type="button" onClick={onBack} className="text-gray-500 font-medium hover:text-primary transition-colors flex items-center gap-2">
          <ChevronLeft size={20}/> Back
        </button>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-lg text-lg font-bold shadow-xl shadow-green-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : `Book for $${price}`}
        </button>
      </div>
    </div>
  );
}