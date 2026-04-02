import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
};

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clean(input: string) {
  return input.replace(/\s+/g, " ").trim();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactBody;

    const name = clean(body.name ?? "");
    const email = clean((body.email ?? "").toLowerCase());
    const message = (body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters." },
        { status: 400 },
      );
    }

    const smtpHost = process.env.SMTP_HOST ?? "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT ?? "465");
    const smtpSecure = (process.env.SMTP_SECURE ?? "true").toLowerCase() === "true";
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL ?? smtpUser;
    const autoReplyFromName = process.env.CONTACT_AUTOREPLY_FROM_NAME ?? "ZeptAI Team";

    const hasPlaceholderValues =
      smtpUser?.includes("your_gmail") ||
      smtpPass?.includes("your_gmail_app_password") ||
      receiverEmail?.includes("your_gmail");

    if (!smtpUser || !smtpPass || !receiverEmail || hasPlaceholderValues) {
      return NextResponse.json(
        {
          error:
            "Email service is not configured. Set SMTP_USER, SMTP_PASS, and CONTACT_RECEIVER_EMAIL in .env.local.",
        },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br/>");

    await transporter.sendMail({
      from: `"ZeptAI Contact" <${smtpUser}>`,
      to: receiverEmail,
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong><br/>${safeMessage}</p>
      `,
    });

    await transporter.sendMail({
      from: `"${autoReplyFromName}" <${smtpUser}>`,
      to: email,
      replyTo: receiverEmail,
      subject: "We received your message - ZeptAI",
      text: `Hi ${name},\n\nThanks for contacting ZeptAI. We received your message and will get back to you soon.\n\nYour message:\n${message}\n\nRegards,\nZeptAI Team`,
      html: `
        <p>Hi ${safeName},</p>
        <p>Thanks for contacting <strong>ZeptAI</strong>. We received your message and will get back to you soon.</p>
        <p><strong>Your message:</strong><br/>${safeMessage}</p>
        <p>Regards,<br/>ZeptAI Team</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 },
    );
  }
}

