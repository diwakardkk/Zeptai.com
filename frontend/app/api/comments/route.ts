import { NextResponse } from "next/server";
import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/app/api/_firestore";
import { BlogCommentInput } from "@/types/comment";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<BlogCommentInput>;
    const postSlug = String(body.postSlug ?? "").trim();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const mobile = String(body.mobile ?? "").trim();
    const comment = String(body.comment ?? "").trim();

    if (!postSlug || !name || !email || !mobile || !comment) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }
    if (comment.length < 8) {
      return NextResponse.json({ error: "Comment should be at least 8 characters." }, { status: 400 });
    }

    await addDoc(collection(db, "blog_comments"), {
      postSlug,
      name,
      email,
      mobile,
      comment,
      status: "visible",
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to store comment." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postSlug = searchParams.get("postSlug")?.trim();
    if (!postSlug) {
      return NextResponse.json({ error: "postSlug is required." }, { status: 400 });
    }

    const commentsRef = collection(db, "blog_comments");
    const q = query(
      commentsRef,
      where("postSlug", "==", postSlug),
      orderBy("createdAt", "desc"),
      limit(100),
    );

    const snapshot = await getDocs(q);
    const comments = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate?.() ?? new Date();
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
      })
      .filter((entry) => entry.status === "visible");

    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json({ error: "Failed to fetch comments." }, { status: 500 });
  }
}
