import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/api/_firestore";

export async function getCommentCounts(): Promise<Record<string, number>> {
  try {
    const snapshot = await getDocs(collection(db, "blog_comments"));
    const counts: Record<string, number> = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      const postSlug = String(data.postSlug ?? "").trim();
      const status = String(data.status ?? "visible");

      if (!postSlug || status !== "visible") {
        return;
      }

      counts[postSlug] = (counts[postSlug] ?? 0) + 1;
    });

    return counts;
  } catch {
    return {};
  }
}
