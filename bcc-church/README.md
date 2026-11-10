# BCC Church — Frontend

React + Vite + Tailwind frontend for Beautiful Courts Christian Church.
This repo is **frontend-only**. The API lives in the standalone
[`bccc-backend`](../bccc-backend) project (Node + Express + Prisma + Postgres).

## Setup

```bash
cd bcc-church
npm install
cp .env.example .env   # set VITE_API_URL
npm run dev
```

## Environment

| Variable       | Purpose                                              |
| -------------- | ---------------------------------------------------- |
| `VITE_API_URL` | Base URL of `bccc-backend`. Empty = same-origin (dev proxy). |

Local dev proxies `/api` and `/healthz` to `http://localhost:3001`
(see `vite.config.ts`). Production (live):

```
VITE_API_URL=https://bccc-website-backend.onrender.com
```

## API integration

All backend access goes through `src/lib/api.ts`:

- `GET /healthz`, `GET /healthz/db`
- `GET /api/blog/posts?limit=`, `GET /api/blog/posts/:id`, `GET /api/blog/categories/:category`
- `POST /api/contact`, `GET /api/contact/messages`
- `POST /api/giving` (triggers M-Pesa STK push), `GET /api/giving/records`, `GET /api/giving/records/:id/status`
- `GET /api/mpesa/status/:id` (live Daraja query when the callback is delayed)
- `POST /api/mpesa/callback` is Safaricom → backend only, never called from the frontend

`src/utilities/Endpoints.ts` re-exports the same endpoint builders.
`src/lib/queryClient.ts` prefixes every `apiRequest` / query key with `VITE_API_URL`.

## Scripts

| Script        | What it does                          |
| ------------- | ------------------------------------- |
| `npm run dev` | Start Vite dev server                 |
| `npm run build` | Production build to `dist/`         |
| `npm run preview` | Preview the production build      |
| `npm run check` | Typecheck (`tsc -p tsconfig.app.json`) |

## Deploy

Static build (`dist/`) + `VITE_API_URL` pointing at the backend.
Cloudflare Pages/Workers config lives in `wrangler.jsonc`.
