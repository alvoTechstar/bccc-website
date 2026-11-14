import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react";

/**
 * Ported from ici-card-craft DataTable + Pagination — Tailwind only.
 * Header: #F3F4F6, 12px bold, body 12px semibold #353F50, row min-height 50.
 */
export interface IciColumn<T> {
  key: string;
  header: ReactNode;
  render?: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
  width?: string;
}

export function IciDataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  emptyMessage = "No records found.",
  page,
  rowsPerPage = 10,
  onPageChange,
  onRowClick,
}: {
  columns: IciColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: T) => void;
}) {
  const paginated = page !== undefined && onPageChange;
  const totalPages = paginated ? Math.max(1, Math.ceil(rows.length / rowsPerPage)) : 1;
  const currentPage = paginated ? Math.min(page ?? 0, totalPages - 1) : 0;
  const visible = paginated ? rows.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage) : rows;
  const start = rows.length === 0 ? 0 : currentPage * rowsPerPage + 1;
  const end = Math.min(rows.length, currentPage * rowsPerPage + rowsPerPage);

  const alignClass = (a?: string) => (a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left");

  const go = (p: number) => onPageChange?.(Math.min(Math.max(0, p), totalPages - 1));

  return (
    <div className="overflow-hidden bg-white">
      {!loading && rows.length === 0 ? (
        <div className="px-4 py-6 text-[13px] font-bold leading-6 text-[#353F50]">{emptyMessage}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{ width: col.width, backgroundColor: "#F3F4F6" }}
                    className={`whitespace-nowrap px-2.5 py-2.5 text-[12px] font-bold leading-[14px] text-[#353F50] first-letter:uppercase ${alignClass(col.align)}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Loading records…</span>
                  </td>
                </tr>
              )}
              {!loading &&
                visible.map((row) => (
                  <tr
                    key={rowKey(row)}
                    onClick={() => onRowClick?.(row)}
                    className={`border-t border-slate-100 transition-colors hover:bg-slate-50 ${onRowClick ? "cursor-pointer" : ""}`}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`min-h-[50px] truncate px-2.5 py-2 text-[12px] font-semibold text-[#353F50] ${alignClass(col.align)}`}
                      >
                        {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      {paginated && rows.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3" style={{ backgroundColor: "#F3F4F6" }}>
          <span className="text-xs text-slate-500">Showing {start} to {end} of {rows.length} entries</span>
          <div className="flex items-center gap-1">
            {[
              { icon: <ChevronsLeft size={14} />, p: 0, disabled: currentPage === 0, label: "First" },
              { icon: <ChevronLeft size={14} />, p: currentPage - 1, disabled: currentPage === 0, label: "Prev" },
            ].map((b, i) => (
              <button key={i} type="button" aria-label={b.label} disabled={b.disabled} onClick={() => go(b.p)}
                className="flex h-7 w-7 items-center justify-center rounded border border-primary/40 text-primary disabled:opacity-40">
                {b.icon}
              </button>
            ))}
            {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
              const p = totalPages <= 7 ? i : currentPage <= 3 ? i : currentPage >= totalPages - 4 ? totalPages - 7 + i : currentPage - 3 + i;
              return (
                <button key={p} type="button" onClick={() => go(p)}
                  className={`h-7 min-w-7 rounded border px-1.5 text-xs font-semibold ${p === currentPage ? "border-primary bg-primary text-white" : "border-primary/40 text-primary"}`}>
                  {p + 1}
                </button>
              );
            })}
            {[
              { icon: <ChevronRight size={14} />, p: currentPage + 1, disabled: currentPage >= totalPages - 1, label: "Next" },
              { icon: <ChevronsRight size={14} />, p: totalPages - 1, disabled: currentPage >= totalPages - 1, label: "Last" },
            ].map((b, i) => (
              <button key={i} type="button" aria-label={b.label} disabled={b.disabled} onClick={() => go(b.p)}
                className="flex h-7 w-7 items-center justify-center rounded border border-primary/40 text-primary disabled:opacity-40">
                {b.icon}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default IciDataTable;
