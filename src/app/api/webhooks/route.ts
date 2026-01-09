import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { client } from "@/lib/sms"; 
import { supabaseAdmin } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover", 
});

const resend = new Resend(process.env.RESEND_API_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Extract metadata
    const { 
      customer_name, 
      service_date, 
      phone, 
      address, 
      cleaningType,
      timeSlot,
      bathrooms,
      cleaningNeeds
    } = session.metadata || {}; 
    
    const customerEmail = session.customer_details?.email;
    const amountPaid = session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00"; 

    // --- FORMAT DATE PRETTILY ---
    const dateObj = new Date(service_date);
    const readableDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    try {
      // 1. Save to Supabase (Existing logic)
      await supabaseAdmin.from("bookings").insert([{
            name: customer_name,
            email: customerEmail,
            phone: phone,
            address: address,
            cleaning_type: cleaningType,
            cleaning_needs: cleaningNeeds,
            time_slot: timeSlot,
            bathrooms: bathrooms ? parseInt(bathrooms) : 1, 
            estimated_price: session.amount_total ? session.amount_total / 100 : 0,
            preferred_date: service_date,
            status: 'confirmed', 
      }]);

      // 2. Send SMS
      if (phone) {
        // Ensure formatting
        const formattedPhone = phone.startsWith('+1') ? phone : `+1${phone}`;

        await client.messages.create({
          to: formattedPhone,
          
          // 🔴 REMOVE or COMMENT OUT THIS LINE:
          // messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID, 
          
          // 🟢 ADD THIS LINE (The Bypass):
          from: process.env.TWILIO_PHONE_NUMBER, 
          
          body: `✅ Confirmed! Your Tidy House cleaning is set for ${readableDate} at ${timeSlot || '9:00 AM'}.`
        });
      }

      // 3. Send BEAUTIFUL Email to Customer
      if (customerEmail) {
        await resend.emails.send({
          from: `Tidy House Cleaners <${process.env.BUSINESS_EMAIL!}>`,
          to: customerEmail, 
          subject: "Booking Confirmed - Tidy House Cleaners",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #10b981; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Booking Confirmed!</h1>
              </div>
              
              <div style="padding: 30px; background-color: #ffffff;">
                <p style="font-size: 16px; color: #374151;">Hi ${customer_name},</p>
                <p style="font-size: 16px; color: #374151;">Thank you for choosing Tidy House! We have received your payment of <strong>$${amountPaid}</strong> and your spot is secured.</p>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #111827;">Appointment Details</h3>
                  <ul style="list-style: none; padding: 0; margin: 0; color: #4b5563;">
                    <li style="margin-bottom: 10px;">📅 <strong>Date:</strong> ${readableDate}</li>
                    <li style="margin-bottom: 10px;">⏰ <strong>Arrival Window:</strong> ${timeSlot || 'Morning (8am - 11am)'}</li>
                    <li style="margin-bottom: 10px;">📍 <strong>Address:</strong> ${address}</li>
                    <li style="margin-bottom: 0;">✨ <strong>Service:</strong> ${cleaningType} Cleaning</li>
                  </ul>
                </div>

                <p style="font-size: 14px; color: #6b7280;">Need to reschedule? Reply to this email or text us at any time.</p>
              </div>

              <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">© 2026 Tidy House Cleaners</p>
              </div>
            </div>
          `,
        });
      }

      // 4. Send Admin Alert (Instant + Official)
      await resend.emails.send({
        from: `Tidy House Cleaners <${process.env.BUSINESS_EMAIL!}>`,
        to: process.env.BUSINESS_EMAIL!, // Send to official
        bcc: 'ptrose78+admin@gmail.com', // BCC personal for speed
        // If customerEmail is null, use undefined (which Resend accepts)
        replyTo: customerEmail || undefined, // ⭐️ Add this so you can reply to customer!
        subject: `NEW JOB: ${customer_name} on ${readableDate}`,
        html: `
          <h2>New Website Booking</h2>
          <p><strong>Customer:</strong> ${customer_name}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Date:</strong> ${readableDate}</p>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>Amount:</strong> $${amountPaid}</p>
          <hr />
          <a href="mailto:${customerEmail}" style="background-color: #000; color: #fff; padding: 10px; text-decoration: none;">Email Customer Now</a>
        `,
      });

    } catch (error) {
      console.error("❌ Process Failure:", error);
    }
  }

  return NextResponse.json({ received: true });
}