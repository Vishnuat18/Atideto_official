# ATIDETO Technologies — Internship Management System

Official Atideto website with a complete internship management + certificate verification system.

## Overview

The system manages the full internship lifecycle:

```
Candidate → Website form → Express backend → MongoDB → Application ID
    → Candidate email + Admin 1 email + Admin 2 email (SMTP)
    → Admin login → Dashboard → Status updates
    → Internship completed → Certificate generation (PDF + QR)
    → Public verification page → VALID / REVOKED / NOT FOUND
```

## Repositories / Projects

There are two separate projects:

| Project | Purpose |
|---|---|
| `Atideto_official/` | Public website (Vite + React) + main API (Express + Prisma/MongoDB) + admin dashboard + email + certificate integration |
| `certificate-system/` | Standalone certificate generator: `service/` (Puppeteer PDF/QR engine), `backend/` (Express + Firebase API on port 4000), `frontend/` (preview app) |

The certificate generator stays a separate service and is called over HTTP by the main backend.

## Architecture

```
Browser (Vite SPA on :8080)
   │  /api (dev proxy → :5000)
   ▼
Main Backend (Express on :5000) ── Prisma ──► MongoDB Atlas
   │  POST /api/internships/apply
   │  POST /api/admin/certificates/generate   (x-api-key + inline student data)
   ▼
Certificate-System Backend (Express on :4000)
   ├── Puppeteer (PDF + PNG rendering)
   ├── qrcode (QR with verification URL)
   └── Firebase Storage (PDFs) / Firestore (records)
          (falls back to local JSON + base64 data URLs)
```

- Application statuses: `RECEIVED → UNDER_REVIEW → SELECTED → COMPLETED → CERTIFICATE_GENERATED` (`REJECTED` possible earlier; `CERTIFICATE_GENERATED` is terminal).
- Certificates can only be generated for applications with status `COMPLETED` (enforced server-side).
- Duplicate certificate generation is blocked (Mongo + service checks).
- Revocation keeps the record and flips status to `revoked`.

## Prerequisites

- Node.js 18+ (tested on Node 24)
- MongoDB Atlas connection string
- Gmail app password (or any SMTP credentials) for email
- (Optional) Google service account for the certificate-system (`service-account.json`)

## Setup

### 1. Main backend

```sh
cd Atideto_official/backend
cp .env.example .env        # fill in real values
npm install
npx prisma generate
npx prisma db push          # sync indexes to MongoDB (non-destructive)
npx tsc                     # build to dist/
npm start                   # runs node dist/index.js on :5000
```

### 2. Frontend

```sh
cd Atideto_official
cp .env.example .env.local # optional; leave VITE_API_URL empty in dev
npm install
npm run dev                 # Vite on :8080, proxies /api → :5000
```

### 3. Certificate-system

```sh
cd certificate-system/backend
cp .env.example .env        # set API_KEY to match CERTIFICATE_SERVICE_SECRET
npm install                 # also links @atideto/certificate-service
npm start                   # node src/index.js on :4000
```

The main backend's `CERTIFICATE_SERVICE_SECRET` must equal the certificate-system backend's `API_KEY`.

### 4. Admin accounts

Create an admin through the backend seed script (see `backend/src/scripts/`), or reuse existing seeded accounts. Passwords are bcrypt-hashed; never hardcode credentials.

## Environment Variables

### Backend (`Atideto_official/backend/.env`)

```
DATABASE_URL            MongoDB connection string
SMTP_HOST / SMTP_PORT / SMTP_SECURE / SMTP_USER / SMTP_PASSWORD
ADMIN_EMAIL_1 / ADMIN_EMAIL_2 / REPLY_TO_EMAIL
JWT_SECRET / JWT_EXPIRES_IN / COOKIE_SECRET
FRONTEND_URL            CORS + admin email link origin
ADMIN_DASHBOARD_URL     Optional: deep link for admin emails
EMAIL_LOGO_URL          Absolute HTTPS logo URL for emails
CERTIFICATE_SERVICE_URL   http://localhost:4000
CERTIFICATE_SERVICE_SECRET  Must match certificate-system API_KEY
PUBLIC_VERIFICATION_URL   https://atideto.in/verify (baked into QR codes)
```

### Frontend (`Atideto_official/.env`)

```
VITE_API_URL            Production backend origin (empty in dev → Vite proxy)
VITE_FIREBASE_*         Public client Firebase config (optional)
```

### Certificate-system (`certificate-system/backend/.env`)

```
PORT=4000
API_KEY                 Shared secret with the main backend
FIREBASE_SERVICE_ACCOUNT_PATH=./service-account.json
VERIFICATION_BASE_URL   Fallback verify base URL (overridden by request)
```

## Email Templates

- **Candidate**: "Thank You for Your Registration" — premium light-theme HTML with logo, application summary, next steps.
- **Admins (both)**: "New Student Registered — {name}" — basic candidate details only (name, email, mobile, college, department) + View Application button.
- Reply-To: admin notifications reply to the candidate; candidate replies route to `REPLY_TO_EMAIL`.

## Running the E2E Workflow

1. Submit a test application via `POST /api/internships/apply`.
2. Login to the admin dashboard (`/admin`).
3. Move status to `COMPLETED`.
4. Generate the certificate (PDF + QR with verification URL).
5. Open the verification URL — expect `VALID`.
6. Revoke from the admin certificate list — re-verify — expect `REVOKED`.

All 18 E2E checks currently pass (apply, auth 401, CSRF 403, transitions, generation, valid/revoked verification, duplicate blocking, invalid ID 404).

## Deployment Notes

- Frontend: static build (`npm run build`) on any static host; use `VITE_API_URL` for the API origin.
- Main backend: Node process (Vercel/Render/Railway/VM). Needs a persistent MongoDB connection and outbound SMTP.
- Certificate-system: Node process with Puppeteer/Chrome — a container or VM with Chrome is required (not a cold serverless function).
- **Firebase must be enabled in the `atideto-certificate` GCP project** (Firestore + Storage bucket) so PDFs are stored as objects instead of base64 data URLs.
- HTTPS is required in production (cookies are `secure` + `sameSite=strict`).

## Backup

> **BACKUP NOT CONFIGURED.** MongoDB Atlas backups and Firestore/Storage export should be enabled before production. Applications, admins, certificates and audit logs are the critical data sets.

## Security Notes

- Passwords hashed (bcrypt); JWT in HttpOnly signed cookie + CSRF double-submit cookie.
- Rate limiting on login and application submission (IP-based, no spoofable `x-forwarded-for`).
- CORS whitelist + Helmet headers; centralized error handler hides internals.
- All admin APIs require auth; certificate generation requires status `COMPLETED`.
- User input is escaped in emails; no private data exposed on the public verify page.

## Troubleshooting

- **Certificates generate but `pdfUrl` is `data:...`** — Firebase Storage bucket missing/disabled; enable it or set the bucket.
- **Emails not sending** — check `SMTP_*` vars; Gmail requires an app password, not the account password.
- **Certificate generation times out** — cold Puppeteer start can take ~20–40s; the service uses a 60s navigation timeout.
- **`Cannot find package @atideto/certificate-service`** — run `npm install` inside `certificate-system/backend`.
