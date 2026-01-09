import { NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.LIVE_STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing. Please set it in your .env file.');
}

const stripe = new Stripe(process.env.LIVE_STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover", 
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, price, cleaningType, date, metadata } = body; // Destructure metadata here

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
              description: `Scheduled for ${new Date(date).toLocaleDateString()}`,
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
      
      // CRITICAL FIX: Pass the address and other details to Stripe
      metadata: {
        customer_name: name,
        service_date: date,
        ...metadata, // <--- This includes address, phone, homeSize, etc.
      },
    });

    return NextResponse.json({ url: session.url });
    
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}