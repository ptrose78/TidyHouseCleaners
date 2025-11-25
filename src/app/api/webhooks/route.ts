// src/app/api/webhooks/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover", // Ensure this matches your version
});

const resend = new Resend(process.env.RESEND_API_KEY);

// You need to get this specific secret from your Stripe Dashboard > Developers > Webhooks
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  // 1. Verify the request actually came from Stripe
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // 2. Handle the "Checkout Session Completed" event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Retrieve the metadata we saved in the checkout creation step
    const { customer_name, service_date, homeSize, addOns, phone, address } = session.metadata || {};
    const customerEmail = session.customer_details?.email;
    const amountPaid = session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00";

    // 3. Send Email to the CUSTOMER
    if (customerEmail) {
      await resend.emails.send({
        from: `Tidy House Cleaners <${process.env.BUSINESS_EMAIL!}>`,
        to: customerEmail,
        subject: "Booking Confirmed: Tidy House Cleaners",
        html: `
          <h1>Booking Confirmed!</h1>
          <p>Hi ${customer_name},</p>
          <p>Thank you for booking with Tidy House Cleaners. We have received your payment of <strong>$${amountPaid}</strong>.</p>
          
          <h3>Your Booking Details:</h3>
          <ul>
            <li><strong>Date:</strong> ${service_date}</li>
            <li><strong>Service:</strong> ${homeSize} Home</li>
            <li><strong>Address:</strong> ${address}</li>
            <li><strong>Extras:</strong> ${addOns || "None"}</li>
          </ul>
          
          <p>We will see you soon!</p>
          <p>- The Tidy House Team</p>
        `,
      });
    }

    // 4. Send Alert Email to YOU (The Business Owner)
    await resend.emails.send({
      from: "Booking System <bookings@yourdomain.com>",
      to: "your-personal-email@gmail.com", // <--- CHANGE THIS to your email
      subject: `NEW BOOKING: ${customer_name}`,
      html: `
        <h1>You have a new job!</h1>
        <p><strong>Customer:</strong> ${customer_name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Date:</strong> ${service_date}</p>
        <p><strong>Paid:</strong> $${amountPaid}</p>
      `,
    });
  }

  return NextResponse.json({ received: true });
}