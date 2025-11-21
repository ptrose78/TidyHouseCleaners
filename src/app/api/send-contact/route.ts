import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { name, email, phone, message, turnstileToken } = await req.json();

    //
    // 1. VERIFY CLOUDFLARE TURNSTILE
    //
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY!,
          response: turnstileToken,
        }),
      }
    );

    const verifyJSON = await verifyRes.json();

    if (!verifyJSON.success) {
      return NextResponse.json(
        { error: "Captcha verification failed" },
        { status: 400 }
      );
    }

    //
    // 2. EMAIL: SEND TO BUSINESS OWNER
    //
    await resend.emails.send({
      from: `Tidy House Cleaners <${process.env.BUSINESS_EMAIL!}>`,
      to: [process.env.BUSINESS_EMAIL!],
      subject: "New Contact Form Message — Tidy House Cleaners",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; border: 1px solid #e5e7eb; padding: 25px; border-radius: 12px;">
        
        <h2 style="color: #16a34a; margin-bottom: 10px;">📩 New Client Message</h2>
        <p style="font-size: 15px; color: #444;">A new message was submitted through your contact form.</p>

        <div style="margin-top: 20px; padding: 18px; background: #f9fafb; border-left: 4px solid #16a34a;">
          <p style="margin: 6px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 6px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 6px 0;"><strong>Phone:</strong> ${
            phone || "Not provided"
          }</p>
          <p style="margin: 6px 0;"><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; margin-top: 8px;">${message}</p>
        </div>

        <hr style="margin: 30px 0; border-top: 1px solid #e5e7eb;" />

        <p style="font-size: 13px; color: #666;">This message was sent from your Tidy House Cleaners website.</p>
      </div>
      `,
    });

    //
    // 3. EMAIL: SEND CONFIRMATION TO CUSTOMER
    //
    await resend.emails.send({
      from: `Tidy House Cleaners <${process.env.BUSINESS_EMAIL!}>`,
      to: [email],
      subject: "We Received Your Message — Tidy House Cleaners",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; border: 1px solid #e5e7eb; padding: 25px; border-radius: 12px;">
        
        <h2 style="color: #16a34a; margin-bottom: 10px;">Thank you for contacting us, ${name}!</h2>

        <p style="font-size: 15px; color: #444; line-height: 1.6;">
          We’ve received your message and will get back to you within **24 hours**.
        </p>

        <div style="margin-top: 20px; padding: 18px; background: #f0fdf4; border-left: 4px solid #16a34a;">
          <p style="margin: 6px 0;"><strong>Your Message:</strong></p>
          <p style="white-space: pre-wrap; margin-top: 8px; color: #333;">${message}</p>
        </div>

        <hr style="margin: 30px 0; border-top: 1px solid #e5e7eb;" />

        <div style="font-size: 14px; color: #555;">
          <strong>Tidy House Cleaners</strong><br/>
          Email: ${process.env.BUSINESS_EMAIL}<br/>
          Phone: ${process.env.BUSINESS_PHONE}<br/>
          Serving: Oak Creek, Milwaukee, Franklin, and surrounding areas
        </div>

        <p style="font-size: 12px; color: #888; margin-top: 20px; text-align: center;">
          This is an automated confirmation email.
        </p>
      </div>
      `,
    });

    //
    // 4. RETURN SUCCESS
    //
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Contact form error:", error);
    return NextResponse.json(
      { error: "Server error, please try again" },
      { status: 500 }
    );
  }
}
