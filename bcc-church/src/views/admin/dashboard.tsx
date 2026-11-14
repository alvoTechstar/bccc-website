import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Banknote, FileText, Inbox, Mail } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { IciCard } from "@/components/cards/card";
import { StatCard } from "@/components/cards/stat-card";
import { StatusPill } from "@/components/feedback/status-pill";
import { IciDataTable } from "@/components/data-table/data-table";
import { DonutChart, IciBarChart, TrendChart } from "@/components/charts/charts";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";

const TYPE_COLORS = ["#0e2a52", "#eab308", "#2f8fd0", "#10b981", "#8b5cf6", "#f59e0b"];
const STATUS_COLORS: Record<string, string> = {
  completed: "#10b981",
  pending: "#f59e0b",
  initiated: "#f59e0b",
  failed: "#ef4444",
};

function last14Days(): { iso: string; label: string }[] {
  const out: { iso: string; label: string }[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    out.push({ iso, label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) });
  }
  return out;
}

export default function AdminDashboard() {
  const giving = useQuery({ queryKey: ["admin", "giving"], queryFn: api.getGivingRecords, retry: 1 });
  const messages = useQuery({ queryKey: ["admin", "messages"], queryFn: api.getContactMessages, retry: 1 });
  const subs = useQuery({ queryKey: ["admin", "subs"], queryFn: api.getNewsletterSubscribers, retry: 1 });
  const posts = useQuery({ queryKey: ["admin", "posts"], queryFn: () => api.getBlogPosts(), retry: 1 });

  const records = giving.data ?? [];
  const total = records.reduce((s, r) => s + (Number(r.amount) || 0), 0);

  const days = last14Days();
  const trendTotal = days.map(({ iso }) =>
    records.filter((r) => (r.createdAt ?? "").slice(0, 10) === iso).reduce((s, r) => s + (Number(r.amount) || 0), 0)
  );
  const trendCompleted = days.map(({ iso }) =>
    records.filter((r) => (r.createdAt ?? "").slice(0, 10) === iso && r.status === "completed").reduce((s, r) => s + (Number(r.amount) || 0), 0)
  );

  const byType = Object.entries(
    records.reduce<Record<string, number>>((acc, r) => {
      acc[r.givingType || "Other"] = (acc[r.givingType || "Other"] || 0) + (Number(r.amount) || 0);
      return acc;
    }, {})
  )
    .map(([name, value], i) => ({ key: name, category: name, bars: [{ key: name, label: name, value: Math.round(value), color: TYPE_COLORS[i % TYPE_COLORS.length] }] }))
    .sort((a, b) => b.bars[0].value - a.bars[0].value);

  const byStatus = Object.entries(
    records.reduce<Record<string, number>>((a, r) => ({ ...a, [r.status || "unknown"]: (a[r.status || "unknown"] || 0) + 1 }), {})
  ).map(([label, value]) => ({ key: label, label, value, color: STATUS_COLORS[label] ?? "#94a3b8" }));

  const recent = [...records]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 8);

  return (
    <div className="admin-nums space-y-4">
      {(giving.isError || messages.isError || subs.isError) && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <p className="m-0">Backend unreachable or cold-starting (Render free tier sleeps). Showing what loaded — retry in a minute. Events still work (stored locally).</p>
        </div>
      )}

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-2 gap-3 xl:grid-cols-4"
      >
        {[
          { to: "/admin/giving", icon: <Banknote size={16} />, label: "Total giving", count: Math.round(total), prefix: "KES ", hint: `${records.length} records`, tone: "success" as const },
          { to: "/admin/messages", icon: <Inbox size={16} />, label: "Messages", count: messages.data?.length ?? 0, prefix: "", hint: "Contact + prayer", tone: "info" as const },
          { to: "/admin/subscribers", icon: <Mail size={16} />, label: "Subscribers", count: subs.data?.length ?? 0, prefix: "", hint: "Newsletter list", tone: "purple" as const },
          { to: "/admin/posts", icon: <FileText size={16} />, label: "Blog posts", count: posts.data?.length ?? 0, prefix: "", hint: "Published articles", tone: "neutral" as const },
        ].map((s, i) => (
          <motion.div key={s.label} variants={staggerDir(i)}>
            <Link href={s.to}>
              <StatCard icon={s.icon} label={s.label} count={s.count} prefix={s.prefix} hint={s.hint} tone={s.tone} />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <Reveal from="left">
      <IciCard title="Giving trend" subtitle="KES received per day · last 14 days">
        {giving.isLoading ? (
          <p className="py-6 text-center text-sm text-slate-500">Loading records…</p>
        ) : (
          <TrendChart
            categories={days.map((d) => d.label)}
            series={[
              { key: "total", label: "Total (KES)", color: "#0e2a52", values: trendTotal },
              { key: "completed", label: "Completed (KES)", color: "#10b981", values: trendCompleted },
            ]}
            emptyMessage="No giving activity in the last 14 days."
          />
        )}
      </IciCard>
      </Reveal>

      <div className="grid gap-3 lg:grid-cols-2">
        <Reveal from="rotate-l" className="min-w-0">
        <IciCard title="Giving by type" subtitle="Where generous gifts are going (KES)">
          {giving.isLoading ? (
            <p className="py-6 text-center text-sm text-slate-500">Loading records…</p>
          ) : (
            <IciBarChart rows={byType} emptyMessage="No giving records yet." />
          )}
        </IciCard>
        </Reveal>
        <Reveal from="rotate-r" delay={0.1} className="min-w-0">
        <IciCard title="Payments by status" subtitle="M-Pesa STK push outcomes (count)">
          {giving.isLoading ? (
            <p className="py-6 text-center text-sm text-slate-500">Loading records…</p>
          ) : (
            <DonutChart data={byStatus} centerLabel="txns" unitLabel="txns" emptyMessage="No data yet." />
          )}
        </IciCard>
        </Reveal>
      </div>

      <Reveal from="up">
      <IciCard
        title="Recent giving"
        subtitle="Latest transactions across all types"
        actions={<Link href="/admin/giving" className="text-xs font-semibold text-primary hover:underline">View all →</Link>}
        bodyClassName="p-0"
      >
        <IciDataTable
          columns={[
            { key: "date", header: "Date", width: "150px", render: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleString() : "—") },
            { key: "type", header: "Type", render: (r) => <span className="font-semibold">{r.givingType}</span> },
            { key: "amount", header: "Amount", align: "right", width: "120px", render: (r) => `KES ${Number(r.amount).toLocaleString()}` },
            { key: "phone", header: "Phone", render: (r) => r.phoneNumber },
            { key: "status", header: "Status", width: "120px", render: (r) => <StatusPill label={r.status} width="96px" /> },
          ]}
          rows={recent}
          rowKey={(r) => r.id}
          loading={giving.isLoading}
          emptyMessage={giving.isError ? "Could not load giving records — backend may be asleep." : "No records yet."}
        />
      </IciCard>
      </Reveal>
    </div>
  );
}
