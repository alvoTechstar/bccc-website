import { useCallback, useEffect, useState } from "react";
import {
  ADMIN_UNAUTHORIZED_EVENT,
  api,
  clearAdminToken,
  getAdminToken,
  isNetworkError,
} from "./api";
import {
  consumeLegacySession,
  defaultCredentialsInUse,
  ensureLocalSeeded,
  getLocalUser,
  resendLoginOtp,
  startLogin as startLoginAccount,
  verifyLoginOtp,
  type AdminUser,
  type LoginStartResult,
} from "./admin-users";

const SESSION_KEY = "bcc_admin_user_session_v1";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

interface Session {
  user: AdminUser;
  authedAt: number;
}

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function writeSession(user: AdminUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user, authedAt: Date.now() } satisfies Session));
}

/** Current signed-in admin, or null (expired / deactivated / missing). */
export function getSessionUser(): AdminUser | null {
  ensureLocalSeeded();
  // One-time upgrade from the old shared-password session.
  if (!readSession()) {
    const migratedId = consumeLegacySession();
    if (migratedId) {
      const seeded = getLocalUser(migratedId);
      if (seeded) writeSession(seeded);
    }
  }
  const s = readSession();
  if (!s || Date.now() - s.authedAt > SESSION_TTL_MS) {
    if (s) {
      localStorage.removeItem(SESSION_KEY);
      clearAdminToken();
    }
    return null;
  }
  // Local accounts can be deactivated on this device — respect that.
  if (!getAdminToken()) {
    const fresh = getLocalUser(s.user.id);
    if (!fresh || !fresh.active) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return fresh;
  }
  return s.user;
}

export function isAdminAuthed(): boolean {
  return getSessionUser() !== null;
}

export function isSuperAdmin(user: AdminUser | null): boolean {
  return !!user && user.active && user.role === "superadmin";
}

export function adminLogout() {
  localStorage.removeItem(SESSION_KEY);
  clearAdminToken();
}

/** True while the seeded default credentials are still in use (local safety net). */
export function isDefaultPasswordInUse(): boolean {
  ensureLocalSeeded();
  return defaultCredentialsInUse();
}

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(() => getSessionUser());

  const refresh = useCallback(() => setUser(getSessionUser()), []);

  // Revalidate against the backend when we hold a token (silent).
  useEffect(() => {
    if (!getAdminToken()) return;
    let cancelled = false;
    api
      .adminMe()
      .then((me) => {
        if (cancelled) return;
        const next: AdminUser = {
          id: me.id,
          name: me.name,
          email: me.email,
          role: me.role,
          active: me.active,
          mustSetPassword: me.mustSetPassword,
          createdAt: me.createdAt,
          updatedAt: me.updatedAt,
          ...(me.lastLoginAt ? { lastLoginAt: me.lastLoginAt } : {}),
        };
        setUser((prev) => {
          if (prev && prev.id === next.id) writeSession(next);
          return prev && prev.id === next.id ? next : prev;
        });
      })
      .catch((e: unknown) => {
        // 401 handled globally via ADMIN_UNAUTHORIZED_EVENT; offline = keep session.
        if (!isNetworkError(e)) setUser(getSessionUser());
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onUnauthorized = () => {
      localStorage.removeItem(SESSION_KEY);
      setUser(null);
    };
    const onStorage = () => setUser(getSessionUser());
    window.addEventListener(ADMIN_UNAUTHORIZED_EVENT, onUnauthorized);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(ADMIN_UNAUTHORIZED_EVENT, onUnauthorized);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  const startLogin = useCallback(async (email: string, password: string): Promise<LoginStartResult> => {
    ensureLocalSeeded();
    const res = await startLoginAccount(email, password);
    if (res.ok && res.user) {
      writeSession(res.user);
      setUser(res.user);
    }
    return res;
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    const res = await verifyLoginOtp(email, otp);
    if (res.ok && res.user) {
      writeSession(res.user);
      setUser(res.user);
    }
    return res;
  }, []);

  const resendOtp = useCallback(async (email: string) => resendLoginOtp(email), []);

  const logout = useCallback(() => {
    adminLogout();
    setUser(null);
  }, []);

  return { authed: !!user, user, startLogin, verifyOtp, resendOtp, logout, refresh };
}
