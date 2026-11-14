import { useCallback, useEffect, useState } from "react";
import {
  api,
  clearAdminToken,
  isNetworkError,
  setAdminToken,
  type BackendAdminUser,
  type BackendAdminRole,
} from "./api";

/**
 * Admin accounts — backend is the source of truth when reachable
 * (invite emails can only be sent by the backend). When the backend is
 * unreachable (cold start / offline), everything falls back to the
 * browser-local store so the console keeps working on this device.
 *
 * Backend endpoints (bccc-backend/src/routes/admin.routes.ts):
 *   POST /api/admin/login, POST /api/admin/invite/accept (public)
 *   GET  /api/admin/me, GET /api/admin/users
 *   POST /api/admin/users, PUT /api/admin/users/:id,
 *   PATCH /api/admin/users/:id/status,
 *   POST /api/admin/users/:id/resend-invite, DELETE /api/admin/users/:id
 */

export type AdminRole = "superadmin" | "admin";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
  mustSetPassword: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export type UserResult = {
  ok: boolean;
  user?: AdminUser;
  error?: string;
  /** Backend mode: was the invite email delivered? */
  emailSent?: boolean;
  /** True when the op ran against the local fallback (backend unreachable). */
  offline?: boolean;
};

const USERS_KEY = "bcc_admin_users_v1";
const LEGACY_SESSION_KEY = "bcc_admin_session";

const DEFAULT_EMAIL = (
  (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.trim().toLowerCase() ||
  "admin@bccchurch.co.ke"
);
const ENV_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined)?.trim();
const DEFAULT_PASSWORD = ENV_PASSWORD && ENV_PASSWORD.length > 0 ? ENV_PASSWORD : "bcc-admin-2026";

export const roleLabel = (role: AdminRole) => (role === "superadmin" ? "Super Admin" : "Admin");
export const userInitials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "A";

function fromBackend(u: BackendAdminUser): AdminUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    active: u.active,
    mustSetPassword: u.mustSetPassword,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    ...(u.lastLoginAt ? { lastLoginAt: u.lastLoginAt } : {}),
  };
}

const toBackendRole = (r: AdminRole): BackendAdminRole => r;

/* ------------------------------------------------------------------ */
/* Local fallback store (same as before — browser-only safety net)     */
/* ------------------------------------------------------------------ */

interface LocalAdminUser extends AdminUser {
  passwordHash: string;
  salt: string;
}

