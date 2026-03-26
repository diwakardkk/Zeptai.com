# ZeptAI - Premium SaaS Website

> AI-powered clinical intake & virtual nurse assistant

## Tech Stack
- Frontend: Next.js (App Router), Tailwind CSS, Framer Motion, Lucide React
- Backend: Firebase (Firestore Modular SDK v9+)

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   - Create a project on [Firebase Console](https://console.firebase.google.com/).
   - Enable **Firestore Database** in test mode (or configure strict security rules).
   - Create a `.env.local` file by copying `.env.example` and filling in your credentials:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
     NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
     NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
     ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Integrating Your AI Chatbot Demo
1. Locate `components/ChatbotDemo.tsx`.
2. Find the placeholder text `--- Integration Pending ---`.
3. Import your personal React/GitHub code into this file and mount it inside the flex container.
4. Pass the `db` instance from `lib/firebase.ts` to your component to store conversations.

## Deployment Strategy
**Recommended: Vercel**
1. Push this repository to GitHub.
2. Go to Vercel and import the repository.
3. In Vercel environment variable settings, add all the variables from `.env.local`.
4. Deploy and connect your custom domain (zeptai.com).

## Next Phases
- Phase 2: Add Admin dashboard to view leads dynamically.
- Phase 3: Setup Firebase Cloud Function for SMTP email routing.
