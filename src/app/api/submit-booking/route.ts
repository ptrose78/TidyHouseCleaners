import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
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

    // Format date nicely for email
    const formattedDate = preferredDate
      ? new Date(preferredDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Not specified";

    // Convert frequency for nicer display
    const frequencyReadable =
      cleaningNeeds === "one-time"
        ? "One-Time"
        : cleaningNeeds === "weekly"
        ? "Weekly"
        : cleaningNeeds === "bi-weekly"
        ? "Bi-Weekly"
        : "Monthly";

    // BUSINESS INTERNAL EMAIL
    await resend.emails.send({
      from: `Tidy House Cleaners <${process.env.BUSINESS_EMAIL!}>`,
      to: [process.env.BUSINESS_EMAIL!],
      subject: "New Booking Request Received!",
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Bedrooms:</strong> ${bedrooms}</p>
        <p><strong>Bathrooms:</strong> ${bathrooms}</p>
        <p><strong>Cleaning Type:</strong> ${cleaningType}</p>
        <p><strong>Frequency:</strong> ${frequencyReadable}</p>
        <p><strong>Preferred Date:</strong> ${formattedDate}</p>
        <p><strong>Time Slot:</strong> ${
          timeSlot ? timeSlot[0].toUpperCase() + timeSlot.slice(1) : "Not specified"
        }</p>
        <p><strong>Estimated Price:</strong> $${estimatedPrice}</p>
      `,
    });

    // CUSTOMER CONFIRMATION EMAIL (BRANDED)
    await resend.emails.send({
      from: `Tidy House Cleaners <${process.env.BUSINESS_EMAIL!}>`,
      to: [email],
      bcc: [process.env.BUSINESS_EMAIL!], // You also get a copy
      replyTo: process.env.BUSINESS_EMAIL!,
      subject: "Your Cleaning Quote Request – Tidy House Cleaners",
     html: `
      <div style="
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        color: #333333;
      ">

        <style>
          /* DARK MODE SUPPORT */
          @media (prefers-color-scheme: dark) {
            body, .email-container {
              background-color: #1a1a1a !important;
              color: #e5e7eb !important;
            }

            h1, h2, h3, strong {
              color: #ffffff !important;
            }

            .section-box {
              background-color: #111827 !important;
              border-left-color: #34d399 !important;
            }

            .price-box {
              background-color: #34d399 !important;
              color: #000000 !important;
            }

            .warning-box {
              background-color: #78350f !important;
              border-color: #fbbf24 !important;
              color: #fde68a !important;
            }

            .divider {
              border-color: #374151 !important;
            }
          }
        </style>

        <div class="email-container">

          <h1 style="
            color: #333;
            border-bottom: 3px solid #2E8B57;
            padding-bottom: 10px;
          ">
            Thank You for Your Request!
          </h1>

          <p style="font-size: 16px; line-height: 1.6;">
            Hi ${name},
          </p>

          <p style="font-size: 16px; line-height: 1.6;">
            Thank you for requesting a quote from <strong>Tidy House Cleaners</strong>!
            We've received your booking request and will contact you within 24 hours to confirm
            your appointment and finalize your quote.
          </p>

          <div class="section-box" style="
            background-color: #f8fafc;
            border-left: 4px solid #2E8B57;
            padding: 20px;
            margin: 20px 0;
            border-radius: 6px;
          ">

            <h2 style="margin-top: 0;">Your Booking Details</h2>

            <h3 style="color: #2E8B57; font-size: 18px; margin-bottom: 10px;">Property Information</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Bedrooms:</strong> ${bedrooms}</li>
              <li><strong>Bathrooms:</strong> ${bathrooms}</li>
              <li><strong>Address:</strong> ${address}</li>
            </ul>

            <h3 style="color: #2E8B57; font-size: 18px; margin-bottom: 10px; margin-top: 20px;">Service Details</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Cleaning Type:</strong> ${
                cleaningType === "standard" ? "Standard Cleaning" : "Deep Cleaning"
              }</li>
              <li><strong>Frequency:</strong> ${frequencyReadable}</li>
              ${
                isNewCustomer
                  ? `<li style="color: #16a34a;"><strong>✓ New Customer Discount Applied!</strong></li>`
                  : ""
              }
            </ul>

            <h3 style="color: #2E8B57; font-size: 18px; margin-bottom: 10px; margin-top: 20px;">Preferred Schedule</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Date:</strong> ${formattedDate}</li>
              <li><strong>Time:</strong> ${
                timeSlot ? timeSlot[0].toUpperCase() + timeSlot.slice(1) : "Not specified"
              }</li>
            </ul>

            <div class="price-box" style="
              background-color: #2E8B57;
              color: white;
              padding: 15px;
              border-radius: 8px;
              margin-top: 20px;
              text-align: center;
            ">
              <p style="margin: 0; font-size: 14px;">Estimated Price</p>
              <p style="margin: 5px 0 0 0; font-size: 32px; font-weight: bold;">
                $${estimatedPrice}
              </p>
              <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.9;">
                Final quote will be confirmed after reviewing your home details.
              </p>
            </div>

          </div>

          <div class="warning-box" style="
            background-color: #fef3c7;
            border: 1px solid #fbbf24;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          ">
            <p style="margin: 0; font-size: 14px;">
              <strong>Next Steps:</strong><br>
              • We'll call you at <strong>${phone}</strong> within 24 hours<br>
              • We'll confirm your preferred date and time<br>
              • We'll answer any questions you may have<br>
              • Payment is collected after the cleaning is complete
            </p>
          </div>

          <p style="font-size: 16px; line-height: 1.6;">
            If you have any questions, feel free to contact us anytime.
          </p>

          <div class="divider" style="
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          ">
            <p style="font-size: 14px; color: #6b7280; margin: 5px 0;">
              <strong>Tidy House Cleaners</strong><br>
              Phone: ${process.env.BUSINESS_PHONE}<br>
              Email: ${process.env.BUSINESS_EMAIL}
            </p>
          </div>

          <p style="font-size: 12px; color: #9ca3af; margin-top: 20px; text-align: center;">
            This is an automated confirmation email. We look forward to serving you!
          </p>

        </div>
      </div>
    `,
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Error sending emails:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
