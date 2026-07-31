import { NextResponse } from "next/server";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import {
  adminServerTimestamp,
  getAdminDb,
  isMissingAdminCredentialError,
} from "@/app/api/_firestoreAdmin";
import { getClientDb } from "@/app/api/_firestore";
import { LeadInput } from "@/types/lead";
import {
  isValidEmail,
  isValidMobile,
  normalizeEmail,
  normalizeText,
  sanitizeSourcePage,
} from "@/app/api/_validation";
import { sendNotificationEmails } from "@/lib/mailer";

export const runtime = "nodejs";

function toPublicFirestoreError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Failed to store lead.";
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

  return "Failed to store lead.";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<LeadInput>;
    const email = normalizeEmail(body.email);
    const name = normalizeText(body.name) || (email ? email.split("@")[0] : "Guest");
    const mobile = normalizeText(body.mobile) || "N/A";
    const sourcePage = sanitizeSourcePage(body.sourcePage, "/blog");

    if (!email || !sourcePage) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }
    if (mobile !== "N/A" && !isValidMobile(mobile)) {
      return NextResponse.json({ error: "Invalid mobile number format." }, { status: 400 });
    }
    if (name.length < 2 || name.length > 120) {
      return NextResponse.json({ error: "Name must be between 2 and 120 characters." }, { status: 400 });
    }

    try {
      const adminDb = getAdminDb();
      await adminDb.collection("leads").add({
        name,
        email,
        mobile,
        sourcePage,
        status: "new",
        createdAt: adminServerTimestamp(),
      });
      await adminDb.collection("blog_leads").add({
        name,
        email,
        mobile,
        sourcePage,
        createdAt: adminServerTimestamp(),
      });
    } catch (adminError) {
      if (!isMissingAdminCredentialError(adminError)) {
        throw adminError;
      }

      try {
        await addDoc(collection(getClientDb(), "leads"), {
          name,
          email,
          mobile,
          sourcePage,
          status: "new",
          createdAt: Timestamp.now(),
        });
        await addDoc(collection(getClientDb(), "blog_leads"), {
          name,
          email,
          mobile,
          sourcePage,
          createdAt: Timestamp.now(),
        });
      } catch (clientError) {
        console.warn("[leads] Client Firestore fallback write failed:", clientError);
      }
    }

    const reqId = crypto.randomUUID().slice(0, 8);
    console.log(`[lead][${reqId}] Lead stored — sourcePage=${sourcePage}`);

    // Dispatch admin notification email asynchronously.
    sendNotificationEmails({
      formType: "lead",
      reqId,
      name,
      email,
      mobile,
      sourcePage,
    }).catch((err) =>
      console.warn(`[lead][${reqId}] Background mailer dispatch error:`, err),
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: toPublicFirestoreError(error) }, { status: 500 });
  }
}
