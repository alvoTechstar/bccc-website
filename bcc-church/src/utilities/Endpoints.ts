import type {
  BlogPost,
  InsertContactMessage,
  InsertGivingRecord,
} from "@/lib/schemas";

/**
 * SINGLE HOME for the backend base URL + every endpoint path,
 * plus the typed fetch helpers (`request`, `adminRequest`, `api`).
 *
 * Everything else imports from here (directly, or via the
 * "@/lib/api" barrel which re-exports this module). Do NOT define
 * another base URL anywhere else.
 *
 * Base URL comes from VITE_API_URL. Leave it empty for same-origin
 * (Vite dev proxy or same-host deploy), or set it to the Render URL, e.g.
 * VITE_API_URL=https://bccc-backend.onrender.com
 *
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
 *   POST   /api/blog/posts/sync/facebook -> admin-triggered Facebook sync
 *          (send SYNC_SECRET as `x-sync-secret` when the backend sets one)
 *   POST   /api/newsletter/subscribe    -> newsletter signup (welcome email)
 *   GET    /api/newsletter/subscribers  -> list (admin)
 *   POST /api/admin/login, /api/admin/invite/accept (public)
 *   POST /api/admin/forgot-password -> 6-digit OTP email (public)
 *   POST /api/admin/resend-reset-otp, /api/admin/verify-reset-otp -> resetToken (public)
 *   POST /api/admin/reset-password (public, exchanges resetToken)
 *   GET  /api/admin/me, /api/admin/users (auth)
 *   POST   /api/admin/users, PUT/DELETE /api/admin/users/:id,
 *   PATCH  /api/admin/users/:id/status, POST .../resend-invite (superadmin)
 */

export const BASE_URL = (
  (import.meta.env.VITE_API_URL as string | undefined) ??
  // Fallback so production works even if VITE_API_URL wasn't set at build
  // time (e.g. Cloudflare Pages dashboard env missing). Explicit env wins.
  "http://localhost:3001"
).replace(/\/$/, "");

