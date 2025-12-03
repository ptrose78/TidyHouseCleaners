import { NextResponse } from 'next/server';
import { cancelScheduledReminder } from '@/lib/sms'; 

// NOTE: Import your actual database client here (e.g., Prisma, Supabase, Firebase)
// import { db } from '@/lib/db'; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 });
    }

    // --- STEP 1: Look up the booking in your Database ---
    // You need to retrieve the 'reminderMessageSid' you saved when they booked.
    // const booking = await db.booking.findUnique({ where: { id: bookingId } });
    
    // MOCK DATA (Delete this block when you add real DB code)
    const booking = {
      id: bookingId,
      status: 'confirmed',
      reminderMessageSid: 'SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' // This would come from your DB
    };
    // ----------------------------------------------------

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // --- STEP 2: Cancel the text message ---
    // We check if a reminder ID exists before trying to cancel
    if (booking.reminderMessageSid) {
      await cancelScheduledReminder(booking.reminderMessageSid);
    }

    // --- STEP 3: Cancel the booking in your Database ---
    // await db.booking.update({ 
    //   where: { id: bookingId }, 
    //   data: { status: 'canceled', reminderMessageSid: null } 
    // });
    
    return NextResponse.json({ success: true, message: 'Booking cancelled and reminder stopped' });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}