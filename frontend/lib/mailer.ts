import nodemailer from "nodemailer";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FormType = "contact" | "lead" | "feedback" | "comment";

export type NotificationPayload = {
  formType: FormType;
  reqId: string;
  name: string;
  email: string;
  mobile?: string;
  message?: string;
  sourcePage?: string;
  inquiryType?: string;
  /** Blog comment — post slug */
  postSlug?: string;
  /** Feedback — conversation ID */
  conversationId?: string;
};

// ---------------------------------------------------------------------------
// SMTP Config (read once, cached in module scope)
// ---------------------------------------------------------------------------

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string | undefined;
  pass: string | undefined;
  fromEmail: string | undefined;
  receiverEmail: string | undefined;
  fromName: string;
};

let _configCache: SmtpConfig | null = null;

function getSmtpConfig(): SmtpConfig {
  if (_configCache) return _configCache;

  const region = process.env.AWS_SES_REGION ?? process.env.AWS_REGION ?? "us-east-1";

  const host =
    process.env.AWS_SES_SMTP_HOST ??
    process.env.SMTP_HOST ??
    `email-smtp.${region}.amazonaws.com`;

  const port = Number(process.env.AWS_SES_SMTP_PORT ?? process.env.SMTP_PORT ?? "587");

  const secure =
    (process.env.AWS_SES_SMTP_SECURE ?? process.env.SMTP_SECURE ?? "false").toLowerCase() ===
    "true";

  const user = (process.env.AWS_SES_SMTP_USER ?? process.env.SMTP_USER)?.trim();
  const pass = (process.env.AWS_SES_SMTP_PASS ?? process.env.SMTP_PASS)
    ?.trim()
    .replace(/\s+/g, "");

  const fromEmail = (
    process.env.AWS_SES_FROM_EMAIL ?? process.env.SMTP_FROM_EMAIL ?? user
  )?.trim();

  const receiverEmail = (
    process.env.CONTACT_RECEIVER_EMAIL ?? fromEmail ?? user
  )?.trim();

  const fromName = process.env.CONTACT_AUTOREPLY_FROM_NAME ?? "ZeptAI Team";

  _configCache = { host, port, secure, user, pass, fromEmail, receiverEmail, fromName };
  return _configCache;
}

// ---------------------------------------------------------------------------
// Singleton Transporter (reuses the SMTP connection pool)
// ---------------------------------------------------------------------------

let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (_transporter) return _transporter;

  const cfg = getSmtpConfig();
  if (!cfg.user || !cfg.pass) {
    throw new Error("AWS SES / SMTP credentials missing in environment variables.");
  }

  _transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
    family: 4, // Force IPv4 to prevent EHOSTUNREACH on IPv6
    pool: true, // Reuse connections
    maxConnections: 3,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  } as nodemailer.TransportOptions);

  return _transporter;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safe(val: string | undefined, fallback = "N/A"): string {
  return val ? escapeHtml(val) : fallback;
}

function nl2br(text: string): string {
  return escapeHtml(text).replace(/\r?\n/g, "<br/>");
}

function isConfigured(): boolean {
  const cfg = getSmtpConfig();
  if (!cfg.user || !cfg.pass || !cfg.receiverEmail) return false;
  if (cfg.user.includes("YOUR_") || cfg.pass.includes("YOUR_")) return false;
  if (cfg.user.includes("your_") || cfg.pass.includes("your_")) return false;
  return true;
}

function logSendError(tag: string, reqId: string, label: string, error: unknown): void {
  const err = error as { code?: string; responseCode?: number; message?: string };
  if (err?.code === "EAUTH" || err?.responseCode === 535) {
    console.warn(
      `[${tag}][${reqId}] ${label} skipped: SES SMTP auth failed (535). Verify credentials in .env.local.`,
    );
  } else {
    console.warn(
      `[${tag}][${reqId}] ${label} failed:`,
      err instanceof Error ? err.message : err,
    );
  }
}

// ---------------------------------------------------------------------------
// Email Template Builders
// ---------------------------------------------------------------------------

type EmailContent = { subject: string; text: string; html: string };

