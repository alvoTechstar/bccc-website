import { useEffect, useRef, useState } from "react";
import { CalendarDays, Check, X } from "lucide-react";

/**
 * Ported from ici-card-craft DateInput — presets + custom range,
 * native date fields instead of MUI pickers (no extra deps).
 * Dates are yyyy-MM-dd (compare directly with record createdAt slices).
 */
export interface DateRangeValue {
  startDate: string;
  endDate: string;
}

const PRESETS = ["Today", "Last 7 days", "Last 30 days", "Last 60 days", "Custom"] as const;
type Preset = (typeof PRESETS)[number];

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };

const presetRange = (preset: Preset): DateRangeValue | null => {
  const end = toIso(new Date());
  switch (preset) {
    case "Today": return { startDate: end, endDate: end };
    case "Last 7 days": return { startDate: toIso(daysAgo(6)), endDate: end };
    case "Last 30 days": return { startDate: toIso(daysAgo(29)), endDate: end };
    case "Last 60 days": return { startDate: toIso(daysAgo(59)), endDate: end };
    default: return null;
  }
};

const display = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}-${m}-${y}` : iso;
};

const optionClass = (selected: boolean) =>
  `flex w-full items-center justify-between border-0 bg-transparent px-4 py-2 text-left text-sm transition-colors hover:bg-primary hover:text-white ${selected ? "font-semibold text-primary" : "text-slate-700"}`;

export function todayRange(): DateRangeValue {
  const t = toIso(new Date());
  return { startDate: t, endDate: t };
}

export const emptyRange = (): DateRangeValue => ({ startDate: "", endDate: "" });

export function DateInput({
  value,
  onChange,
  active,
}: {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  active?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<Preset>("Today");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const isActive = active ?? (value.startDate !== "" || value.endDate !== "");

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleOpen = () => {
    const today = toIso(new Date());
    const isToday = value.startDate === today && value.endDate === today;
    setPreset(isToday ? "Today" : value.startDate ? "Custom" : "Today");
    setStart(value.startDate);
    setEnd(value.endDate);
    setOpen((v) => !v);
  };

  const canApply = preset !== "Custom" || (start !== "" && end !== "" && start <= end);

  const handleApply = () => {
    if (preset !== "Custom") {
      const range = presetRange(preset);
      if (range) onChange(range);
    } else if (start && end) {
      onChange({ startDate: start, endDate: end });
    }
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className={`inline-flex items-center gap-2 rounded border bg-white px-3.5 py-2 text-[13px] transition-colors ${
          isActive ? "border-primary text-primary" : "border-[#353F50] text-[#353F50] hover:bg-slate-50"
        }`}
      >
        <CalendarDays size={15} />
        {isActive && value.startDate ? `${display(value.startDate)} – ${display(value.endDate)}` : "Date Range"}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-40 mt-1 w-64 rounded border border-slate-200 bg-white p-4 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">Time Period</span>
            <button type="button" onClick={() => setOpen(false)} className="border-0 bg-transparent p-0 text-slate-400 outline-none hover:text-slate-600" aria-label="Close">
              <X size={16} />
            </button>
          </div>

          <div className="-mx-4 flex flex-col bg-white py-1">
            {PRESETS.map((p) => (
              <button key={p} type="button" onClick={() => setPreset(p)} className={optionClass(preset === p)}>
                {p}
                {preset === p && <Check size={16} />}
              </button>
            ))}
          </div>

          {preset === "Custom" && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-semibold lowercase tracking-wide text-slate-500 first-letter:uppercase">Start date</label>
                <input type="date" value={start} max={toIso(new Date())} onChange={(e) => setStart(e.target.value)}
                  className="w-full border border-slate-200 bg-white px-2 py-2 text-xs text-slate-800 outline-none focus:outline focus:outline-1 focus:outline-offset-0 focus:outline-primary" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold lowercase tracking-wide text-slate-500 first-letter:uppercase">End date</label>
                <input type="date" value={end} min={start || undefined} max={toIso(new Date())} onChange={(e) => setEnd(e.target.value)}
                  className="w-full border border-slate-200 bg-white px-2 py-2 text-xs text-slate-800 outline-none focus:outline focus:outline-1 focus:outline-offset-0 focus:outline-primary" />
              </div>
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => { onChange(emptyRange()); setOpen(false); }}
              className="flex-1 rounded-[10px] border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Reset</button>
            <button type="button" onClick={handleApply} disabled={!canApply}
              className="flex-1 rounded-[10px] bg-primary px-3 py-2 text-xs font-semibold text-white hover:opacity-95 disabled:opacity-50">Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateInput;
