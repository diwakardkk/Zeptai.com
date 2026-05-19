# Razorpay Setup Guide — ZeptAI

## Overview

ZeptAI uses Razorpay for payment processing. The integration has three server-side
API routes:

| Route | Purpose |
|---|---|
| `/api/payments/create-order` | Creates a Razorpay order (returns `order_id`, `amount`, `currency`, `keyId`) |
| `/api/payments/verify` | Verifies payment signature after checkout completes |
| `/api/razorpay/webhook` | Receives and stores Razorpay webhook events with idempotency |

The legacy `/api/payments/webhook` route is kept for backwards compatibility but
does not store events. Point your Razorpay dashboard to `/api/razorpay/webhook`.

---

## Step 1 — Generate API Keys

1. Log in to [https://dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Go to **Settings → API Keys**
3. Click **"Generate Key"** for the mode you need:
   - **Test mode** — for development and staging
   - **Live mode** — for production (requires KYC)
4. You will see:
   - **Key ID** — starts with `rzp_test_` or `rzp_live_`
   - **Key Secret** — shown once, copy it immediately
5. Store these securely. Never commit them to the repository.

---

## Step 2 — Create a Webhook in Razorpay Dashboard

1. Go to **Settings → Webhooks** in the Razorpay Dashboard
2. Click **"Add New Webhook"**
3. Fill in:
   - **Webhook URL**: `https://zeptai.com/api/razorpay/webhook`
     - For local testing use ngrok (see Step 5)
   - **Secret**: generate a random string (e.g. `openssl rand -hex 32` in terminal)
     — save this as `RAZORPAY_WEBHOOK_SECRET`
   - **Alert Email**: your monitoring email
4. Under **Active Events**, select exactly these:
   - `payment.captured` — fires when payment succeeds
   - `payment.failed` — fires when payment fails
   - `order.paid` — fires when an order is fully paid
5. Click **"Create Webhook"**

---

## Step 3 — Environment Variables

### Local Development

Add to `frontend/.env.local` (never commit this file):

```bash
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

### AWS Amplify (Production)

1. Open the **AWS Amplify Console**
2. Go to your app → **App settings → Environment variables**
3. Add these three variables:

   | Key | Value |
   |---|---|
   | `RAZORPAY_KEY_ID` | `rzp_live_xxxxxxxxxxxx` |
   | `RAZORPAY_KEY_SECRET` | your live key secret |
   | `RAZORPAY_WEBHOOK_SECRET` | the secret you set in the Razorpay dashboard |

4. Click **"Save"**
5. Trigger a new deployment (Amplify Console → Redeploy) so the new variables take effect

> **Important**: `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` are server-side
> only. They are never returned to the browser. `RAZORPAY_KEY_ID` is returned to
> the frontend as part of the order creation response so the Razorpay checkout
> SDK can initialise — this is intentional and safe.

---

## Step 4 — Firestore Collection

Webhook events are stored in the `razorpay_webhook_events` Firestore collection.
Each document has these fields:

| Field | Type | Description |
|---|---|---|
| `eventType` | string | e.g. `payment.captured` |
| `paymentId` | string \| null | Razorpay payment ID (`pay_xxx`) |
| `orderId` | string \| null | Razorpay order ID (`order_xxx`) |
| `paymentStatus` | string \| null | e.g. `captured`, `failed` |
| `orderStatus` | string \| null | e.g. `paid` |
| `accountId` | string \| null | Razorpay account ID |
| `createdAt` | timestamp | Server timestamp |
| `processedAt` | timestamp | Server timestamp |

The document ID is an idempotency key (`payment_captured_pay_xxx`) so the same
webhook delivery can never create a duplicate record.

Add this to your `firestore.rules` if you haven't already:

```
match /razorpay_webhook_events/{docId} {
  // Only server-side (Admin SDK) can write webhook events.
  allow read, write: if false;
}
```

---

## Step 5 — Testing Webhooks Locally

Razorpay cannot reach `localhost` directly. Use **ngrok** to expose your local
dev server:

```bash
# Install ngrok (if not installed)
brew install ngrok

# Start your Next.js dev server
cd frontend && npm run dev

# In a second terminal, expose port 3000
ngrok http 3000
```

ngrok gives you a public URL like `https://abc123.ngrok.io`.

1. Copy that URL
2. Go to Razorpay Dashboard → Settings → Webhooks → Edit your webhook
3. Change the URL to `https://abc123.ngrok.io/api/razorpay/webhook`
4. Trigger a test payment in Razorpay test mode
5. Watch your Next.js terminal for log lines like:
   ```
   [razorpay-webhook][abc1def2] event=payment.captured paymentId=pay_xxx orderId=order_xxx status=captured
   [razorpay-webhook][abc1def2] Stored event docId=payment_captured_pay_xxx
   ```
6. Check Firestore → `razorpay_webhook_events` collection for the new document
7. Revert the webhook URL back to `https://zeptai.com/api/razorpay/webhook` when done

### Testing signature verification

To confirm the signature check works, send a request with a bad signature:

```bash
curl -X POST https://abc123.ngrok.io/api/razorpay/webhook \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: invalidsignature" \
  -d '{"event":"payment.captured"}'
```

Expected response: `400 { "error": "Invalid webhook signature." }`

### Health check

```bash
curl https://zeptai.com/api/health
# Expected: { "ok": true, "service": "zeptai-web", "timestamp": "..." }
```

---

## Step 6 — Switching from Test to Live Keys

1. Complete Razorpay KYC (required for live payments)
2. Generate Live API keys in the Razorpay dashboard
3. Update the three Amplify environment variables with the `rzp_live_` values
4. Update the webhook URL in the Razorpay dashboard to point to your production domain
5. Trigger a new Amplify deployment
6. Make one real test transaction to confirm end-to-end flow

---

## Security Notes

- `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` are only accessed in server-side
  Node.js runtime — they are never included in client bundles.
- All webhook payloads are verified with HMAC-SHA256 + `timingSafeEqual` before
  any processing occurs.
- Payment verification at `/api/payments/verify` also uses `timingSafeEqual`.
- Webhook events are stored without sensitive financial fields (no card details,
  no customer PII beyond IDs already present in Razorpay's own system).
