"use client";

import { ChevronLeft, Lock } from "lucide-react";
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
        <p className="text-gray-500">Enter your contact details to proceed to payment.</p>
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
            <input 
              {...register("phone")} 
              type="tel" 
              className="border p-3 rounded w-full" 
              placeholder="(555) 123-4567" 
            />
            {errors.phone ? (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            ) : (
              // ADD THIS REASSURANCE:
              <p className="text-xs text-gray-400 mt-1">
                Only used for appointment reminders. No spam.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Service Address</label>
            <input {...register("address")} className="border p-3 rounded w-full" placeholder="123 Main St, Apt 4B" />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>
        </div>

        {/* RIGHT COLUMN: Summary & Payment Notice */}
        <div className="space-y-6">
           <h3 className="font-semibold text-lg border-b pb-2">Booking Summary</h3>

          {/* Price Summary */}
          <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Estimated Total</span>
              <span className="text-4xl font-bold text-primary">${price}</span>
            </div>
            <p className="text-xs text-gray-500 text-right">Includes taxes & fees</p>
          </div>

          {/* Secure Redirect Notice */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-start gap-4">
               <div className="bg-green-100 p-2 rounded-full text-green-700 flex-shrink-0">
                  <Lock size={20} />
               </div>
               <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Secure Payment</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    You will be redirected to Stripe to securely complete your payment via Credit Card or Bank Transfer.
                  </p>
               </div>
            </div>
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
          className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-lg text-lg font-bold shadow-xl shadow-green-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? "Redirecting..." : "Continue to Payment"}
        </button>
      </div>
    </div>
  );
}