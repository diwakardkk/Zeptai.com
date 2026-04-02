# Firebase Website Database

ZeptAI website should use Firebase Firestore for only two collections:

1. `contact_submissions`
2. `blog_comments`

Do not store patient conversations, reports, payments, or product usage here.

## Collection 1: `contact_submissions`

Store every homepage contact/demo/API inquiry.

### Fields
- `name`: string
- `email`: string
- `mobile`: string
- `message`: string
- `sourcePage`: string
- `inquiryType`: string
- `status`: string
- `createdAt`: timestamp

### Example document
```json
{
  "name": "Diwakar Kumar",
  "email": "hello@clinic.com",
  "mobile": "+91 9876543210",
  "message": "We want to evaluate ZeptAI for intake and API integration.",
  "sourcePage": "home_contact",
  "inquiryType": "contact",
  "status": "new",
  "createdAt": "server timestamp"
}
```

## Collection 2: `blog_comments`

Store public comments for each blog post.

### Fields
- `postSlug`: string
- `name`: string
- `email`: string
- `mobile`: string
- `comment`: string
- `status`: string
- `createdAt`: timestamp

### Example document
```json
{
  "postSlug": "ai-healthcare-future-of-patient-intake",
  "name": "Amit Sharma",
  "email": "amit@example.com",
  "mobile": "+91 9988776655",
  "comment": "Very useful article on intake automation.",
  "status": "visible",
  "createdAt": "server timestamp"
}
```

## Firebase setup

1. Create a Firebase project in Firebase Console.
2. Open `Build -> Firestore Database`.
3. Click `Create database`.
4. Start in production mode.
5. Choose your preferred region.
6. Create a Web App in Firebase project settings.
7. Copy the web config values.
8. Add them to `frontend/.env.local`.

## Required environment variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Connect with project

Firebase is initialized in:
- `frontend/app/api/_firestore.ts`

Contact submissions are written from:
- `frontend/app/api/contact/route.ts`

Blog comments are written/read from:
- `frontend/app/api/comments/route.ts`

## Recommended Firestore indexes

Create this composite index:

- Collection: `blog_comments`
- Fields:
  - `postSlug` ascending
  - `createdAt` descending

## Recommended Firestore rules

Use restrictive rules because writes happen through Next.js API routes:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contact_submissions/{document=**} {
      allow read, write: if false;
    }

    match /blog_comments/{document=**} {
      allow read, write: if false;
    }
  }
}
```

If you later want public client-side reads for comments, expose them only through your API routes instead of direct browser Firestore access.

