import { NextResponse } from 'next/server';
import { cancelScheduledReminder } from '@/lib/sms'; 
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 });
    }

    // --- STEP 1: Look up the booking in Supabase ---
    const { data: booking, error: findError } = await supabaseAdmin
        .from('bookings')
        .select('id, reminder_message_sid, status')
        .eq('id', bookingId)
        .single();

    if (findError || !booking) {
      console.error("Booking lookup failed:", findError);
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // --- STEP 2: Cancel the text message (Twilio) ---
    // We check if a reminder ID exists before trying to cancel
    if (booking.reminder_message_sid) {
      try {
        await cancelScheduledReminder(booking.reminder_message_sid);
        console.log(`❌ Cancelled Twilio reminder: ${booking.reminder_message_sid}`);
      } catch (twilioError) {
        console.warn("Could not cancel Twilio msg (might already be sent/cancelled):", twilioError);
        // Continue execution - we still want to cancel the booking in the DB
      }
    }

    // --- STEP 3: Cancel the booking in Supabase ---
    const { error: updateError } = await supabaseAdmin
        .from('bookings')
        .update({ 
            status: 'canceled', 
            reminder_message_sid: null 
        })
        .eq('id', bookingId);

    if (updateError) {
        throw new Error(updateError.message);
    }
    
    return NextResponse.json({ success: true, message: 'Booking cancelled and reminder stopped' });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}