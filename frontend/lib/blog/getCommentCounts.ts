import { collection, getDocs, query, where } from "firebase/firestore";
import {
  getAdminDb,
  isMissingAdminCredentialError,
} from "@/app/api/_firestoreAdmin";
import { db } from "@/app/api/_firestore";

export async function getCommentCounts(): Promise<Record<string, number>> {
  try {
    let docs:
      | Array<{ id: string; data: () => Record<string, unknown> }>
      | { id: string; data: () => Record<string, unknown> }[] = [];

    try {
      const snapshot = await getAdminDb()
        .collection("blog_comments")
        .where("status", "==", "visible")
        .get();
      docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: () => doc.data() as Record<string, unknown>,
      }));
    } catch (adminError) {
      if (!isMissingAdminCredentialError(adminError)) {
        throw adminError;
      }

      const snapshot = await getDocs(
        query(collection(db, "blog_comments"), where("status", "==", "visible")),
      );
      docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: () => doc.data() as Record<string, unknown>,
      }));
    }

    const counts: Record<string, number> = {};

    docs.forEach((doc) => {
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
