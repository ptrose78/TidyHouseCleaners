// src/app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your Secret Key (saved in .env.local)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover", // Use latest version or whatever your IDE suggests
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, price, cleaningType, date } = body;

    // Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "us_bank_account"], // Enable Cards + Bank (Low Fee)
      
      // What the customer sees on the checkout page
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Cleaning Service (${cleaningType})`,
              description: `Scheduled for ${date}`,
            },
            unit_amount: Math.round(price * 100), // Stripe expects cents (e.g., $150.00 = 15000)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      
      // Where to send the user after payment
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/booking?canceled=true`,
      
      // Pre-fill customer email if collected
      customer_email: email,
      
      // Save metadata so you know who paid later
      metadata: {
        customer_name: name,
        service_date: date,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}