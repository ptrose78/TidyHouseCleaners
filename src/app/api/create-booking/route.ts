import { NextResponse } from 'next/server';
// UPDATED: Importing from 'sms' as requested
import { scheduleAppointmentReminder } from '@/lib/sms'; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerPhone, appointmentDate } = body;

    // 1. Convert to Date Object
    const dateObj = new Date(appointmentDate);
    
    // 2. Schedule Twilio Reminder
    // Capturing the SID so you can save it to your DB
    const messageSid = await scheduleAppointmentReminder(customerPhone, dateObj);

    // 3. Save Booking to Database
    // Example:
    /* const booking = await db.booking.create({
      data: {
        // ... other fields ...
        phone: customerPhone,
        date: dateObj,
        reminderMessageSid: messageSid || null 
      }
    });
    */

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Booking Error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}