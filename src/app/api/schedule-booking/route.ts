import { NextResponse } from 'next/server';
import { scheduleReminder } from '@/lib/twilio';

export async function POST(req: Request) {
  const body = await req.json();
  const { customerPhone, appointmentDate } = body;

  // 1. Save Booking to Database (Your existing code)
  // const booking = await db.create(...)

  // 2. Schedule the Twilio Reminder
  // Ensure appointmentDate is a proper Date object
  const dateObj = new Date(appointmentDate);
  
  // Fire and forget (don't block the UI response)
  scheduleReminder(customerPhone, dateObj).catch(err => 
    console.error("Background reminder scheduling failed", err)
  );

  return NextResponse.json({ success: true });
}