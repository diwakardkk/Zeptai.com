import { NextResponse } from "next/server";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import {
  adminServerTimestamp,
  getAdminDb,
  isMissingAdminCredentialError,
} from "@/app/api/_firestoreAdmin";
import { db } from "@/app/api/_firestore";
import { LeadInput } from "@/types/lead";
import {
  isValidEmail,
  isValidMobile,
  normalizeEmail,
  normalizeText,
  sanitizeSourcePage,
} from "@/app/api/_validation";

export const runtime = "nodejs";

function toPublicFirestoreError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Failed to store lead.";
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

  return "Failed to store lead.";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<LeadInput>;
    const name = normalizeText(body.name);
    const email = normalizeEmail(body.email);
    const mobile = normalizeText(body.mobile);
    const sourcePage = sanitizeSourcePage(body.sourcePage, "/blog");

    if (!name || !email || !mobile || !sourcePage) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }
    if (!isValidMobile(mobile)) {
      return NextResponse.json({ error: "Invalid mobile number format." }, { status: 400 });
    }
    if (name.length < 2 || name.length > 120) {
      return NextResponse.json({ error: "Name must be between 2 and 120 characters." }, { status: 400 });
    }

    try {
      const adminDb = getAdminDb();
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

      await addDoc(collection(db, "blog_leads"), {
        name,
        email,
        mobile,
        sourcePage,
        createdAt: Timestamp.now(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: toPublicFirestoreError(error) }, { status: 500 });
  }
}
