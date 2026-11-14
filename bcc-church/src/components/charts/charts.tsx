import { useState } from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* ---------------- TrendChart (recharts line, ICI style) ---------------- */

export interface TrendSeries {
  key: string;
  label: string;
  color: string;
  values: number[];
}

function TrendTooltip({ active, payload, label }: { active?: boolean; payload?: { name?: string; value?: number | string; color?: string; dataKey?: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-2.5 shadow-md">
      <p className="m-0 mb-1 text-xs font-semibold text-slate-500">{label}</p>
      {payload.map((entry) => (
        <p key={String(entry.name ?? entry.dataKey)} className="m-0 flex items-center gap-1.5 text-xs text-slate-700">
          <span className="inline-block h-0.5 w-3 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="font-bold text-slate-900">{Number(entry.value ?? 0).toLocaleString()}</span>
          {entry.name}
        </p>
      ))}
    </div>
  );
}

export function TrendChart({
  categories,
  series,
  height = 280,
  emptyMessage = "No activity in this period.",
}: {
  categories: string[];
  series: TrendSeries[];
  height?: number;
  emptyMessage?: string;
}) {
  const hasData = categories.length > 0 && series.some((s) => s.values.some((v) => v > 0));
  if (!hasData) {
    return <div className="flex items-center justify-center text-sm font-bold text-[#353F50]" style={{ height }}>{emptyMessage}</div>;
  }
  const data = categories.map((category, i) => {
    const point: Record<string, string | number> = { category };
    series.forEach((s) => { point[s.key] = s.values[i] ?? 0; });
    return point;
  });
  return (
    <div className="flex flex-col gap-2">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
          <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" stroke="#E5E7EB" />
          <Tooltip content={<TrendTooltip />} />
          <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} tickMargin={4} axisLine={false} tickLine={false} allowDecimals={false} />
          {series.map((s) => (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="inline-block h-0.5 w-3 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- BarChart (pure CSS, ICI style) ---------------- */

export interface BarChartBar {
  key: string;
  label: string;
  value: number;
  color: string;
}

export interface BarChartRow {
  key: string;
  category: string;
  bars: BarChartBar[];
  note?: string;
}

const niceMax = (value: number): number => {
  if (value <= 0) return 4;
  const exponent = Math.floor(Math.log10(value));
  const fraction = value / 10 ** exponent;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * 10 ** exponent;
};

export function IciBarChart({
  rows,
  legend,
  emptyMessage = "No data for this period.",
}: {
  rows: BarChartRow[];
  legend?: { key: string; label: string; color: string }[];
  emptyMessage?: string;
}) {
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  if (rows.length === 0) {
    return <div className="flex items-center justify-center py-10 text-sm font-bold text-[#353F50]">{emptyMessage}</div>;
  }
  const domainMax = niceMax(Math.max(...rows.flatMap((r) => r.bars.map((b) => b.value)), 0) * 1.1);
  const ticks = [0, domainMax / 2, domainMax];
  return (
    <div className="flex flex-col gap-4">
      {legend && (
        <div className="flex items-center gap-4">
          {legend.map((entry) => (
            <span key={entry.key} className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: entry.color }} />
              {entry.label}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center gap-3">
            <div className="w-24 shrink-0 truncate text-right text-xs font-medium text-slate-600" title={row.category}>
              {row.category}
            </div>
            <div className="relative flex-1">
              {ticks.map((t) => (
                <div key={t} className="absolute top-0 bottom-0 w-px bg-slate-100" style={{ left: `${(t / domainMax) * 100}%` }} />
              ))}
              <div className="relative flex flex-col gap-0.5 py-0.5">
                {row.bars.map((bar) => {
                  const isHovered = hoverKey === `${row.key}-${bar.key}`;
                  const widthPct = (bar.value / domainMax) * 100;
                  return (
                    <div key={bar.key} className="flex items-center gap-2">
                      <div className="h-3 flex-1 rounded-sm bg-transparent">
                        <div
                          className="h-3 rounded-r-[4px]"
                          style={{ width: `${Math.max(widthPct, bar.value > 0 ? 1.5 : 0)}%`, backgroundColor: bar.color, filter: isHovered ? "brightness(0.88)" : undefined }}
                          onMouseEnter={() => setHoverKey(`${row.key}-${bar.key}`)}
                          onMouseLeave={() => setHoverKey(null)}
                          role="img"
                          aria-label={`${row.category} — ${bar.label}: ${bar.value}`}
                        />
                      </div>
                      <span className="w-16 shrink-0 text-right text-xs font-semibold text-slate-700">{bar.value.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {row.note && <div className="w-20 shrink-0 text-xs text-slate-400">{row.note}</div>}
          </div>
        ))}
        <div className="flex items-center gap-3">
          <div className="w-24 shrink-0" />
          <div className="relative flex-1 border-t border-slate-100 pt-1">
            {ticks.map((t) => (
              <span key={t} className="absolute -translate-x-1/2 text-[10px] text-slate-400" style={{ left: `${(t / domainMax) * 100}%` }}>
                {Math.round(t).toLocaleString()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- DonutChart (recharts pie, ICI style) ---------------- */

export interface DonutSlice {
  key: string;
  label: string;
  value: number;
  color: string;
}

export function DonutChart({
  data,
  centerLabel,
  unitLabel,
  emptyMessage = "No data for this period.",
}: {
  data: DonutSlice[];
  centerLabel?: string;
  unitLabel?: string;
  emptyMessage?: string;
}) {
  const total = data.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) {
    return <div className="flex items-center justify-center py-10 text-sm font-bold text-[#353F50]">{emptyMessage}</div>;
  }
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="relative mx-auto size-40 shrink-0 sm:mx-0">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Tooltip formatter={(value, name) => [Number(value ?? 0).toLocaleString(), name]} />
            <Pie data={data} dataKey="value" nameKey="label" innerRadius="62%" outerRadius="100%" paddingAngle={data.length > 1 ? 3 : 0} cornerRadius={6} stroke="none">
              {data.map((slice) => (
                <Cell key={slice.key} fill={slice.color} />
              ))}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-slate-800">{total.toLocaleString()}</span>
          {centerLabel && <span className="text-[11px] text-slate-400">{centerLabel}</span>}
        </div>
      </div>
      <div className="flex flex-1 min-w-0 flex-col gap-3">
        {data.map((slice) => {
          const percentage = Math.round((slice.value / total) * 100);
          return (
            <div key={slice.key} className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="m-0 truncate text-sm font-semibold text-slate-800">{slice.label}</p>
                  <p className="m-0 text-sm font-bold text-slate-800">{percentage}%</p>
                </div>
                <p className="m-0 text-xs text-slate-400">{slice.value.toLocaleString()}{unitLabel ? ` ${unitLabel}` : ""}</p>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full transition-all" style={{ width: `${percentage}%`, backgroundColor: slice.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TrendChart;
