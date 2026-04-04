import { NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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
        createdAt: serverTimestamp(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to store lead." }, { status: 500 });
  }
}
