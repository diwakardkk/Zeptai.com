# Razorpay ₹10 Test Payment — Setup & Verification Guide

> **Status**: Temporary — disable after testing is complete.  
> This flow is gated behind `ENABLE_TEST_PAYMENT=true` and is never shown in the
> public pricing UI.

---

## Purpose

Verify the full Razorpay integration end-to-end without touching real pricing plans:

1. Order creation via `/api/payments/create-order`
2. Checkout modal (Razorpay hosted checkout.js)
3. Signature verification via `/api/payments/verify`
4. Webhook delivery to `/api/razorpay/webhook`
5. Firestore event storage in `razorpay_webhook_events`

---

## Required Environment Variables

Set these on the server (AWS Amplify → App settings → Environment variables,
or in `frontend/.env.local` for local testing):

| Variable | Value | Notes |
|---|---|---|
| `RAZORPAY_KEY_ID` | `rzp_test_XXXX…` | From Razorpay Dashboard → Settings → API Keys (Test Mode) |
| `RAZORPAY_KEY_SECRET` | `XXXX…` | Never commit. Never log. |
| `RAZORPAY_WEBHOOK_SECRET` | `XXXX…` | Set when configuring the webhook in Razorpay Dashboard |
| `ENABLE_TEST_PAYMENT` | `true` | Enables the `razorpay_test_10` plan and the test page |

> **Security note**: `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` are
> used only server-side. They are never returned to the browser or included in
> API responses.

---

## Test URLs

| URL | Purpose |
|---|---|
| `https://zeptai.com/payment-test` | Test page (gated — only works when `ENABLE_TEST_PAYMENT=true`) |
| `https://zeptai.com/api/payments/create-order` | POST — creates the ₹10 Razorpay order |
| `https://zeptai.com/api/payments/verify` | POST — verifies HMAC-SHA256 signature |
| `https://zeptai.com/api/razorpay/webhook` | POST — receives Razorpay webhook events |

---

## Razorpay Dashboard — Webhook Configuration

1. Go to [Razorpay Dashboard → Webhooks](https://dashboard.razorpay.com/app/webhooks).
2. Click **Add New Webhook**.
3. Set **Webhook URL** to:
   ```
   https://zeptai.com/api/razorpay/webhook
   ```
4. Set **Secret** to the value of `RAZORPAY_WEBHOOK_SECRET`.
5. Enable these events:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
6. Save. Razorpay will verify the URL with a test ping — confirm it returns **200 OK**.

---

## Test Plan Details

| Field | Value |
|---|---|
| Plan ID | `razorpay_test_10` |
| Amount | ₹10 (1000 paise) |
| Currency | INR |
| Report credits | 0 |
| Receipt format | `zeptai_test_10_<timestamp>` |
| Razorpay notes `billing_model` | `test_payment` |
| Firestore collection | `razorpay_webhook_events` |

---

## Local Testing Steps

```bash
# 1. Fill in frontend/.env.local (never commit this file)
RAZORPAY_KEY_ID=rzp_test_REPLACE_ME
RAZORPAY_KEY_SECRET=REPLACE_ME
RAZORPAY_WEBHOOK_SECRET=REPLACE_ME
ENABLE_TEST_PAYMENT=true

# 2. Start local dev server
cd frontend
npm run dev

# 3. Open the test page
open http://localhost:3000/payment-test
```

**Razorpay test card details** (use in Test Mode):

| Field | Value |
|---|---|
| Card number | `4111 1111 1111 1111` |
| Expiry | Any future date |
| CVV | Any 3 digits |
| OTP | `1234` |

---

## Verification Checklist

After clicking **Pay ₹10 Test** and completing the Razorpay checkout:

- [ ] `/api/payments/create-order` returned HTTP 200 with `order.id`
- [ ] Razorpay checkout modal opened without CSP or network errors
- [ ] Payment completed (no card error or OTP failure)
- [ ] `/api/payments/verify` returned `{ ok: true, redirectUrl: "..." }`
- [ ] Browser redirected to `/pricing/success?plan=razorpay_test_10&payment_id=pay_…`
- [ ] Razorpay Dashboard → Payments shows payment `Captured`
- [ ] Razorpay Dashboard → Webhooks shows delivery with `200 OK` response
- [ ] Firestore → `razorpay_webhook_events` collection has a document with:
  - `eventType: "payment.captured"`
  - `paymentId: "pay_…"`
  - `orderId: "order_…"`
  - `createdAt` timestamp

---

## Disabling After Testing

When the test is complete:

1. In AWS Amplify Console → App settings → Environment variables:
   - Set `ENABLE_TEST_PAYMENT` to `false`, or delete the variable.
2. Trigger a redeploy (push a commit or click **Redeploy** in Amplify).
3. Verify `/payment-test` is inaccessible:
   - The page will still exist in the build, but the API will reject
     `razorpay_test_10` requests with `{ error: "Invalid pricing plan." }`.
   - Optionally delete `frontend/app/payment-test/page.tsx` to remove the page
     entirely from the build.

> The `razorpay_test_10` plan is never shown in the public pricing UI
> (`/pricing` page) — it is only accessible via direct API calls when
> `ENABLE_TEST_PAYMENT=true`.

---

## Files Changed for This Test Flow

| File | Change |
|---|---|
| `frontend/lib/pricing.ts` | Added `"razorpay_test_10"` to `PricingPlan.id` union; added `TEST_PAYMENT_PLAN` constant; updated `getPlanById` to return it |
| `frontend/app/api/payments/create-order/route.ts` | Guards test plan behind `ENABLE_TEST_PAYMENT`; sets fixed 1000 paise amount, test receipt, and test notes |
| `frontend/app/api/payments/verify/route.ts` | Guards test plan verification behind `ENABLE_TEST_PAYMENT` |
| `frontend/app/payment-test/page.tsx` | New — test page UI with full checkout flow |
| `docs/RAZORPAY_TEST_PAYMENT.md` | This file |

---

*Last updated: 2026-05-19*