/** Join a path onto the single base URL (accepts "/api/..." or full URLs). */
export function buildUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${normalized}`;
}

/**
 * Resolve a backend file URL for display. Uploads come back as relative
 * paths ("/uploads/...") — prefix the API base; absolute URLs pass through.
 */
export function resolveUploadUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url) || url.startsWith("data:")) return url;
  return buildUrl(url.startsWith("/") ? url : `/${url}`);
}

async function throwIfResNotOk(res: Response): Promise<void> {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(buildUrl(path), {
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
  facebookSync: (limit?: number) =>
    limit !== undefined
      ? `/api/blog/posts/sync/facebook?limit=${limit}`
      : "/api/blog/posts/sync/facebook",
  newsletterSubscribe: "/api/newsletter/subscribe",
  newsletterSubscribers: "/api/newsletter/subscribers",
  adminLogin: "/api/admin/login",
  adminVerifyLoginOtp: "/api/admin/verify-login-otp",
  adminResendLoginOtp: "/api/admin/resend-login-otp",
  adminMe: "/api/admin/me",
  adminEmailStatus: "/api/admin/email-status",
  adminUsers: "/api/admin/users",
  adminUserDetail: (id: string) => `/api/admin/users/${encodeURIComponent(id)}`,
  adminUserStatus: (id: string) =>
    `/api/admin/users/${encodeURIComponent(id)}/status`,
  adminResendInvite: (id: string) =>
    `/api/admin/users/${encodeURIComponent(id)}/resend-invite`,
  adminForgotPassword: "/api/admin/forgot-password",
  adminResendResetOtp: "/api/admin/resend-reset-otp",
  adminVerifyResetOtp: "/api/admin/verify-reset-otp",
  adminResetPassword: "/api/admin/reset-password",
  adminAcceptInvite: "/api/admin/invite/accept",
  blogCreate: "/api/blog/posts",
  blogUpdate: (id: string) => `/api/blog/posts/${encodeURIComponent(id)}`,
  blogDelete: (id: string) => `/api/blog/posts/${encodeURIComponent(id)}`,
  events: "/api/events",
  eventDetail: (id: string) => `/api/events/${encodeURIComponent(id)}`,
  mediaPublish: "/api/media/publish",
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

export interface NewsletterSubscribeResponse {
  message: string;
  id: string;
  created: boolean;
}

/* ---------- admin auth (backend is source of truth when reachable) ---------- */

const ADMIN_TOKEN_KEY = "bcc_admin_token";

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

/** Fired when the backend rejects our token — auth layer listens and signs out. */
export const ADMIN_UNAUTHORIZED_EVENT = "bcc:admin-unauthorized";

function notifyUnauthorized() {
  clearAdminToken();
  window.dispatchEvent(new Event(ADMIN_UNAUTHORIZED_EVENT));
}

export type BackendAdminRole = "superadmin" | "admin";

export interface BackendAdminUser {
  id: string;
  name: string;
  email: string;
  role: BackendAdminRole;
  active: boolean;
  mustSetPassword: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
}

export interface AdminLoginResponse {
  message: string;
  token: string;
  user: BackendAdminUser;
}

export interface AdminCreateResponse {
  message: string;
  user: BackendAdminUser;
  emailSent: boolean;
}

/** Backend request with the admin Bearer token. Throws on HTTP errors. */
export async function adminRequest<T>(
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getAdminToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(buildUrl(path), {
    credentials: "include",
    method: init?.method ?? "GET",
    headers,
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
  if (res.status === 401) notifyUnauthorized();
  await throwIfResNotOk(res);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

/** True for transport failures (backend asleep / offline) — safe to fall back locally. */
export function isNetworkError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  // Our HTTP errors are shaped as "404: ..." / "500: ..." — anything else is transport.
  return !/^\d{3}:/.test(msg);
}

/** Admin multipart POST/PUT — FormData with the Bearer token, no JSON header. */
export async function adminForm<T>(
  path: string,
  form: FormData,
  init?: { method?: string },
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getAdminToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(buildUrl(path), {
    credentials: "include",
    method: init?.method ?? "POST",
    headers,
    body: form,
  });
  if (res.status === 401) notifyUnauthorized();
  await throwIfResNotOk(res);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

/** Build FormData for blog/event writes: text fields + new files + keep list. */
function writeForm(
  data: Record<string, unknown>,
  files: File[] | undefined,
  keepImages: string[] | undefined,
): FormData {
  const form = new FormData();
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null) continue;
    form.append(k, typeof v === "boolean" ? String(v) : String(v));
  }
  if (keepImages !== undefined) form.append("keepImages", JSON.stringify(keepImages));
  (files ?? []).forEach((f) => form.append("images", f));
  return form;
}

export interface GivingRecord {
  id: string;
  amount: number | string;
  givingType: string;
  phoneNumber: string;
  email?: string | null;
  message?: string | null;
  transactionId?: string | null;
  status: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  newsletter: boolean;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string | null;
  source?: string | null;
  createdAt: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string | null;
  venue?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  images?: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostInput {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  imageUrl?: string;
  /** New uploads (multipart) — appended to keepImages on save. */
  images?: File[];
  /** Existing image URLs to keep on update. */
  keepImages?: string[];
  published?: boolean;
}

export interface EventInput {
  title: string;
  description: string;
  date: string;
  time?: string;
  venue?: string;
  category?: string;
  imageUrl?: string;
  /** New uploads (multipart) — appended to keepImages on save. */
  images?: File[];
  /** Existing image URLs to keep on update. */
  keepImages?: string[];
  published?: boolean;
}

export type PublishTarget = "facebook" | "instagram" | "tiktok";

export interface PublishMediaResponse {
  message: string;
  files: string[];
  results: Record<
    string,
    { ok: boolean; id?: string; url?: string; error?: string; message?: string }
  >;
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

  /**
   * Admin-triggered Facebook -> blog sync. Only works if the backend has
   * FACEBOOK_PAGE_ID + FACEBOOK_PAGE_ACCESS_TOKEN set. Pass the SYNC_SECRET
   * when the backend requires it.
   */
  syncFacebookPosts: (limit?: number, syncSecret?: string) =>
    request<{
      message: string;
      fetched: number;
      created: number;
      updated: number;
    }>(Endpoints.facebookSync(limit), {
      method: "POST",
      ...(syncSecret ? { headers: { "x-sync-secret": syncSecret } } : {}),
    }),

  subscribeNewsletter: (data: {
    email: string;
    name?: string;
    source?: string;
  }) =>
    request<NewsletterSubscribeResponse>(Endpoints.newsletterSubscribe, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /* ---------- backend admin accounts ---------- */

  adminLogin: (data: { email: string; password: string }) =>
    request<{
      success: boolean;
      requiresOTP?: boolean;
      message: string;
      devMode?: boolean;
      otp?: string;
      otpMasked?: string;
    }>(Endpoints.adminLogin, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  adminVerifyLoginOtp: (data: { email: string; otp: string }) =>
    request<AdminLoginResponse>(Endpoints.adminVerifyLoginOtp, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  adminResendLoginOtp: (data: { email: string }) =>
    request<{
      success: boolean;
      message: string;
      devMode?: boolean;
      otp?: string;
    }>(Endpoints.adminResendLoginOtp, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  adminMe: () => adminRequest<BackendAdminUser>(Endpoints.adminMe),
  adminEmailStatus: () =>
    adminRequest<{
      configured: boolean;
      host: string;
      port: number;
      userSet: boolean;
      passSet: boolean;
      from: string;
      verified: boolean;
      error?: string;
    }>(Endpoints.adminEmailStatus),
  adminListUsers: () => adminRequest<BackendAdminUser[]>(Endpoints.adminUsers),
  adminCreateUser: (data: {
    name: string;
    email: string;
    role: BackendAdminRole;
  }) =>
    adminRequest<AdminCreateResponse>(Endpoints.adminUsers, {
      method: "POST",
      body: data,
    }),
  adminUpdateUser: (
    id: string,
    data: { name?: string; role?: BackendAdminRole },
  ) =>
    adminRequest<{ message: string; user: BackendAdminUser }>(
      Endpoints.adminUserDetail(id),
      {
        method: "PUT",
        body: data,
      },
    ),
  adminSetUserStatus: (id: string, active: boolean) =>
    adminRequest<{ message: string; user: BackendAdminUser }>(
      Endpoints.adminUserStatus(id),
      {
        method: "PATCH",
        body: { active },
      },
    ),
  adminResendInvite: (id: string) =>
    adminRequest<{
      message: string;
      user: BackendAdminUser;
      emailSent: boolean;
    }>(Endpoints.adminResendInvite(id), { method: "POST" }),
  adminDeleteUser: (id: string) =>
    adminRequest<{ message: string }>(Endpoints.adminUserDetail(id), {
      method: "DELETE",
    }),
  adminAcceptInvite: (data: {
    token: string;
    password: string;
    confirmPassword: string;
  }) =>
    request<{ message: string; user: BackendAdminUser }>(
      Endpoints.adminAcceptInvite,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    ),
  adminForgotPassword: (data: { email: string }) =>
    request<{
      success: boolean;
      message: string;
      emailSent?: boolean;
      devMode?: boolean;
      otp?: string;
      otpMasked?: string;
    }>(Endpoints.adminForgotPassword, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  adminResendResetOtp: (data: { email: string }) =>
    request<{
      success: boolean;
      message: string;
      devMode?: boolean;
      otp?: string;
      otpMasked?: string;
    }>(Endpoints.adminResendResetOtp, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  adminVerifyResetOtp: (data: { email: string; otp: string }) =>
    request<{ success: boolean; message: string; resetToken: string }>(
      Endpoints.adminVerifyResetOtp,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    ),
  adminResetPassword: (data: {
    resetToken: string;
    newPassword: string;
    confirmPassword: string;
  }) =>
    request<{ success: boolean; message: string }>(Endpoints.adminResetPassword, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /* ---------- admin reads ---------- */

  getGivingRecords: () => request<GivingRecord[]>(Endpoints.givingRecords),
  getContactMessages: () =>
    request<ContactMessage[]>(Endpoints.contactMessages),
  getNewsletterSubscribers: () =>
    request<NewsletterSubscriber[]>(Endpoints.newsletterSubscribers),

  /* ---------- admin blog CRUD (multipart, admin token) ---------- */

  createBlogPost: (data: BlogPostInput) => {
    const { images, keepImages, ...fields } = data;
    return adminForm<BlogPost>(
      Endpoints.blogCreate,
      writeForm(fields, images, keepImages),
      { method: "POST" },
    );
  },
  updateBlogPost: (id: string, data: Partial<BlogPostInput>) => {
    const { images, keepImages, ...fields } = data;
    return adminForm<BlogPost>(
      Endpoints.blogUpdate(id),
      writeForm(fields, images, keepImages),
      { method: "PUT" },
    );
  },
  deleteBlogPost: (id: string) =>
    adminRequest<{ message: string }>(Endpoints.blogDelete(id), {
      method: "DELETE",
    }),

  /* ---------- admin events CRUD (multipart, admin token) ---------- */

  getEvents: () => request<ChurchEvent[]>(Endpoints.events),
  createEvent: (data: EventInput) => {
    const { images, keepImages, ...fields } = data;
    return adminForm<ChurchEvent>(
      Endpoints.events,
      writeForm(fields, images, keepImages),
      { method: "POST" },
    );
  },
  updateEvent: (id: string, data: Partial<EventInput>) => {
    const { images, keepImages, ...fields } = data;
    return adminForm<ChurchEvent>(
      Endpoints.eventDetail(id),
      writeForm(fields, images, keepImages),
      { method: "PUT" },
    );
  },
  deleteEvent: (id: string) =>
    adminRequest<{ message: string }>(Endpoints.eventDetail(id), {
      method: "DELETE",
    }),

  /* ---------- media-team publisher (multipart, admin token) ---------- */

  publishMedia: (caption: string, files: File[], targets: PublishTarget[]) => {
    const form = new FormData();
    form.append("caption", caption);
    form.append("targets", JSON.stringify(targets));
    files.forEach((f) => form.append("files", f));
    return adminForm<PublishMediaResponse>(Endpoints.mediaPublish, form, {
      method: "POST",
    });
  },
};
