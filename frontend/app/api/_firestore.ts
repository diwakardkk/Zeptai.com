import { getApp, getApps, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";

function readRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Firebase client config missing: ${name}`);
  }
  return value;
}

let cachedDb: Firestore | null = null;

/**
 * Returns the lazily-initialised Firebase client Firestore instance.
 * Initialisation is deferred to the first call so that importing this module
 * at build time does not throw when environment variables are absent.
 */
export function getClientDb(): Firestore {
  if (cachedDb) return cachedDb;

  const firebaseConfig = {
    apiKey: readRequiredEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: readRequiredEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: readRequiredEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: readRequiredEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readRequiredEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readRequiredEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
  };

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  cachedDb = getFirestore(app);
  return cachedDb;
}
