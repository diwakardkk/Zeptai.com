import { getAdminDb } from "@/app/api/_firestoreAdmin";

export async function getCommentCounts(): Promise<Record<string, number>> {
  try {
    const snapshot = await getAdminDb()
      .collection("blog_comments")
      .where("status", "==", "visible")
      .get();
    const counts: Record<string, number> = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      const postSlug = String(data.postSlug ?? "").trim();
      if (!postSlug) {
        return;
      }

      counts[postSlug] = (counts[postSlug] ?? 0) + 1;
    });

    return counts;
  } catch {
    return {};
  }
}
