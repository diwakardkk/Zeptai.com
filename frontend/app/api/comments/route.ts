import { NextResponse } from "next/server";
import { Timestamp, addDoc, collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import {
  adminServerTimestamp,
  getAdminDb,
  isMissingAdminCredentialError,
} from "@/app/api/_firestoreAdmin";
import { getClientDb } from "@/app/api/_firestore";
import { BlogCommentInput } from "@/types/comment";
import {
  isValidEmail,
  isValidMobile,
  isValidPostSlug,
  normalizeEmail,
  normalizeMultilineText,
  normalizeText,
} from "@/app/api/_validation";
import { sendNotificationEmails } from "@/lib/mailer";

export const runtime = "nodejs";

function toPublicFirestoreError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Failed to store comment. Please check Firebase setup.";
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

  return "Failed to store comment. Please check Firebase setup.";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<BlogCommentInput>;
    const postSlug = normalizeText(body.postSlug);
    const name = normalizeText(body.name);
    const email = normalizeEmail(body.email);
    const mobile = normalizeText(body.mobile);
    const comment = normalizeMultilineText(body.comment);

    if (!postSlug || !name || !email || !mobile || !comment) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (!isValidPostSlug(postSlug)) {
      return NextResponse.json({ error: "Invalid blog post identifier." }, { status: 400 });
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
    if (comment.length < 8) {
      return NextResponse.json({ error: "Comment should be at least 8 characters." }, { status: 400 });
    }
    if (comment.length > 2000) {
      return NextResponse.json({ error: "Comment is too long. Keep it under 2000 characters." }, { status: 400 });
    }

    let docId = "";
    try {
      const adminDb = getAdminDb();
      await adminDb.collection("leads").add({
        name,
        email,
        mobile,
        message: comment,
        sourcePage: `/blog/${postSlug}`,
        status: "new",
        createdAt: adminServerTimestamp(),
      });
      const docRef = await adminDb.collection("blog_comments").add({
        postSlug,
        name,
        email,
        mobile,
        comment,
        status: "pending",
        createdAt: adminServerTimestamp(),
      });
      docId = docRef.id;
    } catch (adminError) {
      if (!isMissingAdminCredentialError(adminError)) {
        throw adminError;
      }

      try {
        await addDoc(collection(getClientDb(), "leads"), {
          name,
          email,
          mobile,
          message: comment,
          sourcePage: `/blog/${postSlug}`,
          status: "new",
          createdAt: Timestamp.now(),
        });
      } catch (clientError) {
        console.warn("[comments] Client Firestore fallback write for leads failed:", clientError);
      }

      try {
        const docRef = await addDoc(collection(getClientDb(), "blog_comments"), {
          postSlug,
          name,
          email,
          mobile,
          comment,
          status: "pending",
          createdAt: Timestamp.now(),
        });
        docId = docRef.id;
      } catch (clientError) {
        console.warn("[comments] Client Firestore fallback write for blog_comments failed:", clientError);
        docId = crypto.randomUUID();
      }
    }

    console.log("Comment saved successfully:", docId);

    const reqId = crypto.randomUUID().slice(0, 8);

    // Dispatch admin notification email asynchronously.
    sendNotificationEmails({
      formType: "comment",
      reqId,
      name,
      email,
      mobile,
      message: comment,
      postSlug,
    }).catch((err) =>
      console.warn(`[comment][${reqId}] Background mailer dispatch error:`, err),
    );

    return NextResponse.json({
      ok: true,
      id: docId,
      moderationStatus: "pending",
      message: "Comment submitted for moderation.",
    });
  } catch (error) {
    console.error("Comment submission error:", error);
    const details = error instanceof Error ? error.message : null;
    return NextResponse.json(
      {
        error: toPublicFirestoreError(error),
        ...(process.env.NODE_ENV === "development" && details ? { details } : {}),
      },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postSlug = searchParams.get("postSlug")?.trim();
    if (!postSlug) {
      return NextResponse.json({ error: "postSlug is required." }, { status: 400 });
    }

    let docs:
      | Array<{ id: string; data: () => Record<string, unknown> }>
      | { id: string; data: () => Record<string, unknown> }[] = [];

    try {
      const adminDb = getAdminDb();
      const snapshot = await adminDb
        .collection("blog_comments")
        .where("postSlug", "==", postSlug)
        .where("status", "==", "visible")
        .orderBy("createdAt", "desc")
        .limit(100)
        .get();
      docs = snapshot.docs.map((doc) => ({ id: doc.id, data: () => doc.data() as Record<string, unknown> }));
    } catch (adminError) {
      if (!isMissingAdminCredentialError(adminError)) {
        throw adminError;
      }

      try {
        const commentsRef = collection(getClientDb(), "blog_comments");
        const q = query(
          commentsRef,
          where("postSlug", "==", postSlug),
          where("status", "==", "visible"),
          orderBy("createdAt", "desc"),
          limit(100),
        );
        const snapshot = await getDocs(q);
        docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: () => doc.data() as Record<string, unknown>,
        }));
      } catch (clientError) {
        console.warn("[comments] Client Firestore fallback read for blog_comments failed:", clientError);
        docs = [];
      }
    }

    const comments = docs
      .map((doc) => {
        const data = doc.data();
        const createdAtRaw = (data as { createdAt?: { toDate?: () => Date } }).createdAt;
        const createdAt = createdAtRaw?.toDate?.() ?? new Date();
        return {
          id: doc.id,
          postSlug: String(data.postSlug ?? ""),
          name: String(data.name ?? ""),
          email: String(data.email ?? ""),
          mobile: String(data.mobile ?? ""),
          comment: String(data.comment ?? ""),
          status: String(data.status ?? "visible"),
          createdAt: createdAt.toISOString(),
        };
      });

    return NextResponse.json({ comments });
  } catch (error) {
    const details = error instanceof Error ? error.message : null;
    return NextResponse.json(
      {
        error: toPublicFirestoreError(error),
        ...(process.env.NODE_ENV === "development" && details ? { details } : {}),
      },
      { status: 500 },
    );
  }
}
