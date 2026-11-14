import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { IciCard } from "@/components/cards/card";
import { StatCard } from "@/components/cards/stat-card";
import { StatusPill } from "@/components/feedback/status-pill";
import { IciDataTable } from "@/components/data-table/data-table";
import { IciSearchInput } from "@/components/inputs/inputs";
import { FilterInput } from "@/components/inputs/filter-input";
import { DateInput, emptyRange, type DateRangeValue } from "@/components/inputs/date-input";
import { AdminGhostButton, AdminOutlineButton } from "@/components/buttons/admin-buttons";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";
import { downloadFile, toCsv } from "@/lib/admin-store";

export default function AdminGiving() {
  const { data = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin", "giving"],
    queryFn: api.getGivingRecords,
  });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({ status: [], givingType: [] });
  const [range, setRange] = useState<DateRangeValue>(emptyRange());
  const [page, setPage] = useState(0);

  const types = useMemo(() => Array.from(new Set(data.map((r) => r.givingType).filter(Boolean))), [data]);
  const statuses = useMemo(() => Array.from(new Set(data.map((r) => r.status).filter(Boolean))), [data]);

  const resetPage = () => setPage(0);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((r) => {
      if (q && !`${r.name ?? ""} ${r.phoneNumber ?? ""} ${r.givingType ?? ""} ${r.transactionId ?? ""} ${r.email ?? ""}`.toLowerCase().includes(q)) return false;
      if (filters.status.length > 0 && r.status !== filters.status[0]) return false;
      if (filters.givingType.length > 0 && !filters.givingType.includes(r.givingType)) return false;
      const day = (r.createdAt ?? "").slice(0, 10);
      if (range.startDate && day < range.startDate) return false;
      if (range.endDate && day > range.endDate) return false;
      return true;
    });
  }, [data, search, filters, range]);

  const total = filtered.reduce((s, r) => s + (Number(r.amount) || 0), 0);

  return (
    <div className="admin-nums space-y-3">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: "Records", count: filtered.length, prefix: "", hint: filters.status[0] ?? "All statuses", tone: "info" as const },
          { label: "Total", count: Math.round(total), prefix: "KES ", hint: "Filtered sum", tone: "success" as const },
          { label: "Completed", count: filtered.filter((r) => r.status === "completed").length, prefix: "", hint: "M-Pesa confirmed", tone: "neutral" as const },
        ].map((s, i) => (
          <motion.div key={s.label} variants={staggerDir(i)}>
            <StatCard label={s.label} count={s.count} prefix={s.prefix} hint={s.hint} tone={s.tone} />
          </motion.div>
        ))}
      </motion.div>

      <Reveal from="up">
      <IciCard
        title="Giving transactions"
        subtitle={`${filtered.length} of ${data.length} records · M-Pesa STK push history`}
        actions={
          <>
            <AdminGhostButton onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={13} /> {isFetching ? "Refreshing…" : "Refresh"}
            </AdminGhostButton>
            <AdminOutlineButton onClick={() => downloadFile(`giving-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(filtered as unknown as Record<string, unknown>[]))}>
              <Download size={13} /> Export
            </AdminOutlineButton>
          </>
        }
      >
        <div className="mb-3 flex flex-wrap items-end gap-2">
          <IciSearchInput value={search} onChange={(v) => { setSearch(v); resetPage(); }} placeholder="Search name, phone, type, transaction, email…" className="min-w-52 flex-1" />
          <FilterInput
            categories={[
              { key: "status", label: "Status", single: true, options: statuses.map((s) => ({ label: s, value: s })) },
              { key: "givingType", label: "Type", options: types.map((t) => ({ label: t, value: t })) },
            ]}
            value={filters}
            onChange={(v) => { setFilters(v); resetPage(); }}
          />
          <DateInput value={range} onChange={(v) => { setRange(v); resetPage(); }} />
        </div>
        <div className="overflow-hidden rounded border border-slate-100">
          <IciDataTable
            columns={[
              { key: "date", header: "Date", width: "150px", render: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleString() : "—") },
              { key: "giver", header: "Giver", render: (r) => (
                <span>
                  <span className="block font-semibold">{r.name || "—"}</span>
                  {r.email && <span className="block truncate text-[11px] font-normal text-slate-500">{r.email}</span>}
                </span>
              ) },
              { key: "type", header: "Type", render: (r) => <span className="font-semibold">{r.givingType}</span> },
              { key: "amount", header: "Amount", align: "right", width: "120px", render: (r) => `KES ${Number(r.amount).toLocaleString()}` },
              { key: "phone", header: "Phone", render: (r) => r.phoneNumber },
              { key: "status", header: "Status", width: "120px", render: (r) => <StatusPill label={r.status} width="96px" /> },
              { key: "txn", header: "Transaction", render: (r) => <span className="text-slate-500">{r.transactionId ?? "—"}</span> },
            ]}
            rows={filtered}
            rowKey={(r) => r.id}
            loading={isLoading}
            emptyMessage={isError ? "Could not load giving records — backend may be asleep." : "No giving transactions match."}
            page={page}
            rowsPerPage={10}
            onPageChange={setPage}
          />
        </div>
      </IciCard>
      </Reveal>
    </div>
  );
}
