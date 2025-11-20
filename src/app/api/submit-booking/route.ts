import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const body = await req.json();

  const {
    name,
    email,
    phone,
    address,
    bedrooms,
    bathrooms,
    cleaningType,
    cleaningNeeds,
    isNewCustomer,
    preferredDate,
    timeSlot,
    estimatedPrice,
  } = body;

  await resend.emails.send({
    from: `Tidy House Cleaners <${process.env.BUSINESS_EMAIL!}>`,
    to: [process.env.BUSINESS_EMAIL!],
    subject: "New Booking Request!",
    html: `
      <h2>New Cleaning Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Bedrooms:</strong> ${bedrooms}</p>
      <p><strong>Bathrooms:</strong> ${bathrooms}</p>
      <p><strong>Cleaning Type:</strong> ${cleaningType}</p>
      <p><strong>Frequency:</strong> ${cleaningNeeds}</p>
      <p><strong>Preferred Date:</strong> ${preferredDate}</p>
      <p><strong>Time Slot:</strong> ${timeSlot}</p>
      <p><strong>Estimated Price:</strong> $${estimatedPrice}</p>
    `,
  });

  await resend.emails.send({
    from: `Tidy House Cleaners <${process.env.BUSINESS_EMAIL!}>`,
    to: email,
    subject: "We Received Your Cleaning Request!",
    html: `
      <h2>Thanks, ${name}!</h2>
      <p>Your request has been received. We'll contact you within 24 hours.</p>
      <p><strong>Estimated Price:</strong> $${estimatedPrice}</p>
    `,
  });

  return NextResponse.json({ success: true });
}
