import twilio from 'twilio';

// 1. Initialize Client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

export const client = twilio(accountSid, authToken);

// 2. Schedule Function (Existing)
export async function scheduleAppointmentReminder(
  userPhone: string, 
  appointmentDate: Date
) {
  try {
    const reminderTime = new Date(appointmentDate.getTime() - (24 * 60 * 60 * 1000));
    const now = new Date();
    const minLeadTime = 15 * 60 * 1000; 

    if (reminderTime.getTime() < (now.getTime() + minLeadTime)) {
      console.log('Skipping SMS reminder: Too close to appointment time.');
      return null;
    }

    const message = await client.messages.create({
      body: `Hi! This is a reminder from Tidy House Cleaners. Your cleaning is scheduled for tomorrow at ${appointmentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}.`,
      messagingServiceSid: messagingServiceSid,
      to: userPhone,
      scheduleType: 'fixed',
      sendAt: reminderTime, 
    });

    // IMPORTANT: You must save this SID to your database to cancel it later!
    return message.sid;

  } catch (error) {
    console.error('Twilio Scheduling Error:', error);
    return null; 
  }
}

// 3. NEW: Cancel Function
export async function cancelScheduledReminder(messageSid: string) {
  if (!messageSid) return;

  try {
    console.log(`Attempting to cancel SMS: ${messageSid}`);
    
    // We update the status to 'canceled'
    const message = await client.messages(messageSid).update({ 
      status: 'canceled' 
    });

    console.log(`SMS Canceled successfully. Status: ${message.status}`);
    return true;

  } catch (error: any) {
    // If the message was already sent, Twilio will throw an error.
    // We catch it so the app doesn't crash.
    console.error(`Failed to cancel SMS (${messageSid}):`, error.message);
    return false;
  }
}