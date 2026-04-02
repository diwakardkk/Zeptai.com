# Frontend

Next.js 14 website for ZeptAI.

## Run
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Razorpay Setup
Copy `.env.example` to `.env.local` and add your Razorpay values:

```bash
cp .env.example .env.local
```

Required variables:
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

The pricing flow uses Razorpay checkout for UPI, QR scan, debit cards, credit cards, and netbanking.

Website-only Firestore collections are documented in `FIREBASE_WEBSITE_DB.md`.
