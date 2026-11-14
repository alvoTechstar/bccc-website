import { useState } from "react";
import { Link, Redirect, useLocation } from "wouter";
import { KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isDefaultPasswordInUse, useAdminAuth } from "@/lib/admin-auth";
import { AuthPasswordInput, AuthShell, AuthSubmitButton, AuthTextInput } from "./auth-layout";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function usePrefilledEmail(): string {
  try {
    return new URLSearchParams(window.location.search).get("email") ?? "";
  } catch {
    return "";
  }
}

export default function AdminLogin() {
  const { authed, startLogin, verifyOtp, resendOtp } = useAdminAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [view, setView] = useState(0);
  const [email, setEmail] = useState(usePrefilledEmail);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (authed) return <Redirect to="/admin" />;

  const emailValid = EMAIL_RE.test(email.trim());
  const stepValid = emailValid && password.length >= 1;

  /* ---- step 1: password -> OTP emailed ---- */
  const submitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErrorMessage("");
    const res = await startLogin(email, password);
    setBusy(false);
    if (!res.ok) {
      setErrorMessage(res.error ?? "Sign in failed.");
      return;
    }
    if (res.user) {
      // Offline fallback: signed in directly with the local store.
      toast({ title: `Welcome back, ${res.user.name}`, description: "Offline mode — signed in on this device." });
      navigate("/admin");
      return;
    }
    if (res.devOtp) setDevOtp(res.devOtp);
    toast({ title: "Code sent", description: "Enter the 6-digit code emailed to you." });
    setView(1);
  };

  /* ---- step 2: verify the code -> admin ---- */
  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setErrorMessage("Please enter the 6-digit code.");
      return;
    }
    setBusy(true);
    setErrorMessage("");
    const res = await verifyOtp(email, otp);
    setBusy(false);
    if (res.ok && res.user) {
      toast({ title: `Welcome back, ${res.user.name}` });
      navigate("/admin");
    } else {
      setErrorMessage(res.error ?? "Code verification failed.");
    }
  };

  const resend = async () => {
    setLoadingResend(true);
    const res = await resendOtp(email.trim());
    setLoadingResend(false);
    if (res.ok) {
      if (res.devOtp) setDevOtp(res.devOtp);
      toast({ title: "Success", description: "A new code has been sent to your email." });
    } else {
      toast({ title: "Could not resend", description: res.error, variant: "destructive" });
    }
  };

  return (
    <AuthShell eyebrow="BCC Church Admin" title="Hello, Welcome" subtitle="Enter credentials to login">
      {view === 0 && (
        <form onSubmit={submitCredentials}>
          <AuthTextInput
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={email !== "" && !emailValid}
            errorMessage="Please enter a valid email address."
            data-testid="input-admin-email"
          />
          <AuthPasswordInput
            id="password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="input-admin-password"
          />

          {errorMessage && <div className="mb-3 text-sm text-red-600">{errorMessage}</div>}

          <div className="mb-2 mt-6">
            <AuthSubmitButton loading={busy} disabled={!stepValid} testId="button-admin-login">
              Sign In
            </AuthSubmitButton>
          </div>

          <div className="mb-3 mt-2 text-right">
            <Link href="/admin/forgot-password" className="text-xs font-semibold text-primary hover:underline" data-testid="link-forgot-password">
              Forgot Password?
            </Link>
          </div>

          {isDefaultPasswordInUse() && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Default admin credentials are still in use. Sign in and create named admins in <span className="font-bold">Users</span>, then remove or reset the default.
            </p>
          )}

          <div className="mt-2 text-center">
            <Link href="/" className="text-xs font-semibold text-gray-500 hover:text-primary">
              ← Back to website
            </Link>
          </div>
        </form>
      )}

      {view === 1 && (
        <form onSubmit={submitOtp}>
          <div className="mb-3 flex flex-col items-center gap-1 text-center">
            <span className="text-primary"><KeyRound size={22} /></span>
            <h1 className="text-base font-semibold text-gray-800">Check your Email</h1>
            <h2 className="text-[13px] text-gray-500">A sign-in code has been sent to {email.trim()} — it expires in 10 minutes</h2>
          </div>
          <AuthTextInput
            id="code"
            label="Verification Code"
            placeholder="Enter 6-digit code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            disabled={busy}
            data-testid="input-login-otp"
          />
          {devOtp && (
            <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-center text-sm font-bold tracking-widest text-amber-800">
              Dev code: {devOtp}
            </p>
          )}
          {errorMessage && <div className="mb-3 text-sm text-red-600">{errorMessage}</div>}
          <div className="mb-3 text-center text-[13px]">
            <span className="text-gray-500">Didn't receive the code? </span>
            {loadingResend ? (
              <span className="text-gray-400">Sending…</span>
            ) : (
              <span className="cursor-pointer font-semibold text-primary hover:underline" onClick={resend}>Resend</span>
            )}
          </div>
          <div className="mb-2 mt-2">
            <AuthSubmitButton loading={busy} disabled={otp.trim().length !== 6} testId="button-verify-login-otp">
              Verify & Sign In
            </AuthSubmitButton>
          </div>
          <div className="mb-3 mt-2 text-center">
            <span className="cursor-pointer text-xs font-semibold text-gray-500 hover:text-primary" onClick={() => { setView(0); setOtp(""); setErrorMessage(""); }}>
              ← Back
            </span>
          </div>
        </form>
      )}
    </AuthShell>
  );
}
