import { NextResponse } from "next/server";
import Stripe from "stripe";

// DETERMINE WHICH KEY TO USE: Use LIVE for production, TEST otherwise
const isProduction = process.env.NODE_ENV === 'production';
const stripeSecretKey = isProduction 
  ? process.env.LIVE_STRIPE_SECRET_KEY 
  : process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Stripe secret key is missing. Please set it in your .env file.');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-11-17.clover", 
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. EXTRACT 'metadata' from the request body
    const { email, name, price, cleaningType, date, metadata } = body;

    const origin = process.env.NEXT_PUBLIC_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "us_bank_account"],
      
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Cleaning Service (${cleaningType})`,
              description: `Scheduled for ${date}`,
            },
            unit_amount: Math.round(price * 100), 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking?canceled=true`,
      customer_email: email,
      
      // 2. PASS THE METADATA TO STRIPE
      metadata: {
        customer_name: name,
        service_date: date,
        ...metadata, 
      },
    });

    return NextResponse.json({ url: session.url });
    
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}