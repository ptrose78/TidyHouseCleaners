// src/app/api/create-checkout-session/route.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";

// DETERMINE WHICH KEY TO USE: Use LIVE for production, TEST otherwise (e.g., local/preview)
const isProduction = process.env.NODE_ENV === 'production';
const stripeSecretKey = isProduction 
  ? process.env.LIVE_STRIPE_SECRET_KEY // Assuming your live key is named this
  : process.env.STRIPE_SECRET_KEY;     // Assuming your test key is named this

// 1. SAFETY CHECK: Ensure the key exists to prevent build crashes
if (!stripeSecretKey) {
  throw new Error('Stripe secret key is missing. Please set it in your .env file.');
}

// Initialize Stripe
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-11-17.clover", // Use a valid, recent stable version
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, price, cleaningType, date } = body;

    // 2. URL FIX: Calculate the domain dynamically
    // This prioritizes your custom env var, falls back to Vercel's auto-generated URL, 
    // and finally defaults to localhost for development.
    const origin = process.env.NEXT_PUBLIC_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    // Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "us_bank_account"], // Enable Cards + Bank
      
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Cleaning Service (${cleaningType})`,
              description: `Scheduled for ${date}`,
            },
            unit_amount: Math.round(price * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      
      // 3. USE THE DYNAMIC ORIGIN: Prevents the "Invalid URL" error
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking?canceled=true`,
      
      customer_email: email,
      
      metadata: {
        customer_name: name,
        service_date: date,
      },
    });

    return NextResponse.json({ url: session.url });
    
  } catch (error: any) {
    console.error("Stripe Error:", error);
    // Return the actual error message to help with debugging
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}