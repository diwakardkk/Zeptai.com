import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import {
  adminServerTimestamp,
  getAdminDb,
  isMissingAdminCredentialError,
} from "@/app/api/_firestoreAdmin";
import { getClientDb } from "@/app/api/_firestore";
import { getClientIp, isRateLimited } from "@/app/api/_rateLimit";
import { ContactInquiryType, ContactSubmissionInput } from "@/types/contact";
import {
  isValidEmail,
  isValidMobile,
  normalizeEmail,
  normalizeMultilineText,
  normalizeText,
  sanitizeSourcePage,
} from "@/app/api/_validation";

export const runtime = "nodejs";

// Maximum allowed request body size in bytes (~10 KB is generous for a contact form).
const MAX_BODY_BYTES = 10_240;

// The honeypot field is hidden from real users via CSS.
// Bots that blindly fill all fields will populate it, allowing silent rejection.
const HONEYPOT_FIELD = "companyWebsite";

type ContactBody = Partial<ContactSubmissionInput> & {
  // Honeypot — must be absent or empty in legitimate submissions.
  [HONEYPOT_FIELD]?: string;
};
const ALLOWED_INQUIRY_TYPES = new Set<ContactInquiryType>(["contact", "demo_request"]);

function toPublicFirestoreError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Failed to store contact request. Please try again.";
  }

  if (error.message.includes("Firebase Admin credentials missing")) {
    return "Server database configuration is incomplete. Please contact support.";
  }

  if (error.message.includes("Invalid FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON")) {
    return "Server database configuration is invalid. Please contact support.";
  }

  if (error.message.includes("Firebase client config missing")) {
    return "Server configuration is incomplete. Please contact support.";
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
  // Assign a short request ID for server-side log correlation.
  // Do NOT include this in public API responses.
  const reqId = crypto.randomUUID().slice(0, 8);

  try {
    // --- Body size guard ---
    // Reject oversized payloads before parsing JSON to prevent abuse.
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
    }

    // --- IP-based rate limiting ---
    // NOTE: In serverless (AWS Lambda) this is per-instance only.
    // For cross-instance protection, use AWS WAF rate-based rules (recommended).
    const clientIp = getClientIp(req);
    if (isRateLimited(clientIp)) {
      // Log at info level — this is an expected event, not an error.
      // Do NOT log the IP address itself to avoid storing PII in logs.
      console.warn(`[contact][${reqId}] Rate limit exceeded`);
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429 },
      );
    }

    const body = (await req.json()) as ContactBody;

    // --- Honeypot check ---
    // If the hidden field is populated, silently reject as likely bot traffic.
    // Return 200 to avoid tipping off automated scanners.
    if (body[HONEYPOT_FIELD]) {
      console.warn(`[contact][${reqId}] Honeypot triggered — silent reject`);
      return NextResponse.json({ ok: true });
    }

    const name = normalizeText(body.name);
    const email = normalizeEmail(body.email);
    const mobile = normalizeText(body.mobile);
    const message = normalizeMultilineText(body.message);
    const inquiryTypeNormalized = normalizeText(body.inquiryType).toLowerCase();
    const inquiryType: ContactInquiryType = ALLOWED_INQUIRY_TYPES.has(
      inquiryTypeNormalized as ContactInquiryType,
    )
      ? (inquiryTypeNormalized as ContactInquiryType)
      : "contact";
    const sourcePage = sanitizeSourcePage(
      body.sourcePage,
      inquiryType === "demo_request" ? "home_demo_request" : "home_contact",
    );

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
        inquiryType,
        status: "new",
        createdAt: adminServerTimestamp(),
      });
    } catch (adminError) {
      if (!isMissingAdminCredentialError(adminError)) {
        throw adminError;
      }

      await addDoc(collection(getClientDb(), "contact_submissions"), {
        name,
        email,
        mobile,
        message,
        sourcePage,
        inquiryType,
        status: "new",
        // Concrete timestamp for fallback writes so Firestore rules accept `createdAt is timestamp`.
        createdAt: Timestamp.now(),
      });
    }

    // Log a high-level success event.
    // Do NOT log name, email, mobile, or message body — these are patient/user PII.
    console.log(`[contact][${reqId}] Submission stored — inquiryType=${inquiryType} sourcePage=${sourcePage}`);

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

    let emailFailed = false;

    try {
      if (!smtpUser || !smtpPass || !receiverEmail || hasPlaceholderValues) {
        throw new Error("SMTP credentials not configured");
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

      console.log(`[contact][${reqId}] Email notifications sent`);
    } catch (emailError) {
      // Log full error server-side for diagnostics.
      // Do NOT forward error.message to the client — it may contain env var names or SMTP details.
      console.error(`[contact][${reqId}] Email notification failed:`, emailError);
      emailFailed = true;
    }

    return NextResponse.json({
      ok: true,
      // Use a generic warning — never expose internal error details to the client.
      ...(emailFailed
        ? { warning: "Your message has been recorded. Email confirmation may be delayed." }
        : {}),
    });
  } catch (error) {
    // Log full error server-side. Do NOT include stack trace or env details in the response.
    console.error(`[contact][${reqId}] Unhandled error:`, error);
    return NextResponse.json(
      { error: toPublicFirestoreError(error) },
      { status: 500 },
    );
  }
}

