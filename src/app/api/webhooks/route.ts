import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { client } from "@/lib/sms"; 
import { supabaseAdmin } from "@/lib/supabase";

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

    // EXPANDED METADATA EXTRACTION: Assumes all necessary booking fields were passed from checkout session
    const { 
      customer_name, 
      service_date, 
      phone, 
      address, 
      homeSize, 
      cleaningType,
      timeSlot,
      bathrooms,
      cleaningNeeds,
      isNewCustomer,
    } = session.metadata || {}; 
    
    const customerEmail = session.customer_details?.email;
    // Calculate final payment amount and format
    const amountPaid = session.amount_total ? (session.amount_total / 100) : 0; 
    const formattedAmountPaid = amountPaid.toFixed(2);

    try {
      // 3. NEW: Save Booking to Supabase (Database of Record)
      const { data: bookingData, error: dbError } = await supabaseAdmin
        .from("bookings")
        .insert([
          {
            name: customer_name,
            email: customerEmail,
            phone: phone,
            address: address,
            home_size: homeSize,
            // Convert to integer or handle potential nulls for DB insert
            bathrooms: bathrooms ? parseInt(bathrooms) : 1, 
            cleaning_type: cleaningType,
            cleaning_needs: cleaningNeeds,
            time_slot: timeSlot,
            // Convert string to boolean
            is_new_customer: isNewCustomer === 'true', 
            estimated_price: amountPaid,
            preferred_date: service_date, // Should be an ISO date string
            reminder_message_sid: null, // Placeholder, updated later by create-booking API or cron
            status: 'confirmed', 
          },
        ])
        .select("id")
        .single();

      if (dbError) {
        console.error("❌ Supabase DB Error:", dbError);
        // CRITICAL: We log the error but proceed to send confirmation to the user (SMS/Email) 
        // since payment was successful. Manual follow-up is required.
      }
        
      // 4. Send IMMEDIATE SMS Confirmation
      if (phone) {
        console.log(`📱 Attempting to send SMS confirmation to: ${phone}`);
        await client.messages.create({
          to: phone,
          messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID, 
          body: `✅ Confirmed! Your Tidy House cleaning is booked for ${service_date}. Total paid: $${formattedAmountPaid}. See email for details.`
        });
        console.log("✅ SMS Confirmation Sent!");
      }

      // 5. Send Email to CUSTOMER (Existing Logic)
      if (customerEmail) {
        console.log(`📧 Attempting to send email to customer: ${customerEmail}`);
        
        const { data: customerData, error: customerError } = await resend.emails.send({
          from: `Tidy House Cleaners <${process.env.BUSINESS_EMAIL!}>`,
          to: customerEmail, 
          subject: "Booking Confirmed: Tidy House Cleaners",
          html: `
            <h1>Booking Confirmed!</h1>
            <p>Hi ${customer_name || 'Customer'},</p>
            <p>Thank you for booking. Payment of <strong>$${formattedAmountPaid}</strong> received.</p>
            <ul>
                <li><strong>Date:</strong> ${service_date}</li>
                <li><strong>Address:</strong> ${address}</li>
            </ul>
          `,
        });

        if (customerError) {
          console.error("❌ Resend Error (Customer):", customerError);
        } else {
          console.log("✅ Customer Email Sent! ID:", customerData?.id);
        }
      }

      // 6. Send Alert Email to YOU (Existing Logic)
      const MY_EMAIL = 'paultrose1@gmail.com'; 
      console.log(`📧 Attempting to send alert to owner: ${MY_EMAIL}`);
      
      const { data: adminData, error: adminError } = await resend.emails.send({
        from: `Tidy House Cleaners <${process.env.BUSINESS_EMAIL!}>`,
        to: MY_EMAIL,
        subject: `NEW BOOKING: ${customer_name}`,
        html: `<p>New job confirmed for $${formattedAmountPaid}</p>`,
      });

      if (adminError) {
        console.error("❌ Resend Error (Admin):", adminError);
      } else {
        console.log("✅ Admin Email Sent! ID:", adminData?.id);
      }

    } catch (error) {
      // This catches crashes (e.g., network timeout)
      console.error("❌ CRITICAL PROCESS FAILURE (DB/Email/SMS):", error);
    }
  } else {
    console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}