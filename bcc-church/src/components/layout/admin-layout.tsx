import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  Banknote,
  CalendarDays,
  Clapperboard,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Users,
} from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";
import { roleLabel, userInitials, type AdminRole } from "@/lib/admin-users";
import { AdminButton, AdminGhostButton } from "@/components/buttons/admin-buttons";

/**
 * Admin shell — transfer-advise gateway look:
 * white 68px header, white bordered sidebar card (215px),
 * light content well, tinted active item with accent left border.
 */
const NAV: { to: string; label: string; icon: typeof LayoutDashboard; roles?: AdminRole[] }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/giving", label: "Giving", icon: Banknote },
  { to: "/admin/messages", label: "Messages", icon: Inbox },
  { to: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { to: "/admin/posts", label: "Blog Posts", icon: FileText },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/media", label: "Media", icon: Clapperboard },
  { to: "/admin/users", label: "Users", icon: Users, roles: ["superadmin"] },
];

function Brand() {
  return (
    <span className="flex shrink-0 items-center gap-2.5">
      <img
        src="/logo-icon.svg"
        alt="Beautiful Courts Christian Church logo"
        className="h-9 w-9 rounded-full object-contain"
      />
      <span className="leading-none">
        <span className="block text-[15px] font-bold text-[#1F2937]">Beautiful Courts</span>
        <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500">
          Christian Church
        </span>
      </span>
    </span>
  );
}

export function AdminShell({
  title,
  breadcrumb,
  actions,
  children,
}: {
  title: string;
  breadcrumb?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { user, logout } = useAdminAuth();
  const [confirmOut, setConfirmOut] = useState(false);

  const crumbs = breadcrumb ?? title;
  const visibleNav = NAV.filter((n) => !n.roles || (user && n.roles.includes(user.role)));

  const sidebarBody = (
    <div className="flex h-full flex-col py-3">
      <nav className="flex-1" aria-label="Admin">
        {visibleNav.map(({ to, label, icon: Icon }) => {
          const isActive = to === "/admin" ? location === "/admin" : location.startsWith(to);
          return (
            <Link key={to} href={to}>
              <span
                onClick={() => setSidebarOpen(false)}
                className={`mx-[19px] mt-[10px] flex min-h-[42px] cursor-pointer items-center gap-3 rounded-md border-l-[6px] px-3 text-[13px] no-underline transition-colors ${
                  isActive
                    ? "border-l-accent bg-accent/10 font-bold text-primary"
                    : "border-l-transparent font-bold text-[#353F50] hover:bg-slate-100"
                }`}
              >
                <Icon size={17} className="shrink-0" />
                <span className="truncate">{label}</span>
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="mx-[19px] mt-3 border-t border-[#e1e6ed] pt-3">
        <Link href="/">
          <span className="block cursor-pointer rounded-md px-3 py-2 text-[13px] font-bold text-[#5F738C] no-underline hover:bg-slate-100">
            ← View website
          </span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#eef1f5]">
      {/* Top bar — white, 68px */}
      <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-[#e1e6ed] bg-white px-4 md:px-9">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="shrink-0 rounded p-1 text-[#353F50] hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="hidden sm:block">
            <Brand />
          </div>
          <p className="hidden truncate border-l-2 border-slate-200 pl-3 text-[14px] font-bold text-[#353F50] md:block">
            {crumbs}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {user && (
            <span className="hidden items-center gap-2 md:flex">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6] text-xs font-bold text-[#353F50]">
                {userInitials(user.name)}
              </span>
              <span className="leading-tight">
                <span className="block max-w-36 truncate text-[13px] font-bold text-[#353F50]">
                  Hi, {user.name.split(" ")[0]}
                </span>
                <span className="block text-[11px] text-[#848F9F]">{roleLabel(user.role)}</span>
              </span>
            </span>
          )}
          <AdminButton onClick={() => setConfirmOut(true)} className="px-5">
            Log Out
          </AdminButton>
        </div>
      </header>

      {/* Body */}
      <div className="relative mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 gap-4 p-4 md:px-9 md:py-5">
        {sidebarOpen && (
          <div
            className="absolute inset-0 z-30 bg-slate-900/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
        )}
        {/* Fixed sidebar — never scrolls; only the content well scrolls */}
        <aside
          className={`absolute inset-y-4 left-4 z-40 flex w-[215px] shrink-0 flex-col overflow-hidden rounded-[9px] border border-[#e1e6ed] bg-white shadow-[0_9px_20px_#0000000a] transition-transform md:left-9 lg:static lg:h-full lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)]"
          }`}
        >
          {sidebarBody}
        </aside>

        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto rounded-[9px] border border-[#e1e6ed] bg-white px-4 py-5 shadow-[0_9px_20px_#0000000a] md:px-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-[20px] font-bold text-[#1F2937]">{title}</h1>
              <p className="mt-0.5 text-[13px] text-[#6B7280]">
                Beautiful Courts Christian Church
              </p>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
          <div className="admin-nums">{children}</div>
          <div className="mt-auto pt-6">
            <p className="border-t border-[#e1e6ed] pt-4 text-center text-[11px] text-slate-400">
              BCC Church · Raising Kingdom Champions · Admin console
            </p>
          </div>
        </main>
      </div>

      {/* Logout confirm */}
      {confirmOut && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setConfirmOut(false)}
        >
          <div
            className="w-full max-w-xs overflow-hidden rounded-md bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <h2 className="flex items-center gap-2 text-base font-bold text-[#1F2937]">
                <LogOut size={16} /> Log out?
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                You'll be signed out and returned to the sign-in page.
              </p>
              <div className="mt-4 flex gap-2">
                <AdminGhostButton onClick={() => setConfirmOut(false)} className="flex-1 justify-center">
                  Cancel
                </AdminGhostButton>
                <AdminButton
                  onClick={() => {
                    setConfirmOut(false);
                    logout();
                    navigate("/admin/login");
                  }}
                  className="flex-1 justify-center"
                >
                  Log Out
                </AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminShell;
