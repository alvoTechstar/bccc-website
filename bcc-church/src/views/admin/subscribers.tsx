import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { IciCard } from "@/components/cards/card";
import { StatCard } from "@/components/cards/stat-card";
import { IciDataTable } from "@/components/data-table/data-table";
import { IciSearchInput } from "@/components/inputs/inputs";
import { FilterInput } from "@/components/inputs/filter-input";
import { AdminGhostButton, AdminOutlineButton } from "@/components/buttons/admin-buttons";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";
import { downloadFile, toCsv } from "@/lib/admin-store";

export default function AdminSubscribers() {
  const { data = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin", "subs"],
    queryFn: api.getNewsletterSubscribers,
  });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({ source: [] });
  const [page, setPage] = useState(0);

  const sources = useMemo(() => Array.from(new Set(data.map((s) => s.source).filter((v): v is string => !!v))), [data]);
  const resetPage = () => setPage(0);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((s) => {
      if (q && !`${s.email} ${s.name ?? ""} ${s.source ?? ""}`.toLowerCase().includes(q)) return false;
      if (filters.source.length > 0 && !filters.source.includes(s.source ?? "")) return false;
      return true;
    });
  }, [data, search, filters]);

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
          { label: "Total subscribers", count: data.length, hint: "Newsletter list", tone: "purple" as const },
          { label: "Joined this month", count: data.filter((s) => s.createdAt && new Date(s.createdAt).getMonth() === new Date().getMonth()).length, hint: "Growth signal", tone: "success" as const },
        ].map((s, i) => (
          <motion.div key={s.label} variants={staggerDir(i)}>
            <StatCard label={s.label} count={s.count} hint={s.hint} tone={s.tone} />
          </motion.div>
        ))}
      </motion.div>

      <Reveal from="up">
      <IciCard
        title="Subscribers"
        subtitle={`${filtered.length} of ${data.length} · welcome emails sent on signup`}
        actions={
          <>
            <AdminGhostButton onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={13} /> {isFetching ? "Refreshing…" : "Refresh"}
            </AdminGhostButton>
            <AdminOutlineButton onClick={() => downloadFile(`subscribers-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(filtered as unknown as Record<string, unknown>[]))}>
              <Download size={13} /> Export CSV
            </AdminOutlineButton>
          </>
        }
      >
        <div className="mb-3 flex flex-wrap items-end gap-2">
          <IciSearchInput value={search} onChange={(v) => { setSearch(v); resetPage(); }} placeholder="Search email, name, source…" className="min-w-52 flex-1" />
          <FilterInput
            categories={[{ key: "source", label: "Source", options: sources.map((s) => ({ label: s, value: s })) }]}
            value={filters}
            onChange={(v) => { setFilters(v); resetPage(); }}
          />
        </div>
        <div className="overflow-hidden rounded border border-slate-100">
          <IciDataTable
            columns={[
              { key: "email", header: "Email", render: (s) => <span className="font-semibold">{s.email}</span> },
              { key: "name", header: "Name", width: "170px", render: (s) => s.name ?? "—" },
              { key: "source", header: "Source", width: "150px", render: (s) => s.source ?? "—" },
              { key: "joined", header: "Joined", width: "120px", render: (s) => (s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—") },
            ]}
            rows={filtered}
            rowKey={(s) => s.id}
            loading={isLoading}
            emptyMessage={isError ? "Could not load subscribers — backend may be asleep." : "No subscribers yet. Share the newsletter form on the Blog page."}
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
