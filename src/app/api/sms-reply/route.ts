// src/app/api/sms-reply/route.ts

import { NextResponse } from "next/server";
import twilio from 'twilio';
// IMPORT the cancellation function from your library
import { cancelScheduledReminder } from '@/lib/sms'; 
// IMPORT Supabase Admin Client
import { supabaseAdmin } from "@/lib/supabase"; 

// 1. Initialize the Twilio Client (REQUIRED for this method)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// BUSINESS LOGIC FUNCTION (Supabase Implementation)
async function findAndCancelNextBooking(senderNumber: string) {
  // 1. Find the next UPCOMING, CONFIRMED booking for this phone number
  const { data: booking, error: findError } = await supabaseAdmin
    .from('bookings')
    .select('id, reminder_message_sid')
    // Match phone number and status 'confirmed'
    .eq('phone', senderNumber)
    .eq('status', 'confirmed')
    // Order by date to get the next one
    .order('preferred_date', { ascending: true })
    .limit(1)
    .single();

  if (findError || !booking) {
    console.error("No upcoming booking found or DB error:", findError);
    return false;
  }
  
  // 2. Cancel the Twilio scheduled reminder (using the existing utility)
  // reminder_message_sid is the column name in the DB schema
  if (booking.reminder_message_sid) {
    // Note: cancelScheduledReminder logs its own success/failure
    await cancelScheduledReminder(booking.reminder_message_sid);
  }
  
  // 3. Update the booking status in Supabase
  const { error: updateError } = await supabaseAdmin
    .from('bookings')
    .update({ status: 'canceled', reminder_message_sid: null })
    .eq('id', booking.id);
  
  if (updateError) {
    console.error("Supabase Update Error:", updateError);
    return false;
  }
  
  return true; // Success
}
// ---------------------------------------------


export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const incomingMsg = formData.get('Body') as string;
    const senderNumber = formData.get('From') as string;
    const myTwilioNumber = formData.get('To') as string; 

    console.log(`Received message from ${senderNumber}: ${incomingMsg}`);

    const cleanMsg = incomingMsg?.trim().toLowerCase();
    let replyBody = '';

    if (cleanMsg === 'schedule') {
      replyBody = '📅 Here is the link to schedule your cleaning: https://tidyhouse.com/book';
    } else if (cleanMsg === 'help') {
      replyBody = '🧹 Support Team here! Call us at 555-0199 for urgent issues.';
    } else if (cleanMsg === 'cancel') {
        // --- AUTO-CANCELLATION LOGIC ---
        const wasCanceled = await findAndCancelNextBooking(senderNumber);
        if (wasCanceled) {
            replyBody = '✅ Your next upcoming cleaning appointment has been successfully CANCELED. We will miss you!';
        } else {
            replyBody = '❌ We could not find a confirmed upcoming appointment to cancel. Please reply HELP or call 555-0199.';
        }
        // ----------------------------------
    } else {
      replyBody = 'Thanks for messaging Tidy House! We received your note.';
    }

    // Send the explicit reply
    await client.messages.create({
      body: replyBody,
      from: myTwilioNumber,
      to: senderNumber
    });
    console.log("Reply sent successfully via API");

    return new NextResponse('<Response></Response>', {
      headers: { 'Content-Type': 'text/xml' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error handling reply:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}