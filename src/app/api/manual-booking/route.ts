import { NextResponse } from "next/server";
import { Resend } from "resend";
import { client } from "@/lib/sms"; 
import { supabaseAdmin } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      phone, 
      address, 
      date, 
      time, 
      price, 
      serviceType,
      homeSize,
      bathrooms,
      cleaningNeeds
    } = body;

    // 1. Save to Supabase
    const { error: dbError } = await supabaseAdmin
      .from("bookings")
      .insert([
        {
          name,
          email,
          phone,
          address,
          cleaning_type: serviceType,
          home_size: homeSize || "Manual Entry", 
          bathrooms: bathrooms ? parseInt(bathrooms) : 1, 
          cleaning_needs: cleaningNeeds || "Manual Booking",
          time_slot: time,
          estimated_price: parseFloat(price),
          preferred_date: date,
          status: 'confirmed', 
          is_new_customer: false,
        },
      ]);

    if (dbError) {
      console.error("Supabase Error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // --- FORMAT DATE ---
    const dateObj = new Date(date);
    const readableDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    });

    // 2. Send SMS (To Customer)
    if (phone) {
      try {
        await client.messages.create({
          to: phone,
          messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID, 
          body: `✅ Confirmed! Your Tidy House cleaning is set for ${readableDate} at ${time}. Total: $${price}.`
        });
      } catch (smsError) {
        console.error("Twilio Error:", smsError);
      }
    }

    // 3. Send Email (To Customer)
    if (email) {
      try {
        await resend.emails.send({
          from: `Tidy House Cleaners <${process.env.BUSINESS_EMAIL!}>`,
          to: email, 
          subject: "Booking Confirmed - Tidy House Cleaners",
          html: `
            <h1>Booking Confirmed!</h1>
            <p>Hi ${name},</p>
            <p>Your manual booking has been confirmed by our team.</p>
            <ul>
                <li><strong>Date:</strong> ${readableDate}</li>
                <li><strong>Time:</strong> ${time}</li>
                <li><strong>Service:</strong> ${serviceType}</li>
                <li><strong>Details:</strong> ${homeSize || "N/A"}, ${bathrooms || 1} Bath(s)</li>
                <li><strong>Notes:</strong> ${cleaningNeeds || "None"}</li>
                <li><strong>Address:</strong> ${address}</li>
                <li><strong>Price:</strong> $${price}</li>
            </ul>
            <p>Thank you!</p>
          `,
        });
      } catch (emailError) {
        console.error("Resend Error (Customer):", emailError);
      }
    }

    // 4. Send Admin Alert (To You)
    try {
      const MY_EMAIL = 'ptrose78+admin@gmail.com'; 
      
      await resend.emails.send({
        from: `Tidy House Cleaners <${process.env.BUSINESS_EMAIL!}>`,
        to: MY_EMAIL,
        replyTo: email, 
        subject: `MANUAL BOOKING: ${name} on ${readableDate}`,
        html: `
          <h2>New Manual Booking</h2>
          <p><strong>Customer:</strong> ${name}</p>
          <p><strong>Date:</strong> ${readableDate} @ ${time}</p>
          <p><strong>Price:</strong> $${price}</p>
          <p><strong>Notes:</strong> ${cleaningNeeds}</p>
          <hr />
          <p>
            <a href="mailto:${email}?subject=Regarding your cleaning on ${readableDate}" 
               style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
               Email ${name} Now
            </a>
          </p>
        `,
      });
    } catch (adminError) {
      console.error("Resend Error (Admin):", adminError);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Manual Booking Error:", error);
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}