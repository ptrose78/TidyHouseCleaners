import { NextResponse } from 'next/server';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';

export async function POST(request: Request) {
  try {
    // 1. Parse the incoming form data from Twilio
    // Twilio sends data as 'application/x-www-form-urlencoded'
    const formData = await request.formData();
    const incomingMsg = formData.get('Body') as string;
    const senderNumber = formData.get('From') as string;

    console.log(`Received message from ${senderNumber}: ${incomingMsg}`);

    // 2. Decide how to respond (Logic)
    const twiml = new MessagingResponse();
    
    // Simple Keyword Logic
    const cleanMsg = incomingMsg?.trim().toLowerCase();

    if (cleanMsg === 'schedule') {
      twiml.message('📅 Here is the link to schedule your cleaning: https://tidyhouse.com/book');
    } else if (cleanMsg === 'help') {
      twiml.message('🧹 Support Team here! Call us at 555-0199 for urgent issues.');
    } else {
      // Default auto-reply
      twiml.message('Thanks for messaging Tidy House! We received your note.');
    }

    // 3. Return XML to Twilio
    // We must return "Content-Type: text/xml" so Twilio can read our instructions
    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });

  } catch (error: any) {
    console.error('Error handling reply:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}