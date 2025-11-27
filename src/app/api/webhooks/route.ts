import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover", // Keep your specific version
});

const resend = new Resend(process.env.RESEND_API_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  // 1. Verify Request
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log("✅ Webhook verified. Event Type:", event.type);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // 2. Handle the Event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("💰 Payment succeeded for session:", session.id);

    // Extract Data
    const { customer_name, service_date, homeSize, addOns, phone, address } = session.metadata || {};
    const customerEmail = session.customer_details?.email; // Prefer customer_details over session.email
    const amountPaid = session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00";

    try {
      // 3. Send Email to CUSTOMER
      if (customerEmail) {
        console.log(`📧 Attempting to send email to customer: ${customerEmail}`);
        const data = await resend.emails.send({
          from: `Tidy House Cleaners <${process.env.BUSINESS_EMAIL!}>`,
          to: customerEmail, 
          subject: "Booking Confirmed: Tidy House Cleaners",
          html: `
            <h1>Booking Confirmed!</h1>
            <p>Hi ${customer_name || 'Customer'},</p>
            <p>Thank you for booking. Payment of <strong>$${amountPaid}</strong> received.</p>
            <ul>
                <li><strong>Date:</strong> ${service_date}</li>
                <li><strong>Address:</strong> ${address}</li>
            </ul>
          `,
        });
        console.log("✅ Customer Email ID:", data.id); // If this logs, email was sent
        if (data.error) console.error("❌ Resend Error (Customer):", data.error);
      }

      // 4. Send Alert Email to YOU
      // REPLACE 'your-real-email@gmail.com' WITH YOUR ACTUAL EMAIL
      const MY_EMAIL = 'paultrose1@gmail.com'; 
      console.log(`📧 Attempting to send alert to owner: ${MY_EMAIL}`);
      
      const adminData = await resend.emails.send({
        from: `Tidy House Cleaners <${process.env.BUSINESS_EMAIL!}>`,
        to: MY_EMAIL,
        subject: `NEW BOOKING: ${customer_name}`,
        html: `<p>New job confirmed for $${amountPaid}</p>`,
      });
      console.log("✅ Admin Email ID:", adminData.id);
      if (adminData.error) console.error("❌ Resend Error (Admin):", adminData.error);

    } catch (emailError) {
      console.error("❌ CRITICAL EMAIL FAILURE:", emailError);
    }
  } else {
    console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}