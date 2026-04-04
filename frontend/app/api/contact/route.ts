import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  adminServerTimestamp,
  getAdminDb,
  isMissingAdminCredentialError,
} from "@/app/api/_firestoreAdmin";
import { db } from "@/app/api/_firestore";
import { ContactSubmissionInput } from "@/types/contact";
import {
  isValidEmail,
  isValidMobile,
  normalizeEmail,
  normalizeMultilineText,
  normalizeText,
  sanitizeSourcePage,
} from "@/app/api/_validation";

export const runtime = "nodejs";

type ContactBody = Partial<ContactSubmissionInput>;

function toPublicFirestoreError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Failed to store contact request. Please try again.";
  }

  if (error.message.includes("Firebase Admin credentials missing")) {
    return "Database admin credentials are missing. Set FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON in Netlify.";
  }

  if (error.message.includes("Firebase client config missing")) {
    return "Firebase environment variables are missing in Netlify.";
  }

  return "Failed to store contact request. Please try again.";
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactBody;

    const name = normalizeText(body.name);
    const email = normalizeEmail(body.email);
    const mobile = normalizeText(body.mobile);
    const message = normalizeMultilineText(body.message);
    const sourcePage = sanitizeSourcePage(body.sourcePage, "home_contact");

    if (!name || !email || !mobile || !message) {
      return NextResponse.json(
        { error: "Name, email, mobile, and message are required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    if (!isValidMobile(mobile)) {
      return NextResponse.json(
        { error: "Enter a valid mobile number (7-20 chars)." },
        { status: 400 },
      );
    }

    if (name.length < 2 || name.length > 120) {
      return NextResponse.json(
        { error: "Name must be between 2 and 120 characters." },
        { status: 400 },
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters." },
        { status: 400 },
      );
    }

    if (message.length > 4000) {
      return NextResponse.json(
        { error: "Message is too long. Please keep it under 4000 characters." },
        { status: 400 },
      );
    }

    try {
      const adminDb = getAdminDb();
      await adminDb.collection("contact_submissions").add({
        name,
        email,
        mobile,
        message,
        sourcePage,
        inquiryType: "contact",
        status: "new",
        createdAt: adminServerTimestamp(),
      });
    } catch (adminError) {
      if (!isMissingAdminCredentialError(adminError)) {
        throw adminError;
      }

      await addDoc(collection(db, "contact_submissions"), {
        name,
        email,
        mobile,
        message,
        sourcePage,
        inquiryType: "contact",
        status: "new",
        createdAt: serverTimestamp(),
      });
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
      text: `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}\n\nMessage:\n${message}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Mobile:</strong> ${escapeHtml(mobile)}</p>
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
      { error: toPublicFirestoreError(error) },
      { status: 500 },
    );
  }
}
