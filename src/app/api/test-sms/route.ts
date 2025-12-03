import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to } = body;

    // CHANGED: No date math, no scheduling. Just send now.
    console.log('Sending IMMEDIATE test message to:', to);

    const message = await client.messages.create({
      body: '🚀 This is an IMMEDIATE test from Tidy House! No waiting required.',
      messagingServiceSid: messagingServiceSid,
      to: to,
      // REMOVED: scheduleType and sendAt
    });

    return NextResponse.json({
      success: true,
      messageSid: message.sid,
      status: message.status,
    });

  } catch (error: any) {
    console.error('Twilio Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}