function randomSalt(): string {
  try {
    return [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

async function sha256Hex(text: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (subtle) {
    const digest = await subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `fnv1a-${h.toString(16)}`;
}

const hashPassword = (password: string, salt: string) => sha256Hex(`${salt}:${password}`);

function readLocalUsers(): LocalAdminUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalAdminUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalUsers(users: LocalAdminUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function stripLocal(u: LocalAdminUser): AdminUser {
  const { passwordHash: _ph, salt: _s, ...rest } = u;
  return rest;
}

export function ensureLocalSeeded(): LocalAdminUser[] {
  let users = readLocalUsers();
  if (users.length === 0) {
    const now = new Date().toISOString();
    const salt = randomSalt();
    users = [
      {
        id: `seed-${Date.now()}`,
        name: "Church Administrator",
        email: DEFAULT_EMAIL,
        role: "superadmin",
        active: true,
        mustSetPassword: !ENV_PASSWORD,
        passwordHash: "",
        salt,
        createdAt: now,
        updatedAt: now,
      },
    ];
    writeLocalUsers(users);
    void hashPassword(DEFAULT_PASSWORD, salt).then((h) => {
      const current = readLocalUsers();
      const seeded = current.find((u) => u.passwordHash === "");
      if (seeded) {
        seeded.passwordHash = h;
        seeded.updatedAt = new Date().toISOString();
        writeLocalUsers(current);
      }
    });
  }
  return users;
}

function listLocalUsers(): AdminUser[] {
  return ensureLocalSeeded()
    .map(stripLocal)
    .slice()
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

async function verifyLocalCredentials(email: string, password: string): Promise<AdminUser | null> {
  const users = ensureLocalSeeded();
  const user = users.find((u) => u.email === email.trim().toLowerCase());
  if (!user || !user.active || !user.passwordHash) return null;
  const hash = await hashPassword(password, user.salt);
  if (hash !== user.passwordHash) return null;
  user.lastLoginAt = new Date().toISOString();
  writeLocalUsers(users);
  return stripLocal(user);
}

export function defaultCredentialsInUse(): boolean {
  return readLocalUsers().some((u) => u.active && u.role === "superadmin" && (u as LocalAdminUser).mustSetPassword);
}

export function consumeLegacySession(): string | null {
  try {
    const raw = localStorage.getItem(LEGACY_SESSION_KEY);
    if (!raw) return null;
    localStorage.removeItem(LEGACY_SESSION_KEY);
    const users = readLocalUsers();
    const seed = users.find((u) => u.role === "superadmin" && u.active);
    return seed ? seed.id : null;
  } catch {
    return null;
  }
}

export function getLocalUser(id: string): AdminUser | null {
  const u = readLocalUsers().find((x) => x.id === id);
  return u ? stripLocal(u) : null;
}

/* ------------------------------------------------------------------ */
/* Backend-first operations                                            */
/* ------------------------------------------------------------------ */

export interface LoginStartResult {
  ok: boolean;
  /** Backend step-1 done: OTP emailed, verify next. */
  requiresOTP?: boolean;
  /** Offline fallback: signed in directly with the local store. */
  user?: AdminUser;
  offline?: boolean;
  devOtp?: string;
  devMode?: boolean;
  error?: string;
}

/**
 * Login step 1 (biztrack parity): password check -> 6-digit OTP emailed.
 * Offline: falls back to the local store and signs in directly.
 */
export async function startLogin(email: string, password: string): Promise<LoginStartResult> {
  const cleanEmail = email.trim();
  try {
    const res = await api.adminLogin({ email: cleanEmail, password });
    return { ok: true, requiresOTP: true, devOtp: res.otp, devMode: res.devMode };
  } catch (e) {
    // Real rejection (wrong password / deactivated / throttled) — do NOT fall back.
    if (!isNetworkError(e)) {
      return { ok: false, error: e instanceof Error ? e.message.replace(/^\d{3}:\s*/, "") : "Sign in failed." };
    }
    clearAdminToken();
    const user = await verifyLocalCredentials(cleanEmail, password);
    if (!user) return { ok: false, error: "Wrong email or password, or the account is deactivated." };
    return { ok: true, user, offline: true };
  }
}

/** Login step 2: verify the emailed code -> session token. */
export async function verifyLoginOtp(
  email: string,
  otp: string,
): Promise<{ ok: boolean; user?: AdminUser; error?: string }> {
  try {
    const res = await api.adminVerifyLoginOtp({ email: email.trim(), otp: otp.trim() });
    setAdminToken(res.token);
    return { ok: true, user: fromBackend(res.user) };
  } catch (e) {
    return {
      ok: false,
      error: isNetworkError(e)
        ? "Backend unreachable — check your connection and try again."
        : e instanceof Error
          ? e.message.replace(/^\d{3}:\s*/, "")
          : "Code verification failed.",
    };
  }
}

/** Resend the login code. */
export async function resendLoginOtp(email: string): Promise<OtpRequestResult> {
  try {
    const res = await api.adminResendLoginOtp({ email: email.trim() });
    return { ok: true, message: res.message, devMode: res.devMode, devOtp: res.otp };
  } catch (e) {
    return { ok: false, error: cleanErr(e, "Failed to resend code.") };
  }
}

/** Legacy direct login — superseded by startLogin + verifyLoginOtp (kept for compat). */
export async function verifyCredentials(email: string, password: string): Promise<AdminUser | null> {
  return verifyLocalCredentials(email, password);
}

export async function listUsers(): Promise<{ users: AdminUser[]; online: boolean }> {
  try {
    const users = await api.adminListUsers();
    return { users: users.map(fromBackend), online: true };
  } catch (e) {
    if (!isNetworkError(e)) throw e;
    return { users: listLocalUsers(), online: false };
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createUser(input: {
  name: string;
  email: string;
  role: AdminRole;
  password?: string;
}): Promise<UserResult> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (!name) return { ok: false, error: "Name is required." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Enter a valid email address." };

  // Backend mode: invite email sets the password (biztrack-style).
  try {
    const res = await api.adminCreateUser({ name, email, role: toBackendRole(input.role) });
    return { ok: true, user: fromBackend(res.user), emailSent: res.emailSent, offline: false };
  } catch (e) {
    if (!isNetworkError(e)) {
      return { ok: false, error: e instanceof Error ? e.message.replace(/^\d{3}:\s*/, "") : "Failed to create admin." };
    }
  }

  // Offline fallback: local account with a directly-set password.
  if (!input.password || input.password.length < 8) {
    return { ok: false, error: "Backend unreachable — enter a temporary password (min 8) to create a local-only admin." };
  }
  const users = readLocalUsers();
  if (users.some((u) => u.email === email)) return { ok: false, error: "An admin with this email already exists on this device." };
  const now = new Date().toISOString();
  const salt = randomSalt();
  const user: LocalAdminUser = {
    id: `u-${Date.now()}`,
    name,
    email,
    role: input.role,
    active: true,
    mustSetPassword: false,
    passwordHash: await hashPassword(input.password, salt),
    salt,
    createdAt: now,
    updatedAt: now,
  };
  users.push(user);
  writeLocalUsers(users);
  return { ok: true, user: stripLocal(user), offline: true };
}

export async function updateUser(
  id: string,
  patch: { name?: string; role?: AdminRole },
  actorId: string
): Promise<UserResult> {
  if (patch.name !== undefined && !patch.name.trim()) return { ok: false, error: "Name is required." };
  try {
    const res = await api.adminUpdateUser(id, {
      ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
      ...(patch.role !== undefined ? { role: toBackendRole(patch.role) } : {}),
    });
    return { ok: true, user: fromBackend(res.user), offline: false };
  } catch (e) {
    if (!isNetworkError(e)) {
      return { ok: false, error: e instanceof Error ? e.message.replace(/^\d{3}:\s*/, "") : "Failed to update admin." };
    }
  }
  // Offline fallback.
  const users = readLocalUsers();
  const user = users.find((u) => u.id === id);
  if (!user) return { ok: false, error: "Admin not found." };
  if (patch.name !== undefined) user.name = patch.name.trim();
  if (patch.role !== undefined && patch.role !== user.role) {
    if (id === actorId && user.role === "superadmin" && patch.role === "admin") {
      const others = users.filter((u) => u.id !== id && u.role === "superadmin" && u.active);
      if (others.length === 0) return { ok: false, error: "You are the last Super Admin — promote someone else first." };
    }
    user.role = patch.role;
  }
  user.updatedAt = new Date().toISOString();
  writeLocalUsers(users);
  return { ok: true, user: stripLocal(user), offline: true };
}

export async function setUserActive(id: string, active: boolean, actorId: string): Promise<UserResult> {
  try {
    const res = await api.adminSetUserStatus(id, active);
    return { ok: true, user: fromBackend(res.user), offline: false };
  } catch (e) {
    if (!isNetworkError(e)) {
      return { ok: false, error: e instanceof Error ? e.message.replace(/^\d{3}:\s*/, "") : "Failed to update status." };
    }
  }
  const users = readLocalUsers();
  const user = users.find((u) => u.id === id);
  if (!user) return { ok: false, error: "Admin not found." };
  if (!active) {
    if (id === actorId) return { ok: false, error: "You cannot deactivate your own account." };
    if (user.role === "superadmin" && users.filter((u) => u.id !== id && u.role === "superadmin" && u.active).length === 0) {
      return { ok: false, error: "Cannot deactivate the last active Super Admin." };
    }
  }
  user.active = active;
  user.updatedAt = new Date().toISOString();
  writeLocalUsers(users);
  return { ok: true, user: stripLocal(user), offline: true };
}

export async function deleteUser(id: string, actorId: string): Promise<UserResult> {
  try {
    await api.adminDeleteUser(id);
    return { ok: true, offline: false };
  } catch (e) {
    if (!isNetworkError(e)) {
      return { ok: false, error: e instanceof Error ? e.message.replace(/^\d{3}:\s*/, "") : "Failed to delete admin." };
    }
  }
  const users = readLocalUsers();
  const user = users.find((u) => u.id === id);
  if (!user) return { ok: false, error: "Admin not found." };
  if (id === actorId) return { ok: false, error: "You cannot delete your own account." };
  if (user.role === "superadmin" && users.filter((u) => u.id !== id && u.role === "superadmin").length === 0) {
    return { ok: false, error: "Cannot delete the last Super Admin." };
  }
  writeLocalUsers(users.filter((u) => u.id !== id));
  return { ok: true, user: stripLocal(user), offline: true };
}

/** Backend only: resend the set-password invite email. */
export async function resendInvite(id: string): Promise<UserResult> {
  try {
    const res = await api.adminResendInvite(id);
    return { ok: true, user: fromBackend(res.user), emailSent: res.emailSent, offline: false };
  } catch (e) {
    return {
      ok: false,
      error: isNetworkError(e)
        ? "Backend unreachable — connect to resend the invite email."
        : e instanceof Error ? e.message.replace(/^\d{3}:\s*/, "") : "Failed to resend invite.",
    };
  }
}

/** Local only: directly set a password (used when the backend is unreachable). */
export async function resetUserPassword(id: string, newPassword: string): Promise<UserResult> {
  if (newPassword.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
  const users = readLocalUsers();
  const user = users.find((u) => u.id === id);
  if (!user) return { ok: false, error: "Admin not found." };
  user.salt = randomSalt();
  user.passwordHash = await hashPassword(newPassword, user.salt);
  user.updatedAt = new Date().toISOString();
  writeLocalUsers(users);
  return { ok: true, user: stripLocal(user), offline: true };
}

export async function acceptInvite(token: string, password: string, confirmPassword: string): Promise<UserResult> {
  try {
    const res = await api.adminAcceptInvite({ token, password, confirmPassword });
    return { ok: true, user: fromBackend(res.user) };
  } catch (e) {
    return {
      ok: false,
      error: isNetworkError(e)
        ? "Backend unreachable — check your connection and try again."
        : e instanceof Error ? e.message.replace(/^\d{3}:\s*/, "") : "Failed to set password.",
    };
  }
}

/* ---------- biztrack-style OTP self-service reset ---------- */

export interface OtpRequestResult {
  ok: boolean;
  message?: string;
  devMode?: boolean;
  devOtp?: string;
  error?: string;
}

const cleanErr = (e: unknown, fallback: string): string =>
  isNetworkError(e)
    ? "Backend unreachable — check your connection and try again."
    : e instanceof Error
      ? e.message.replace(/^\d{3}:\s*/, "")
      : fallback;

/** Step 1: request the 6-digit code (always generic — no enumeration). */
export async function requestPasswordResetOtp(email: string): Promise<OtpRequestResult> {
  try {
    const res = await api.adminForgotPassword({ email });
    return { ok: true, message: res.message, devMode: res.devMode, devOtp: res.otp };
  } catch (e) {
    return { ok: false, error: cleanErr(e, "Failed to send reset code.") };
  }
}

/** Step 1b: resend (issues a fresh code, revokes the old). */
export async function resendPasswordResetOtp(email: string): Promise<OtpRequestResult> {
  try {
    const res = await api.adminResendResetOtp({ email });
    return { ok: true, message: res.message, devMode: res.devMode, devOtp: res.otp };
  } catch (e) {
    return { ok: false, error: cleanErr(e, "Failed to resend code.") };
  }
}

/** Step 2: verify the code -> short-lived resetToken. */
export async function verifyPasswordResetOtp(
  email: string,
  otp: string,
): Promise<{ ok: boolean; resetToken?: string; error?: string }> {
  try {
    const res = await api.adminVerifyResetOtp({ email, otp });
    return { ok: true, resetToken: res.resetToken };
  } catch (e) {
    return { ok: false, error: cleanErr(e, "Code verification failed.") };
  }
}

/** Step 3: exchange the resetToken for a new password. */
export async function resetPasswordWithToken(
  resetToken: string,
  newPassword: string,
  confirmPassword: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await api.adminResetPassword({ resetToken, newPassword, confirmPassword });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: cleanErr(e, "Password reset failed.") };
  }
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [online, setOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listUsers();
      setUsers(res.users);
      setOnline(res.online);
    } catch {
      setUsers(listLocalUsers());
      setOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    const onStorage = () => {
      setUsers(listLocalUsers());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { users, reload, online, loading };
}
