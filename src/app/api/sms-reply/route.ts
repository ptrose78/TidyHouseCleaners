import { NextResponse } from 'next/server';
import twilio from 'twilio';

// 1. Initialize the Twilio Client (REQUIRED for this method)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
  try {
    // 2. Parse the incoming data
    const formData = await request.formData();
    const incomingMsg = formData.get('Body') as string;
    const senderNumber = formData.get('From') as string;
    // We need "To" (your Twilio number) so we know who to send "from"
    const myTwilioNumber = formData.get('To') as string; 

    console.log(`Received message from ${senderNumber}: ${incomingMsg}`);

    // 3. Logic & Sending the Message DIRECTLY
    const cleanMsg = incomingMsg?.trim().toLowerCase();
    let replyBody = '';

    if (cleanMsg === 'schedule') {
      replyBody = '📅 Here is the link to schedule your cleaning: https://tidyhouse.com/book';
    } else if (cleanMsg === 'help') {
      replyBody = '🧹 Support Team here! Call us at 555-0199 for urgent issues.';
    } else {
      replyBody = 'Thanks for messaging Tidy House! We received your note.';
    }

    // ▼▼▼ THIS IS THE FIX ▼▼▼
    // Instead of returning XML and hoping Twilio reads it,
    // we explicitly force the message to send right now.
    await client.messages.create({
      body: replyBody,
      from: myTwilioNumber,
      to: senderNumber
    });
    console.log("Reply sent successfully via API");
    // ▲▲▲ END FIX ▲▲▲


    // 4. Return an empty 200 OK to Twilio
    // This tells Twilio "We handled it, don't do anything else."
    return new NextResponse('<Response></Response>', {
      headers: { 'Content-Type': 'text/xml' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error handling reply:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}