import { useState, type ReactNode } from "react";
import { Link, Redirect, useLocation } from "wouter";
import { KeyRound, Loader2, Lock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  requestPasswordResetOtp,
  resendPasswordResetOtp,
  resetPasswordWithToken,
  verifyPasswordResetOtp,
} from "@/lib/admin-users";
import { useAdminAuth } from "@/lib/admin-auth";
import { AuthShell, AuthPasswordInput, AuthSubmitButton, AuthTextInput } from "./auth-layout";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function useInviteToken(): string {
  try {
    return new URLSearchParams(window.location.search).get("token") ?? "";
  } catch {
    return "";
  }
}

/** BizTrack TitleHeader: centered icon + title + subtitle. */
function ResetTitleHeader({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-3 flex flex-col items-center gap-1 text-center">
      <span className="text-primary">{icon}</span>
      <h1 className="text-base font-semibold text-gray-800">{title}</h1>
      <h2 className="text-[13px] text-gray-500">{subtitle}</h2>
    </div>
  );
}

/** BizTrack TextButton: "label [action]" centered link row. */
function CenterLinkButton({
  label,
  actionLabel,
  onClick,
  loading,
  to,
}: {
  label?: string;
  actionLabel: string;
  onClick?: () => void;
  loading?: boolean;
  to?: string;
}) {
  const inner = (
    <>
      {label ? <span className="text-gray-500">{label} </span> : null}
      {loading ? (
        <Loader2 size={16} className="inline animate-spin text-gray-800" />
      ) : (
        <span className="cursor-pointer font-semibold text-primary hover:underline">{actionLabel}</span>
      )}
    </>
  );
  return (
    <div className="text-center text-[13px]">
      {to ? (
        <Link href={to}>
          <span className="cursor-pointer">{inner}</span>
        </Link>
      ) : (
        <span onClick={loading ? undefined : onClick}>{inner}</span>
      )}
    </div>
  );
}

