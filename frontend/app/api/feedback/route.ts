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
    return "Database admin credentials are missing. Set FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON in Netlify.";
  }

  if (error.message.includes("Invalid FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON")) {
    return "Firebase Admin JSON is invalid. Fix FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON in Netlify.";
  }

  if (error.message.includes("Firebase client config missing")) {
    return "Firebase environment variables are missing in Netlify.";
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

      const { db } = await import("@/app/api/_firestore");
      await addDoc(collection(db, "demo_feedback_submissions"), {
        name,
        email,
        feedback,
        sourcePage,
        conversationId: conversationId || null,
        status: "new",
        // Concrete timestamp for fallback writes so Firestore rules accept `createdAt is timestamp`.
        createdAt: Timestamp.now(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { error: toPublicFirestoreError(error) },
      { status: 500 },
    );
  }
}
