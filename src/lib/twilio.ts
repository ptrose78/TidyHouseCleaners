import twilio from 'twilio';

// Initialize the Twilio Client using environment variables
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * 1. SCHEDULE A REMINDER
 * Call this when a booking is created.
 * @param phoneNumber - Customer's phone (e.g., +14145550100)
 * @param appointmentDate - Javascript Date object of the appointment
 * @returns string - The Message SID (Save this to your DB!)
 */
export async function scheduleReminder(phoneNumber: string, appointmentDate: Date) {
  try {
    // Calculate time: 24 hours before appointment
    const sendAt = new Date(appointmentDate.getTime());
    sendAt.setHours(sendAt.getHours() - 24);

    // Guard: Twilio requires scheduled time to be at least 15 mins in future
    const minTime = new Date(Date.now() + 15 * 60 * 1000); 
    if (sendAt < minTime) {
      console.log("Appointment too soon for 24h reminder. Sending immediately or skipping.");
      return null;
    }

    const message = await client.messages.create({
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
      body: `Hi! This is a reminder that Tidy House Cleaners will be arriving tomorrow at ${appointmentDate.toLocaleTimeString()}.`,
      to: phoneNumber,
      scheduleType: 'fixed',
      sendAt: new Date('2025-11-29T15:00:00.000Z'),
    });

    return message.sid; // IMPORTANT: Return this so you can save it to your DB
  } catch (error) {
    console.error('Twilio Schedule Error:', error);
    throw error;
  }
}

/**
 * 2. CANCEL A REMINDER
 * Call this when a booking is cancelled.
 * @param messageSid - The 'SM...' ID you saved in your DB during booking
 */
export async function cancelReminder(messageSid: string) {
  if (!messageSid) return;

  try {
    // We must fetch the message first to check its status
    const message = await client.messages(messageSid).fetch();

    // We can only cancel if it is still 'scheduled' or 'queued'
    if (message.status === 'scheduled' || message.status === 'queued') {
      await client.messages(messageSid).update({ status: 'canceled' });
      console.log(`Twilio message ${messageSid} canceled.`);
    } else {
      console.log(`Could not cancel message. Status was: ${message.status}`);
    }
  } catch (error) {
    console.error(`Error canceling Twilio message ${messageSid}:`, error);
    // We don't throw here because we don't want to stop the booking cancellation 
    // just because the text failed to cancel.
  }
}