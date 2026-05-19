# AWS Amplify Deployment Guide — ZeptAI

## Architecture

**AWS Amplify Hosting** with Next.js SSR (server-side rendering) support.

Amplify Hosting uses AWS Lambda functions under the hood to serve Next.js server components,
API routes, and dynamic pages. This preserves full server-side runtime — no functionality is lost.

### Why not S3-only static hosting?

This project uses Next.js API routes (`/api/contact`, `/api/leads`, `/api/comments`,
`/api/feedback`, `/api/health`, `/api/companion-proxy`, `/api/nurse-proxy`,
`/api/blog-audio`, `/api/tts`, `/api/payments/*`). These require a Node.js runtime and
cannot be served from S3. Using `output: 'export'` would break all server-side API routes,
Firebase Admin SDK calls, SMTP email, and Razorpay webhooks.

---

## Repository Structure

```
Zeptai.com/          ← GitHub repo root
  amplify.yml        ← Amplify build spec (set appRoot: frontend)
  frontend/          ← Next.js app root (set as Amplify app root)
    app/
      api/           ← Server-side API routes (require SSR)
    ...
```

---

## AWS Console Deployment Steps

### Step 1 — Create an AWS Budget (do this before anything else)

1. In the AWS Console, go to **Billing → Budgets → Create budget**.
2. Choose **Cost budget**, set a monthly limit (e.g. $20).
3. Add an alert at 80% of the budget to your email.
4. This prevents surprise bills during development.

### Step 2 — Connect GitHub to Amplify

1. Go to **AWS Amplify** in the AWS Console.
2. Click **New app → Host web app**.
3. Select **GitHub** as the source provider and authorise access.

### Step 3 — Select Repository and Branch

1. Repository: `diwakardkk/Zeptai.com`
2. Branch: `main`

### Step 4 — Configure Build Settings

Amplify will detect `amplify.yml` at the repository root automatically.
Verify it shows:

- **App root**: `frontend`
- **Build command**: `npm run build`
- **Base directory for artifacts**: `.next`

If Amplify does not auto-detect, paste the contents of `amplify.yml` into the build
settings editor.

### Step 5 — Add Environment Variables

In **App settings → Environment variables**, add every variable listed in the
[Required Environment Variables](#required-environment-variables) section below.

> **Important**: Never commit real secret values to the repository.
> All secrets must be set only inside Amplify's environment variable console.

### Step 6 — Deploy

Click **Save and deploy**. The first build takes 3–8 minutes.
Watch the build log for errors.

### Step 7 — Add Custom Domain (zeptai.com)

1. Go to **App settings → Custom domains**.
2. Click **Add domain**, enter `zeptai.com`.
3. Add the following DNS records at your registrar:

   | Type  | Name | Value                        |
   |-------|------|------------------------------|
   | CNAME | www  | `<amplify-domain>.amplifyapp.com` |
   | A     | @    | Amplify-provided IP (or ALIAS/CNAME at root) |

4. AWS Certificate Manager (ACM) will provision an SSL certificate automatically.

### Step 8 — Enable HTTPS

Amplify enables HTTPS automatically via ACM once the domain is verified.
Confirm the certificate is in **Issued** state before switching DNS.

### Step 9 — Check Logs

- Go to **Monitoring → Access logs** to verify requests.
- Go to **Monitoring → CloudWatch Logs** to see server-side errors.

---

## Required Environment Variables

Set all of the following in **Amplify Console → App settings → Environment variables**.

### Nurse / Companion API

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_NURSE_API_BASE` | Public base URL for the nurse chat backend |
| `NURSE_API_BASE` | Server-side base URL for the nurse proxy route |

### Firebase (Client SDK — exposed to browser)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase project API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |

### Firebase Admin SDK (server-side only — never expose to client)

Provide either the JSON bundle **or** the three individual fields:

| Variable | Description |
|---|---|
| `FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON` | Full service account JSON as a single-line string (preferred) |
| `FIREBASE_ADMIN_PROJECT_ID` | Admin project ID (alternative to JSON bundle) |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Admin client email (alternative to JSON bundle) |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Admin private key with `\n` escaped (alternative to JSON bundle) |

### SMTP / Email

| Variable | Description |
|---|---|
| `SMTP_HOST` | SMTP server host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port (e.g. `465`) |
| `SMTP_SECURE` | `true` for TLS (port 465), `false` for STARTTLS (port 587) |
| `SMTP_USER` | SMTP username / sender email address |
| `SMTP_PASS` | SMTP password or app password |
| `CONTACT_RECEIVER_EMAIL` | Email address that receives contact form submissions |
| `CONTACT_AUTOREPLY_FROM_NAME` | Display name for auto-reply emails (e.g. `ZeptAI Team`) |

### OpenAI

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENAI_CHAT_MODEL` | Chat model (e.g. `gpt-4o`) |
| `OPENAI_STT_MODEL` | Speech-to-text model (e.g. `whisper-1`) |
| `OPENAI_TTS_MODEL` | Text-to-speech model (e.g. `tts-1`) |
| `OPENAI_TTS_VOICE` | TTS voice (e.g. `alloy`) |

### ElevenLabs

| Variable | Description |
|---|---|
| `ELEVENLABS_API_KEY` | ElevenLabs API key |
| `ELEVENLABS_VOICE_ID` | ElevenLabs voice ID |
| `ELEVENLABS_MODEL_ID` | ElevenLabs model ID (e.g. `eleven_multilingual_v2`) |
| `ELEVENLABS_OUTPUT_FORMAT` | Output format (e.g. `mp3_44100_128`) |

### Razorpay

| Variable | Description |
|---|---|
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook signature secret |

---

## Post-Deployment Test Checklist

Run these tests after deploying but **before switching your production DNS**:

- [ ] Homepage loads without JS console errors
- [ ] Contact form submits successfully (check for 200 response)
- [ ] Confirmation email received at `CONTACT_RECEIVER_EMAIL`
- [ ] Auto-reply email received at the submitted address
- [ ] Firestore `contact_submissions` collection shows the new document
- [ ] `GET /api/health` returns `{ "ok": true, "service": "zeptai-web", ... }`
- [ ] No secret, env var name, or stack trace appears in any browser network response
- [ ] No secret appears in the browser console
- [ ] Lighthouse security/performance check passes
- [ ] HTTPS certificate is valid (`https://zeptai.com`)

---

## Rollback Plan

1. **Keep the previous hosting active** (Netlify or other) until AWS is fully verified.
2. **Lower DNS TTL** to 60 seconds at least 24 hours before the planned DNS cutover.
3. **Test on the Amplify `*.amplifyapp.com` URL** before changing DNS.
4. **Switch DNS only after** the full test checklist above passes.
5. **If issues arise** after DNS switch, revert DNS records back to the previous host.
   With a low TTL the revert propagates within ~2 minutes.

---

## Production Recommendations for Rate Limiting

The contact API uses an in-memory rate limiter as a baseline defence. In serverless
environments each Lambda instance has independent memory, so the rate limit is per-instance
only. For production-grade protection:

- **AWS WAF** — Add a rate-based rule on the Amplify CloudFront distribution.
  This is the recommended approach because it operates at the CDN layer before
  the Lambda function is invoked.
- **Upstash Redis** — Use `@upstash/ratelimit` with a Redis instance for
  cross-instance rate limiting within the Lambda runtime.
- **AWS DynamoDB** — Use atomic conditional writes to implement a distributed
  token bucket.
