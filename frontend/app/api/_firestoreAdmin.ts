import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, Firestore, getFirestore } from "firebase-admin/firestore";

type AdminServiceAccount = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

let cachedDb: Firestore | null = null;

function getAdminServiceAccount(): AdminServiceAccount {
  const rawServiceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON;

  if (rawServiceAccount) {
    try {
      const parsed = JSON.parse(rawServiceAccount) as Partial<AdminServiceAccount>;
      if (parsed.projectId && parsed.clientEmail && parsed.privateKey) {
        return {
          projectId: parsed.projectId,
          clientEmail: parsed.clientEmail,
          privateKey: parsed.privateKey.replace(/\\n/g, "\n"),
        };
      }
    } catch {
      throw new Error(
        "Invalid FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON. It must be valid JSON service account content.",
      );
    }
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin credentials missing. Set FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON or FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY.",
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

export function getAdminDb(): Firestore {
  if (cachedDb) {
    return cachedDb;
  }

  const adminApp =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          credential: cert(getAdminServiceAccount()),
        });

  cachedDb = getFirestore(adminApp);
  return cachedDb;
}

export function adminServerTimestamp() {
  return FieldValue.serverTimestamp();
}
