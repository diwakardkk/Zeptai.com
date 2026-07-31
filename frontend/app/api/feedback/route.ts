import { NextResponse } from "next/server";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import {
  adminServerTimestamp,
  getAdminDb,
  isMissingAdminCredentialError,
} from "@/app/api/_firestoreAdmin";
import {
  isValidEmail,
  normalizeEmail,
  normalizeMultilineText,
  normalizeText,
  sanitizeSourcePage,
} from "@/app/api/_validation";
import { sendNotificationEmails } from "@/lib/mailer";

export const runtime = "nodejs";

type FeedbackBody = {
  name?: string;
  email?: string;
  feedback?: string;
  conversationId?: string;
  sourcePage?: string;
};

function toPublicFirestoreError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Failed to store feedback. Please try again.";
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

  return "Failed to store feedback. Please try again.";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as FeedbackBody;

    const name = normalizeText(body.name);
    const email = normalizeEmail(body.email);
    const feedback = normalizeMultilineText(body.feedback);
    const conversationId = normalizeText(body.conversationId);
    const sourcePage = sanitizeSourcePage(body.sourcePage, "home_demo_report");

    if (!name || !email || !feedback) {
      return NextResponse.json(
        { error: "Name, email, and feedback are required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    if (name.length < 2 || name.length > 120) {
      return NextResponse.json(
        { error: "Name must be between 2 and 120 characters." },
        { status: 400 },
      );
    }

    if (feedback.length < 10 || feedback.length > 1000) {
      return NextResponse.json(
        { error: "Feedback must be between 10 and 1000 characters." },
        { status: 400 },
      );
    }

    try {
      const adminDb = getAdminDb();
      await adminDb.collection("leads").add({
        name,
        email,
        message: feedback,
        sourcePage,
        status: "new",
        createdAt: adminServerTimestamp(),
      });
      await adminDb.collection("demo_feedback_submissions").add({
        name,
        email,
        feedback,
        sourcePage,
        conversationId: conversationId || null,
        status: "new",
        createdAt: adminServerTimestamp(),
      });
    } catch (adminError) {
      if (!isMissingAdminCredentialError(adminError)) {
        throw adminError;
      }

      const { getClientDb: getFallbackDb } = await import("@/app/api/_firestore");
      try {
        await addDoc(collection(getFallbackDb(), "leads"), {
          name,
          email,
          message: feedback,
          sourcePage,
          status: "new",
          createdAt: Timestamp.now(),
        });
        await addDoc(collection(getFallbackDb(), "demo_feedback_submissions"), {
          name,
          email,
          feedback,
          sourcePage,
          conversationId: conversationId || null,
          status: "new",
          createdAt: Timestamp.now(),
        });
      } catch (clientError) {
        console.warn("[feedback] Client Firestore fallback write failed:", clientError);
      }
    }

    const reqId = crypto.randomUUID().slice(0, 8);
    console.log(`[feedback][${reqId}] Feedback stored — sourcePage=${sourcePage}`);

    // Dispatch admin notification email asynchronously.
    sendNotificationEmails({
      formType: "feedback",
      reqId,
      name,
      email,
      message: feedback,
      sourcePage,
      conversationId,
    }).catch((err) =>
      console.warn(`[feedback][${reqId}] Background mailer dispatch error:`, err),
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { error: toPublicFirestoreError(error) },
      { status: 500 },
    );
  }
}
