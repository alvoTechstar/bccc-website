import { useState } from "react";
import { Link, Redirect } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { acceptInvite } from "@/lib/admin-users";
import { useAdminAuth } from "@/lib/admin-auth";
import { AuthPasswordInput, AuthShell, AuthSubmitButton } from "./auth-layout";

function useInviteToken(): string {
  try {
    return new URLSearchParams(window.location.search).get("token") ?? "";
  } catch {
    return "";
  }
}

export default function AdminSetPassword() {
  const { authed } = useAdminAuth();
  const { toast } = useToast();
  const [token] = useState(useInviteToken);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [done, setDone] = useState(false);

  if (authed) return <Redirect to="/admin" />;

  const isValid = password.length >= 8 && confirm.length > 0 && password === confirm;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErrorMessage("");
    const res = await acceptInvite(token, password, confirm);
    setBusy(false);
    if (res.ok) {
      setDone(true);
    } else {
      setErrorMessage(res.error ?? "Could not set password.");
      toast({ title: "Could not set password", description: res.error, variant: "destructive" });
    }
  };

  return (
    <AuthShell
      eyebrow="BCC Church Admin"
      title="Set New Password"
      subtitle="Your new password must be different from previous passwords"
    >
      {!token ? (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            This page needs a valid invite link. Open the <span className="font-semibold">“Set Your Password”</span> email we sent you and click the button inside.
          </p>
          <div className="mb-2 mt-6">
            <Link href="/admin/login">
              <span className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-primary py-3 text-white no-underline transition-colors hover:bg-[#14365d]">
                Back to sign in
              </span>
            </Link>
          </div>
        </div>
      ) : done ? (
        <div className="text-center">
          <CheckCircle2 size={40} className="mx-auto mb-3 text-emerald-500" />
          <p className="text-sm text-gray-600">Your password is set. Welcome aboard — sign in to open the admin console.</p>
          <div className="mb-2 mt-6">
            <Link href="/admin/login">
              <span className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-primary py-3 text-white no-underline transition-colors hover:bg-[#14365d]">
                Go to sign in
              </span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={submit}>
          <AuthPasswordInput
            id="new-password"
            label="New Password"
            placeholder="Enter password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={password !== "" && password.length < 8}
            errorMessage="Password must be at least 8 characters."
            data-testid="input-new-password"
          />
          <AuthPasswordInput
            id="confirm-password"
            label="Confirm Password"
            placeholder="Confirm password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={confirm !== "" && confirm !== password}
            errorMessage="Passwords do not match."
            data-testid="input-confirm-password"
          />

          {errorMessage && <div className="mb-3 text-sm text-red-600">{errorMessage}</div>}

          <div className="mb-2 mt-6">
            <AuthSubmitButton loading={busy} disabled={!isValid} testId="button-set-password">
              Set Password
            </AuthSubmitButton>
          </div>
          <p className="mt-3 text-center text-xs text-gray-500">
            Invite links expire after 24 hours — ask a Super Admin to resend yours if this one lapses.
          </p>
        </form>
      )}
    </AuthShell>
  );
}

