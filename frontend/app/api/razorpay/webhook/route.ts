import crypto from "crypto";
import { NextResponse } from "next/server";
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import {
  adminServerTimestamp,
  getAdminDb,
  isMissingAdminCredentialError,
} from "@/app/api/_firestoreAdmin";
import { getClientDb } from "@/app/api/_firestore";

export const runtime = "nodejs";

// Firestore Admin SDK gRPC error code for "document already exists".
// Used for atomic idempotency — prevents duplicate event processing.
const ALREADY_EXISTS_CODE = 6;

// Only these event types are processed and stored.
// All others are acknowledged (200) and discarded so Razorpay stops retrying.
const HANDLED_EVENTS = new Set(["payment.captured", "payment.failed", "order.paid"]);

type RazorpayPaymentEntity = {
  id?: string;
  order_id?: string;
  status?: string;
  // Amount and currency intentionally omitted from this type —
  // do not log financial amounts in server logs on a healthcare platform.
};

type RazorpayWebhookPayload = {
  entity?: string;
  account_id?: string;
  event?: string;
  payload?: {
    payment?: { entity?: RazorpayPaymentEntity };
    order?: { entity?: { id?: string; status?: string } };
  };
  created_at?: number;
};

export async function POST(req: Request) {
  // Short request ID for log correlation. Never include in API responses.
  const reqId = crypto.randomUUID().slice(0, 8);

  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signatureHeader = req.headers.get("x-razorpay-signature") ?? "";

    // Read raw body BEFORE any parsing — Razorpay signs the exact raw bytes.
    const rawBody = await req.text();

    if (!webhookSecret) {
      // Log server-side only. Never expose env variable names to callers.
      console.error(`[razorpay-webhook][${reqId}] Webhook secret not configured`);
      return NextResponse.json({ error: "Webhook is not configured." }, { status: 500 });
    }

    // ── Signature verification ─────────────────────────────────────────────
    const expectedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    // timingSafeEqual prevents timing-based signature oracle attacks.
    // Both buffers must be the same length; if the header is not valid hex
    // the buffer will be shorter, making the length check fail first.
    const expectedBuf = Buffer.from(expectedSig, "hex");
    const receivedBuf = Buffer.from(signatureHeader, "hex");
    const signatureValid =
      expectedBuf.length === receivedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, receivedBuf);

    if (!signatureValid) {
      console.warn(`[razorpay-webhook][${reqId}] Signature verification failed`);
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
    }

    // ── Parse payload ──────────────────────────────────────────────────────
    let event: RazorpayWebhookPayload;
    try {
      event = JSON.parse(rawBody) as RazorpayWebhookPayload;
    } catch {
      console.warn(`[razorpay-webhook][${reqId}] Malformed JSON payload`);
      return NextResponse.json({ error: "Malformed payload." }, { status: 400 });
    }

    const eventType = (event.event ?? "").trim();

    // Acknowledge unrecognised events immediately so Razorpay stops retrying them.
    if (!HANDLED_EVENTS.has(eventType)) {
      console.log(`[razorpay-webhook][${reqId}] Unhandled event type=${eventType} — acknowledged`);
      return NextResponse.json({ ok: true });
    }

    // ── Extract safe identifiers for logging ───────────────────────────────
    // Log ONLY event type and entity IDs.
    // Do NOT log amounts, customer names, emails, or mobile numbers.
    const paymentId = event.payload?.payment?.entity?.id ?? null;
    const orderId =
      event.payload?.order?.entity?.id ??
      event.payload?.payment?.entity?.order_id ??
      null;
    const paymentStatus = event.payload?.payment?.entity?.status ?? null;
    const orderStatus = event.payload?.order?.entity?.status ?? null;

    console.log(
      `[razorpay-webhook][${reqId}] event=${eventType}` +
        ` paymentId=${paymentId} orderId=${orderId}` +
        ` paymentStatus=${paymentStatus} orderStatus=${orderStatus}`,
    );

    // ── Idempotency key ────────────────────────────────────────────────────
    // A deterministic document ID ensures the same event delivery never
    // creates a duplicate Firestore record, even if Razorpay retries.
    const entityId =
      paymentId ?? orderId ?? `${eventType}_${event.created_at ?? Date.now()}`;
    const idempotencyKey = `${eventType.replace(".", "_")}_${entityId}`;

    // Base document — no financial or PII fields stored here.
    const baseDoc = {
      eventType,
      paymentId,
      orderId,
      paymentStatus,
      orderStatus,
      accountId: event.account_id ?? null,
    };

    // ── Store in Firestore ─────────────────────────────────────────────────
    try {
      const adminDb = getAdminDb();
      const docRef = adminDb
        .collection("razorpay_webhook_events")
        .doc(idempotencyKey);

      try {
        // doc.create() is atomic — throws ALREADY_EXISTS if the doc is present.
        // This is the correct idempotency primitive for serverless handlers.
        await docRef.create({
          ...baseDoc,
          createdAt: adminServerTimestamp(),
          processedAt: adminServerTimestamp(),
        });
        console.log(
          `[razorpay-webhook][${reqId}] Stored event docId=${idempotencyKey}`,
        );
      } catch (createErr: unknown) {
        const grpcCode = (createErr as { code?: number }).code;
        if (grpcCode === ALREADY_EXISTS_CODE) {
          // Duplicate delivery — already processed. Acknowledge silently.
          console.log(
            `[razorpay-webhook][${reqId}] Duplicate delivery docId=${idempotencyKey} — skipped`,
          );
        } else {
          throw createErr;
        }
      }
    } catch (adminError) {
      if (!isMissingAdminCredentialError(adminError)) {
        throw adminError;
      }

      // ── Fallback: client Firestore SDK ────────────────────────────────
      // Admin credentials not configured — use client SDK.
      // Check-then-set provides best-effort deduplication (no race condition
      // risk in practice since duplicate webhooks are rare concurrent events).
      const fallbackDb = getClientDb();
      const docRef = doc(fallbackDb, "razorpay_webhook_events", idempotencyKey);
      const existing = await getDoc(docRef);

      if (existing.exists()) {
        console.log(
          `[razorpay-webhook][${reqId}] Duplicate delivery (client SDK) docId=${idempotencyKey} — skipped`,
        );
      } else {
        await setDoc(docRef, {
          ...baseDoc,
          createdAt: Timestamp.now(),
          processedAt: Timestamp.now(),
        });
        console.log(
          `[razorpay-webhook][${reqId}] Stored event via client SDK docId=${idempotencyKey}`,
        );
      }
    }

    // Return 200 quickly — Razorpay marks the delivery as successful on any 2xx.
    return NextResponse.json({ ok: true });
  } catch (error) {
    // Log full error server-side. Never expose details in the response.
    console.error(`[razorpay-webhook][${reqId}] Unhandled error:`, error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
