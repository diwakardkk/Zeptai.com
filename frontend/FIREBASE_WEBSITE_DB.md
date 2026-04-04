# Firebase Firestore Database Guide (Website)

This website uses Firestore for website forms and engagement data.

## Architecture

- Blog article content: MDX files in `frontend/content/blog`
- Contact form submissions: Firestore `contact_submissions`
- Blog comments: Firestore `blog_comments`
- Blog lead capture: Firestore `blog_leads`

Do not move blog article content to Firestore in this setup.

## Required collections

### `contact_submissions`

Written by:
- `frontend/app/api/contact/route.ts`

Schema:
```json
{
  "name": "string",
  "email": "string",
  "mobile": "string",
  "message": "string",
  "sourcePage": "string",
  "inquiryType": "contact",
  "status": "new | contacted | closed",
  "createdAt": "timestamp"
}
```

### `blog_comments`

Written/read by:
- `frontend/app/api/comments/route.ts`
- `frontend/lib/blog/getCommentCounts.ts`

Schema:
```json
{
  "postSlug": "string",
  "name": "string",
  "email": "string",
  "mobile": "string",
  "comment": "string",
  "status": "pending | visible | hidden",
  "createdAt": "timestamp"
}
```

Moderation behavior:
- New comments are now stored as `status: "pending"`.
- Public API responses only return comments with `status: "visible"`.

### `blog_leads`

Written by:
- `frontend/app/api/leads/route.ts`

Schema:
```json
{
  "name": "string",
  "email": "string",
  "mobile": "string",
  "sourcePage": "string",
  "createdAt": "timestamp"
}
```

## Optional future collections

- `users`
- `newsletter_subscribers`
- `demo_requests`

These are optional and not required by the current codebase.

## Firebase connection in this repo

- Shared Firestore init: `frontend/app/api/_firestore.ts`
- Validation helpers for API input: `frontend/app/api/_validation.ts`

## Environment variables

Set these in `frontend/.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

For server-side API routes, also set Firebase Admin credentials:

```env
# Option 1 (recommended): full JSON service account
FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON=

# Option 2: split values
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

Also set all values in Netlify (or your deploy platform).

## Beginner setup steps

1. Create a Firebase project in Firebase Console.
2. Create Firestore Database in production mode.
3. Choose a region close to your users.
4. Create a Web App in Project Settings.
5. Copy Firebase config values into `frontend/.env.local`.
6. Run locally:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
7. Submit one contact form, one blog comment, and one lead form.
8. Firestore will auto-create:
   - `contact_submissions`
   - `blog_comments`
   - `blog_leads`

You do not need to pre-create collections manually.

## Firestore index

Create this composite index for comments:

- Collection: `blog_comments`
- Fields:
  - `postSlug` ascending
  - `status` ascending
  - `createdAt` descending

Starter config file:
- `frontend/firebase/firestore.indexes.json`

## Firestore security rules

Because writes happen through Next.js API routes, keep direct client writes locked down.

Starter rules file:
- `frontend/firebase/firestore.rules`

Default starter policy blocks direct browser reads/writes for website collections.
If you later need direct browser reads, update rules carefully.

## Troubleshooting

If blog comment submission fails with `Unable to submit comment. Please try again.`:

1. Confirm Firebase Admin env variables are present in deployment.
2. Confirm `FIREBASE_ADMIN_PRIVATE_KEY` keeps newlines (or use `FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON`).
3. Confirm Firestore database is created in the same Firebase project id.
4. Redeploy after updating env variables.

## Apply rules and indexes (optional but recommended)

If you use Firebase CLI, from the `frontend` directory:

```bash
firebase login
firebase use <your-firebase-project-id>
firebase deploy --only firestore:rules --project <your-firebase-project-id>
firebase deploy --only firestore:indexes --project <your-firebase-project-id>
```
