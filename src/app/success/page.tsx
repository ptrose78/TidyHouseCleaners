"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Home, Mail, CalendarClock, Phone } from "lucide-react";
import { Suspense } from "react";

// We need a wrapper component to handle the search params safely in Next.js
function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // Truncate the long session ID to make it look like a clean Order #
  const orderNumber = sessionId ? sessionId.slice(-8).toUpperCase() : "PENDING";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* HEADER: Green Success Banner */}
        <div className="bg-green-600 p-8 text-center text-white">
          <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-green-100 text-lg">
            Thank you for choosing Tidy House Cleaners.
          </p>
        </div>

        {/* BODY: The Details */}
        <div className="p-8 md:p-12 space-y-8">
          
          {/* 1. Immediate Reassurance */}
          <div className="text-center space-y-2">
            <p className="text-gray-600 text-lg">
              We have received your payment and secured your slot.
            </p>
            <div className="inline-block bg-gray-100 px-4 py-1 rounded-full text-xs font-mono text-gray-500 tracking-widest">
              ORDER #{orderNumber}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 2. What Happens Next? (The "Timeline") */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-lg">What happens next?</h3>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Check your email</h4>
                  <p className="text-sm text-gray-500">
                    We've sent a receipt and full booking details to your inbox.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                  <CalendarClock size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">The Reminder</h4>
                  <p className="text-sm text-gray-500">
                    You will receive a text reminder 24 hours before our team arrives.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Need to make changes?</h4>
                  <p className="text-sm text-gray-500">
                    Reply to your confirmation email or call us at {process.env.NEXT_PUBLIC_BUSINESS_PHONE}.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Action Buttons */}
          <div className="pt-4 flex flex-col md:flex-row gap-4">
            <Link 
              href="/" 
              className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold text-center hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <Home size={20} /> Return Home
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading confirmation...</div>}>
      <SuccessContent />
    </Suspense>
  );
}