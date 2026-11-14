import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertTriangle, KeyRound, Mail, Pencil, Trash2, UserCheck, UserX, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/lib/admin-auth";
import { api } from "@/lib/api";
import {
  createUser,
  deleteUser,
  resendInvite,
  resetUserPassword,
  roleLabel,
  setUserActive,
  updateUser,
  useAdminUsers,
  userInitials,
  type AdminRole,
  type AdminUser,
  type UserResult,
} from "@/lib/admin-users";
import { IciCard } from "@/components/cards/card";
import { StatCard } from "@/components/cards/stat-card";
import { StatusPill } from "@/components/feedback/status-pill";
import { IciDataTable } from "@/components/data-table/data-table";
import { IciSearchInput } from "@/components/inputs/inputs";
import { FormInput, FormSelect } from "@/components/inputs/form-field";
import {
  AddButton,
  AdminButton,
  AdminDangerButton,
  AdminGhostButton,
  IconButton,
} from "@/components/buttons/admin-buttons";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";

type DialogMode = { kind: "create" } | { kind: "edit"; user: AdminUser } | { kind: "password"; user: AdminUser } | null;

export default function AdminUsers() {
  const { toast } = useToast();
  const { user: me } = useAdminAuth();
  const { users, reload, online, loading } = useAdminUsers();
  const emailStatus = useQuery({
    queryKey: ["admin", "email-status"],
    queryFn: api.adminEmailStatus,
    retry: 1,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState<DialogMode>(null);
  const [busy, setBusy] = useState(false);

  // Form state (shared by create / edit).
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("admin");

  const openCreate = () => {
    setName(""); setEmail(""); setPassword(""); setRole("admin");
    setDialog({ kind: "create" });
  };
  const openEdit = (u: AdminUser) => {
    setName(u.name); setEmail(u.email); setPassword(""); setRole(u.role);
    setDialog({ kind: "edit", user: u });
  };
  const openPassword = (u: AdminUser) => {
    setPassword("");
    setDialog({ kind: "password", user: u });
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || `${u.name} ${u.email} ${roleLabel(u.role)}`.toLowerCase().includes(q);
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!dialog || dialog.kind === "password") return;
      if (dialog.kind === "create") {
        // Online: backend creates the admin and emails them a set-password
        // invite (biztrack-style) — no password needed here.
        const res = await createUser({ name, email, role, password: password || undefined });
        if (!res.ok) throw new Error(res.error);
        if (res.offline) return "Local admin created — share the email + password with them directly (backend unreachable, no email sent).";
        return res.emailSent
          ? `Invite email sent to ${email} — they'll set their own password.`
          : "Admin created, but the invite email failed — use Resend invite to retry.";
      }
      const res = await updateUser(dialog.user.id, { name, role }, me?.id ?? "");
      if (!res.ok) throw new Error(res.error);
      if (!online && password) {
        const pw = await resetUserPassword(dialog.user.id, password);
        if (!pw.ok) throw new Error(pw.error);
      }
      return "Admin updated.";
    },
    onSuccess: (msg) => { toast({ title: msg ?? "Saved" }); setDialog(null); void reload(); },
    onError: (e: Error) => toast({ title: "Save failed", description: e.message, variant: "destructive" }),
  });

  // Offline only: set the password directly on this device.
  const savePassword = useMutation({
    mutationFn: async () => {
      if (!dialog || dialog.kind !== "password") return;
      const res = await resetUserPassword(dialog.user.id, password);
      if (!res.ok) throw new Error(res.error);
    },
    onSuccess: () => { toast({ title: "Password set" }); setDialog(null); void reload(); },
    onError: (e: Error) => toast({ title: "Reset failed", description: e.message, variant: "destructive" }),
  });

  const runGuarded = async (label: string, fn: () => Promise<UserResult> | UserResult) => {
    setBusy(true);
    try {
      const res = await fn();
      if (!res.ok) {
        toast({ title: `${label} failed`, description: res.error, variant: "destructive" });
      } else if (label === "Invite" && res.emailSent === false) {
        toast({ title: "Invite created, email failed", description: "Check email settings, then retry.", variant: "destructive" });
        void reload();
      } else {
        toast({ title: label === "Invite" ? "Invite email sent" : `${label} done` });
        void reload();
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      {!online && !loading && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <p className="m-0">
            Backend unreachable — working with the on-device admin list. New admins are local-only and <span className="font-bold">no invite emails can be sent</span> until the backend is back.
          </p>
        </div>
      )}

      {online && emailStatus.data && !emailStatus.data.verified && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <p className="m-0">
            <span className="font-bold">Email is not sending.</span>{" "}
            {emailStatus.data.error ?? "SMTP check failed."} Fix EMAIL_USER / SMTP_PASS on the
            server (Gmail needs an App Password, not your login password), then restart the backend.
          </p>
        </div>
      )}

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { icon: <Users size={16} />, label: "Total admins", count: users.length, hint: "All accounts", tone: "info" as const },
          { icon: <UserCheck size={16} />, label: "Active", count: users.filter((u) => u.active).length, hint: "Can sign in", tone: "success" as const },
          { icon: <KeyRound size={16} />, label: "Super Admins", count: users.filter((u) => u.role === "superadmin").length, hint: "Full access", tone: "purple" as const },
        ].map((s, i) => (
          <motion.div key={s.label} variants={staggerDir(i)}>
            <StatCard icon={s.icon} label={s.label} count={s.count} hint={s.hint} tone={s.tone} />
          </motion.div>
        ))}
      </motion.div>

      <Reveal from="up">
      <IciCard
        title={`Admins · ${filtered.length}`}
        subtitle={online ? "Super Admins manage users · new admins get an email to set their password" : "Super Admins manage users · offline mode"}
        actions={
          <AddButton onClick={openCreate} data-testid="button-user-new">
            New admin
          </AddButton>
        }
      >
        <div className="mb-3">
          <IciSearchInput value={search} onChange={(v) => { setSearch(v); setPage(0); }} placeholder="Search name, email, role…" />
        </div>
        <div className="overflow-hidden rounded border border-slate-100">
          <IciDataTable
            columns={[
              {
                key: "name", header: "Admin", render: (u) => (
                  <span className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-[11px] font-black text-primary">
                      {userInitials(u.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{u.name}{u.id === me?.id ? " (you)" : ""}</span>
                      <span className="block truncate text-[11px] font-normal text-slate-500">{u.email}</span>
                    </span>
                  </span>
                ),
              },
              { key: "role", header: "Role", width: "130px", render: (u) => <StatusPill label={roleLabel(u.role)} tone={u.role === "superadmin" ? "purple" : "info"} showDot={false} width="96px" /> },
              {
                key: "status", header: "Status", width: "160px", render: (u) => (
                  <span className="flex items-center gap-1.5">
                    <StatusPill label={u.active ? "Active" : "Deactivated"} width="96px" />
                    {u.mustSetPassword && (
                      <StatusPill label={online ? "Invite pending" : "Reset pwd"} tone="warning" showDot={false} width="96px" />
                    )}
                  </span>
                ),
              },
              { key: "login", header: "Last login", width: "130px", render: (u) => <span className="text-slate-500">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : "—"}</span> },
              {
                key: "actions", header: "Actions", align: "right", width: "210px", render: (u) => (
                  <span className="flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <IconButton title="Edit" onClick={() => openEdit(u)}><Pencil size={13} /></IconButton>
                    {online ? (
                      <IconButton title="Resend invite email" disabled={busy}
                        onClick={() => void runGuarded("Invite", () => resendInvite(u.id))}><Mail size={13} /></IconButton>
                    ) : (
                      <IconButton title="Set password directly" onClick={() => openPassword(u)}><KeyRound size={13} /></IconButton>
                    )}
                    <IconButton
                      title={u.active ? "Deactivate" : "Activate"} disabled={busy}
                      onClick={() => void runGuarded(u.active ? "Deactivation" : "Activation", () => setUserActive(u.id, !u.active, me?.id ?? ""))}>
                      {u.active ? <UserX size={13} /> : <UserCheck size={13} />}
                    </IconButton>
                    <IconButton
                      title="Delete" disabled={busy}
                      onClick={() => { if (confirm(`Delete admin "${u.name}" (${u.email})?`)) void runGuarded("Delete", () => deleteUser(u.id, me?.id ?? "")); }}
                      className="border-red-200 text-red-600 hover:bg-red-50">
                      <Trash2 size={13} />
                    </IconButton>
                  </span>
                ),
              },
            ]}
            rows={filtered}
            rowKey={(u) => u.id}
            loading={loading}
            emptyMessage="No admins found."
            page={page}
            rowsPerPage={10}
            onPageChange={setPage}
          />
        </div>
      </IciCard>
      </Reveal>

      {/* Create / Edit dialog */}
      {dialog && dialog.kind !== "password" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setDialog(null)}>
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
              <h2 className="text-sm font-semibold text-slate-800">{dialog.kind === "create" ? "New admin" : "Edit admin"}</h2>
              <button type="button" onClick={() => setDialog(null)} className="text-slate-400 hover:text-slate-600" aria-label="Close">✕</button>
            </div>
            <div className="space-y-3 px-5 py-4">
              <FormInput label="Full name *" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Wanjiku" />
              <div>
                <FormInput label="Email *" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@bccchurch.co.ke" disabled={dialog.kind === "edit"} className="disabled:bg-slate-50 disabled:text-slate-500" />
              </div>
              <FormSelect label="Role" value={role} onChange={(e) => setRole(e.target.value as AdminRole)}>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </FormSelect>
              {(dialog.kind === "edit" && !online) || (dialog.kind === "create" && !online) ? (
                <FormInput
                  label={dialog.kind === "create" ? "Temporary password (min 8) *" : "New password (optional)"}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={dialog.kind === "create" ? "Set password" : "Leave blank to keep"}
                />
              ) : null}
              {dialog.kind === "create" && (
                online ? (
                  <p className="rounded bg-blue-50 px-3 py-2 text-xs text-blue-800">They'll receive an email with a link to set their own password (valid 24 hours).</p>
                ) : (
                  <p className="rounded bg-amber-50 px-3 py-2 text-xs text-amber-800">Backend unreachable — this admin lives on this device only. Share the email + password with them directly.</p>
                )
              )}
              <div className="flex justify-end gap-2">
                <AdminGhostButton onClick={() => setDialog(null)}>Cancel</AdminGhostButton>
                <AdminButton onClick={() => save.mutate()} disabled={save.isPending}>
                  {save.isPending ? "Saving…" : dialog.kind === "create" ? "Create admin" : "Save changes"}
                </AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offline: set password directly on this device */}
      {dialog?.kind === "password" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setDialog(null)}>
          <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
              <h2 className="text-sm font-semibold text-slate-800">Set password</h2>
              <button type="button" onClick={() => setDialog(null)} className="text-slate-400 hover:text-slate-600" aria-label="Close">✕</button>
            </div>
            <div className="space-y-3 px-5 py-4">
              <p className="m-0 text-sm text-slate-600">Set a password for <span className="font-semibold">{dialog.user.name}</span> ({dialog.user.email}) on this device.</p>
              <FormInput label="New password (min 8) *" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="flex justify-end gap-2">
                <AdminGhostButton onClick={() => setDialog(null)}>Cancel</AdminGhostButton>
                <AdminDangerButton onClick={() => savePassword.mutate()} disabled={savePassword.isPending || password.length < 8}>
                  {savePassword.isPending ? "Saving…" : "Set password"}
                </AdminDangerButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