const hasUppercase = (s: string) => /[A-Z]/.test(s);
const hasNumber = (s: string) => /[0-9]/.test(s);
const hasSpecial = (s: string) => /[!@#$%^&*(),.?":{}|<>]/.test(s);

/**
 * BizTrack ForgotPassword, copied view-for-view:
 * OTPRequest (email) -> OTPInput (6-digit code + resend) -> PassReset.
 * A ?token= link jumps straight to Set Password (invite links).
 */
export default function AdminForgotPassword() {
  const { authed } = useAdminAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [token] = useState(useInviteToken);

  const [view, setView] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);

  if (authed) return <Redirect to="/admin" />;
  if (token) return <Redirect to={`/admin/set-password?token=${encodeURIComponent(token)}`} />;

  const showToast = (ok: boolean, title: string, message: string) =>
    toast({ title, description: message, variant: ok ? undefined : "destructive" });

  /* ---- view 0: request the code ---- */
  const sendCode = async () => {
    if (!EMAIL_RE.test(email.trim())) {
      showToast(false, "Error", "Please enter a valid email address.");
      return;
    }
    setLoading(true);
    const res = await requestPasswordResetOtp(email.trim());
    setLoading(false);
    if (res.ok) {
      if (res.devOtp) setDevOtp(res.devOtp);
      showToast(true, "Success", "OTP sent to your email");
      setView(1);
    } else {
      showToast(false, "Error", res.error ?? "Failed to send OTP");
    }
  };

  /* ---- view 1: resend ---- */
  const resendCode = async () => {
    setLoadingResend(true);
    const res = await resendPasswordResetOtp(email.trim());
    setLoadingResend(false);
    if (res.ok) {
      if (res.devOtp) setDevOtp(res.devOtp);
      showToast(true, "Success", "A new OTP has been sent to your email.");
    } else {
      showToast(false, "Error", res.error ?? "Failed to resend OTP");
    }
  };

  /* ---- view 1: verify ---- */
  const validateCode = async () => {
    if (otp.trim().length !== 6) {
      showToast(false, "Invalid OTP", "Please enter a 6-digit code");
      return;
    }
    setLoading(true);
    const res = await verifyPasswordResetOtp(email.trim(), otp.trim());
    setLoading(false);
    if (res.ok && res.resetToken) {
      showToast(true, "Success", "OTP verified successfully");
      setResetToken(res.resetToken);
      setView(2);
    } else {
      showToast(false, "Verification Failed", res.error ?? "OTP verification failed. Please try again.");
    }
  };

  /* ---- view 2: set the new password ---- */
  const passwordValid =
    password.length >= 8 && hasUppercase(password) && hasNumber(password) && hasSpecial(password);
  const isValid = !!passwordValid && !!passwordConfirm && password === passwordConfirm;

  const resetPassword = async () => {
    if (password !== passwordConfirm) {
      showToast(false, "Error", "Passwords do not match");
      return;
    }
    if (!passwordValid) {
      showToast(false, "Error", "Password must be 8+ characters with uppercase, number, and special character");
      return;
    }
    setLoading(true);
    const res = await resetPasswordWithToken(resetToken, password, passwordConfirm);
    if (res.ok) {
      // Password set. Sign-in itself needs the emailed OTP, so hand off
      // to login with the email prefilled.
      showToast(true, "Success", "Password reset successfully! Enter your password to get a sign-in code.");
      setLoading(false);
      navigate(`/admin/login?email=${encodeURIComponent(email.trim())}`);
    } else {
      setLoading(false);
      showToast(false, "Error", res.error ?? "Password reset failed");
    }
  };

  return (
    <AuthShell
      eyebrow="BCC Church Admin"
      title={view === 0 ? "Reset Password" : view === 1 ? "Verify OTP" : "Set New Password"}
      subtitle={
        view === 0
          ? "Enter your email for reset instructions"
          : view === 1
            ? "An OTP for verification has been sent to your email"
            : "Your new password must be different from previous passwords"
      }
    >
      {view === 0 && (
        <div className="w-full">
          <ResetTitleHeader icon={<KeyRound size={22} />} title="Forgot Password?" subtitle="Enter your email for reset instructions" />
          <form
            className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm"
            onSubmit={(e) => { e.preventDefault(); void sendCode(); }}
          >
            <AuthTextInput
              id="email"
              label="Email"
              placeholder="Enter email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              error={email !== "" && !EMAIL_RE.test(email.trim())}
              errorMessage="Invalid email"
              data-testid="input-reset-email"
            />
            <AuthSubmitButton loading={loading} disabled={!email || !EMAIL_RE.test(email.trim())} testId="button-send-reset-otp">
              Reset Password
            </AuthSubmitButton>
          </form>
          <div className="mt-3">
            <CenterLinkButton actionLabel="Back to Login" to="/admin/login" />
          </div>
        </div>
      )}

      {view === 1 && (
        <div className="w-full">
          <ResetTitleHeader icon={<Mail size={22} />} title="Check your Email" subtitle="An OTP for verification has been sent to your email, it will expire in 10 minutes" />
          <form
            className="rounded-xl border border-gray-300 bg-white p-5 shadow-sm"
            onSubmit={(e) => { e.preventDefault(); void validateCode(); }}
          >
            <AuthTextInput
              id="code"
              label="Verification Code"
              placeholder="Enter 6-digit code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              disabled={loading}
              data-testid="input-reset-otp"
            />
            {devOtp && (
              <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-center text-sm font-bold tracking-widest text-amber-800">
                Dev code: {devOtp}
              </p>
            )}
            <div className="mb-3">
              <CenterLinkButton label="Didn't receive the code?" actionLabel="Resend" onClick={resendCode} loading={loadingResend} />
            </div>
            <AuthSubmitButton loading={loading} disabled={!otp} testId="button-verify-otp">
              Verify Code
            </AuthSubmitButton>
          </form>
          <div className="mt-3">
            <CenterLinkButton actionLabel="Back to Login" to="/admin/login" />
          </div>
        </div>
      )}

      {view === 2 && (
        <div className="w-full">
          <ResetTitleHeader icon={<Lock size={22} />} title="Set new password" subtitle="Your new password must be different from previous passwords" />
          <form
            className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm"
            onSubmit={(e) => { e.preventDefault(); void resetPassword(); }}
          >
            <AuthPasswordInput
              id="password"
              label="New Password"
              placeholder="Enter password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={password !== "" && !passwordValid}
              errorMessage="8+ chars, uppercase, number, and special character."
              data-testid="input-new-password"
            />
            <AuthPasswordInput
              id="passwordConfirm"
              label="Confirm Password"
              placeholder="Confirm password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              error={passwordConfirm !== "" && passwordConfirm !== password}
              errorMessage="Passwords do not match."
              data-testid="input-confirm-password"
            />
            <AuthSubmitButton loading={loading} disabled={!isValid} testId="button-reset-password">
              Reset Password
            </AuthSubmitButton>
          </form>
          <div className="mt-3">
            <CenterLinkButton actionLabel="Back to Login" to="/admin/login" />
          </div>
        </div>
      )}
    </AuthShell>
  );
}
