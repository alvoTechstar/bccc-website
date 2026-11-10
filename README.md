# bccc-website (frontend-only)

Frontend for Beautiful Courts Christian Church — lives in [`bcc-church/`](bcc-church/).

The old in-repo `server/` (Express + Mongo) has been removed. The API now lives in
the standalone **`bccc-backend`** project (sibling folder, Node + Express + Prisma + Postgres).

```
bccc/
├── bccc-website/   # this repo — frontend only
│   └── bcc-church/ # React + Vite app, API client in src/lib/api.ts
└── bccc-backend/   # standalone API
```

Point the frontend at the backend with `VITE_API_URL` (see `bcc-church/.env.example`).
