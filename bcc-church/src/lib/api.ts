import type {
  BlogPost,
  InsertContactMessage,
  InsertGivingRecord,
} from "@/lib/schemas";

/**
 * Centralized API integration for the standalone bccc-backend
 * (Node + Express + Prisma + Postgres).
 *
 * Backend contract (see bccc-backend/src/routes):
 *   GET    /healthz
 *   GET    /healthz/db
 *   GET    /api/blog/posts?limit=
 *   GET    /api/blog/posts/:id
 *   GET    /api/blog/categories/:category
 *   POST   /api/contact
 *   GET    /api/contact/messages
 *   POST   /api/giving              -> triggers M-Pesa STK push
 *   GET    /api/giving/records
 *   GET    /api/giving/records/:id/status
 *   GET    /api/mpesa/status/:id    -> live Daraja query (fallback when callback is late)
 *   POST   /api/mpesa/callback      -> called by Safaricom, NOT by the frontend
 *
 * Base URL comes from VITE_API_URL. Leave it empty for same-origin
 * (Vite dev proxy or same-host deploy), or set it to the Render URL, e.g.
 * VITE_API_URL=https://bccc-backend.onrender.com
 */

export const API_BASE = (import.meta.env.VITE_API_URL as string | undefined ?? "").replace(/\/$/, "");

function url(path: string): string {
  return `${API_BASE}${path}`;
}

async function throwIfResNotOk(res: Response): Promise<void> {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url(path), {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  await throwIfResNotOk(res);
  // 204 / empty body guard
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

/* ---------- endpoint path builders (pure, testable) ---------- */

export const Endpoints = {
  health: "/healthz",
  healthDb: "/healthz/db",
  blogPosts: (limit?: number) =>
    limit !== undefined ? `/api/blog/posts?limit=${limit}` : "/api/blog/posts",
  blogPost: (id: string) => `/api/blog/posts/${encodeURIComponent(id)}`,
  blogByCategory: (category: string) =>
    `/api/blog/categories/${encodeURIComponent(category)}`,
  contactCreate: "/api/contact",
  contactMessages: "/api/contact/messages",
  givingCreate: "/api/giving",
  givingRecords: "/api/giving/records",
  givingStatus: (id: string) =>
    `/api/giving/records/${encodeURIComponent(id)}/status`,
  mpesaStatus: (givingId: string) =>
    `/api/mpesa/status/${encodeURIComponent(givingId)}`,
} as const;

/* ---------- typed API functions ---------- */

export interface GivingCreateResponse {
  message: string;
  id: string;
  transactionId?: string;
  checkoutRequestId?: string;
  phone?: string;
  instructions?: string;
}

export interface GivingStatusResponse {
  status: string;
  transactionId?: string | null;
}

export interface MpesaStatusResponse {
  status: string;
  transactionId?: string | null;
  mpesaStatus?: unknown;
  message?: string;
}

export interface ContactCreateResponse {
  message: string;
  id: string;
}

export const api = {
  health: () => request<{ ok: boolean }>(Endpoints.health),
  healthDb: () => request<{ ok: boolean; db: string }>(Endpoints.healthDb),

  getBlogPosts: (limit?: number) =>
    request<BlogPost[]>(Endpoints.blogPosts(limit)),
  getBlogPost: (id: string) => request<BlogPost>(Endpoints.blogPost(id)),
  getBlogPostsByCategory: (category: string) =>
    request<BlogPost[]>(Endpoints.blogByCategory(category)),

  createContactMessage: (data: InsertContactMessage) =>
    request<ContactCreateResponse>(Endpoints.contactCreate, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createGivingRecord: (data: InsertGivingRecord) =>
    request<GivingCreateResponse>(Endpoints.givingCreate, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getGivingStatus: (id: string) =>
    request<GivingStatusResponse>(Endpoints.givingStatus(id)),
  queryMpesaStatus: (givingId: string) =>
    request<MpesaStatusResponse>(Endpoints.mpesaStatus(givingId)),
};