function buildAdminEmail(p: NotificationPayload): EmailContent {
  const safeName = safe(p.name);
  const safeEmail = safe(p.email);
  const safeMobile = safe(p.mobile);
  const safeMsg = p.message ? nl2br(p.message) : "";

  switch (p.formType) {
    case "contact": {
      const src = p.sourcePage ?? "home_contact";
      return {
        subject: `New Contact Message from ${p.name}`,
        text: `Name: ${p.name}\nEmail: ${p.email}\nMobile: ${p.mobile ?? "N/A"}\nInquiry Type: ${p.inquiryType ?? "contact"}\nSource Page: ${src}\n\nMessage:\n${p.message ?? ""}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Mobile:</strong> ${safeMobile}</p>
          <p><strong>Inquiry Type:</strong> ${safe(p.inquiryType)}</p>
          <p><strong>Source Page:</strong> ${safe(p.sourcePage)}</p>
          <p><strong>Message:</strong><br/>${safeMsg}</p>
        `,
      };
    }
    case "lead": {
      const src = p.sourcePage ?? "unknown";
      return {
        subject: `New Lead Captured: ${p.name} (${src})`,
        text: `Name: ${p.name}\nEmail: ${p.email}\nMobile: ${p.mobile ?? "N/A"}\nSource Page: ${src}`,
        html: `
          <h2>New Lead Captured</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Mobile:</strong> ${safeMobile}</p>
          <p><strong>Source Page:</strong> ${safe(src)}</p>
        `,
      };
    }
    case "feedback": {
      const src = p.sourcePage ?? "home_demo_report";
      return {
        subject: `New Feedback from ${p.name}`,
        text: `Name: ${p.name}\nEmail: ${p.email}\nSource: ${src}\nConversation ID: ${p.conversationId ?? "N/A"}\n\nFeedback:\n${p.message ?? ""}`,
        html: `
          <h2>New Demo Feedback</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Source Page:</strong> ${safe(src)}</p>
          <p><strong>Conversation ID:</strong> ${safe(p.conversationId)}</p>
          <p><strong>Feedback:</strong><br/>${safeMsg}</p>
        `,
      };
    }
    case "comment": {
      const slug = p.postSlug ?? "unknown";
      return {
        subject: `New Blog Comment from ${p.name} on /${slug}`,
        text: `Name: ${p.name}\nEmail: ${p.email}\nMobile: ${p.mobile ?? "N/A"}\nBlog Post: /blog/${slug}\n\nComment:\n${p.message ?? ""}`,
        html: `
          <h2>New Blog Comment (Pending Moderation)</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Mobile:</strong> ${safeMobile}</p>
          <p><strong>Blog Post:</strong> /blog/${escapeHtml(slug)}</p>
          <p><strong>Comment:</strong><br/>${safeMsg}</p>
        `,
      };
    }
  }
}

function buildAutoReply(p: NotificationPayload): EmailContent | null {
  // Only contact form submissions get an auto-reply to the user.
  if (p.formType !== "contact") return null;

  const safeName = safe(p.name);
  const safeMsg = p.message ? nl2br(p.message) : "";

  return {
    subject: "We received your message - ZeptAI",
    text: `Hi ${p.name},\n\nThanks for contacting ZeptAI. We received your message and will get back to you soon.\n\nYour message:\n${p.message ?? ""}\n\nRegards,\nZeptAI Team`,
    html: `
      <p>Hi ${safeName},</p>
      <p>Thanks for contacting <strong>ZeptAI</strong>. We received your message and will get back to you soon.</p>
      <p><strong>Your message:</strong><br/>${safeMsg}</p>
      <p>Regards,<br/>ZeptAI Team</p>
    `,
  };
}

// ---------------------------------------------------------------------------
// Public API — Single Entry Point for All Forms
// ---------------------------------------------------------------------------

/**
 * Unified mailer service. Sends admin notification (all forms) and optional
 * user auto-reply (contact form only) via AWS SES SMTP.
 *
 * Call `.catch()` on the returned promise to make it fire-and-forget.
 */
export async function sendNotificationEmails(
  payload: NotificationPayload,
): Promise<void> {
  const tag = payload.formType;
  const { reqId } = payload;

  if (!isConfigured()) {
    console.log(
      `[${tag}][${reqId}] Email notifications skipped (SES credentials missing or unconfigured).`,
    );
    return;
  }

  const cfg = getSmtpConfig();
  const fromHeader = `"${cfg.fromName}" <${cfg.fromEmail}>`;

  try {
    const transporter = getTransporter();
    const promises: Promise<unknown>[] = [];

    // 1. Admin notification (always)
    const admin = buildAdminEmail(payload);
    promises.push(
      transporter.sendMail({
        from: fromHeader,
        to: cfg.receiverEmail,
        replyTo: payload.email,
        subject: admin.subject,
        text: admin.text,
        html: admin.html,
      }),
    );

    // 2. User auto-reply (contact form only)
    const reply = buildAutoReply(payload);
    if (reply) {
      promises.push(
        transporter.sendMail({
          from: fromHeader,
          to: payload.email,
          replyTo: cfg.receiverEmail,
          subject: reply.subject,
          text: reply.text,
          html: reply.html,
        }),
      );
    }

    const results = await Promise.allSettled(promises);
    const labels = reply
      ? ["Admin notification", "User auto-reply"]
      : ["Admin notification"];

    let ok = 0;
    results.forEach((res, idx) => {
      if (res.status === "rejected") {
        logSendError(tag, reqId, labels[idx], res.reason);
      } else {
        ok++;
      }
    });

    if (ok === results.length) {
      console.log(`[${tag}][${reqId}] All emails sent successfully.`);
    }
  } catch (error) {
    console.warn(
      `[${tag}][${reqId}] Mailer service error:`,
      error instanceof Error ? error.message : error,
    );
  }
}
