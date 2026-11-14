import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Download, Inbox, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { api, type ContactMessage } from "@/lib/api";
import { IciCard } from "@/components/cards/card";
import { StatCard } from "@/components/cards/stat-card";
import { IciDataTable } from "@/components/data-table/data-table";
import { IciSearchInput } from "@/components/inputs/inputs";
import { FilterInput } from "@/components/inputs/filter-input";
import { DateInput, emptyRange, type DateRangeValue } from "@/components/inputs/date-input";
import { AdminGhostButton, AdminOutlineButton } from "@/components/buttons/admin-buttons";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";
import { downloadFile, toCsv } from "@/lib/admin-store";

export default function AdminMessages() {
  const { data = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: api.getContactMessages,
  });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({ subject: [] });
  const [range, setRange] = useState<DateRangeValue>(emptyRange());
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<ContactMessage | null>(null);

  const subjects = useMemo(() => Array.from(new Set(data.map((m) => m.subject).filter(Boolean))), [data]);
  const resetPage = () => setPage(0);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((m) => {
      if (q && !`${m.firstName} ${m.lastName} ${m.email} ${m.subject} ${m.message}`.toLowerCase().includes(q)) return false;
      if (filters.subject.length > 0 && !filters.subject.includes(m.subject)) return false;
      const day = (m.createdAt ?? "").slice(0, 10);
      if (range.startDate && day < range.startDate) return false;
      if (range.endDate && day > range.endDate) return false;
      return true;
    });
  }, [data, search, filters, range]);

  return (
    <div className="space-y-3">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-2 gap-3"
      >
        {[
          { icon: <Inbox size={16} />, label: "Total messages", count: data.length, hint: "Contact + prayer", tone: "info" as const },
          { icon: <CalendarDays size={16} />, label: "This month", count: data.filter((m) => m.createdAt && new Date(m.createdAt).getMonth() === new Date().getMonth()).length, hint: "Fresh inbox", tone: "success" as const },
        ].map((s, i) => (
          <motion.div key={s.label} variants={staggerDir(i)}>
            <StatCard icon={s.icon} label={s.label} count={s.count} hint={s.hint} tone={s.tone} />
          </motion.div>
        ))}
      </motion.div>

      <Reveal from="up">
      <IciCard
        title="Messages"
        subtitle={`${filtered.length} of ${data.length} · contact form + prayer requests`}
        actions={
          <>
            <AdminGhostButton onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={13} /> {isFetching ? "Refreshing…" : "Refresh"}
            </AdminGhostButton>
            <AdminOutlineButton onClick={() => downloadFile(`messages-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(filtered as unknown as Record<string, unknown>[]))}>
              <Download size={13} /> Export
            </AdminOutlineButton>
          </>
        }
      >
        <div className="mb-3 flex flex-wrap items-end gap-2">
          <IciSearchInput value={search} onChange={(v) => { setSearch(v); resetPage(); }} placeholder="Search name, email, subject, message…" className="min-w-52 flex-1" />
          <FilterInput
            categories={[{ key: "subject", label: "Subject", options: subjects.map((s) => ({ label: s, value: s })) }]}
            value={filters}
            onChange={(v) => { setFilters(v); resetPage(); }}
          />
          <DateInput value={range} onChange={(v) => { setRange(v); resetPage(); }} />
        </div>
        <div className="overflow-hidden rounded border border-slate-100">
          <IciDataTable
            columns={[
              { key: "date", header: "Date", width: "110px", render: (m) => (m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "—") },
              { key: "name", header: "Name", width: "190px", render: (m) => (<span><span className="block font-semibold">{m.firstName} {m.lastName}</span><span className="block truncate text-[11px] font-normal text-slate-500">{m.email}</span></span>) },
              { key: "subject", header: "Subject", width: "150px", render: (m) => m.subject },
              { key: "message", header: "Message", render: (m) => <span className="block truncate text-slate-500">{m.message}</span> },
            ]}
            rows={filtered}
            rowKey={(m) => m.id}
            loading={isLoading}
            emptyMessage={isError ? "Could not load messages — backend may be asleep." : "No messages found."}
            page={page}
            rowsPerPage={10}
            onPageChange={setPage}
            onRowClick={setOpen}
          />
        </div>
      </IciCard>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setOpen(null)}>
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
              <h2 className="text-sm font-semibold text-slate-800">{open.subject}</h2>
              <button type="button" onClick={() => setOpen(null)} className="text-slate-400 hover:text-slate-600" aria-label="Close">✕</button>
            </div>
            <div className="space-y-3 px-5 py-4 text-sm">
              <p className="m-0 text-slate-700"><span className="font-semibold">From:</span> {open.firstName} {open.lastName} ({open.email}{open.phone ? ` · ${open.phone}` : ""})</p>
              <p className="m-0 text-xs text-slate-500">{open.createdAt ? new Date(open.createdAt).toLocaleString() : ""}</p>
              <p className="m-0 rounded bg-slate-50 p-3 text-slate-700 whitespace-pre-wrap">{open.message}</p>
              <div className="flex gap-2">
                <a href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject)}`}
                  className="flex-1 rounded-[10px] bg-primary px-3 py-2 text-center text-xs font-semibold text-white no-underline">Reply by email</a>
                {open.phone && <a href={`tel:${open.phone}`} className="flex-1 rounded-[10px] border border-slate-300 px-3 py-2 text-center text-xs font-semibold text-slate-700 no-underline">Call</a>}
              </div>
            </div>
          </div>
        </div>
      )}
      </Reveal>
    </div>
  );
}
