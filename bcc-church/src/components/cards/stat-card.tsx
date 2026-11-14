import type { ReactNode } from "react";
import type { StatusTone } from "../feedback/status-pill";
import { Counter } from "../motion/reveal";

/**
 * Compact KPI card: small uppercase label, big value, optional delta pill.
 * Pass `count` (+ optional prefix/suffix) for a count-up-on-view number
 * like the public site — pass `value` for a plain string.
 */
const DELTA_TONE_CLASS: Record<StatusTone, string> = {
  success: "bg-emerald-50 text-emerald-700",
  danger: "bg-red-50 text-red-700",
  warning: "bg-amber-50 text-amber-700",
  info: "bg-blue-50 text-blue-800",
  purple: "bg-purple-50 text-purple-700",
  neutral: "bg-slate-100 text-slate-600",
};

const ICON_TONE_CLASS: Record<StatusTone, string> = {
  success: "bg-emerald-50 text-emerald-600",
  danger: "bg-red-50 text-red-600",
  warning: "bg-amber-50 text-amber-600",
  info: "bg-blue-50 text-blue-600",
  purple: "bg-purple-50 text-purple-600",
  neutral: "bg-primary/10 text-primary",
};

export function StatCard({
  icon,
  label,
  value,
  count,
  prefix = "",
  suffix = "",
  hint,
  tone = "neutral",
}: {
  icon?: ReactNode;
  label: string;
  value?: string;
  count?: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
  tone?: StatusTone;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        {icon && (
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${ICON_TONE_CLASS[tone]}`}>
            {icon}
          </span>
        )}
      </div>
      <span className="mt-1 block text-[26px] font-bold leading-8 text-slate-800">
        {count !== undefined ? (
          <>{prefix}<Counter to={count} suffix={suffix} /></>
        ) : (
          value
        )}
      </span>
      {hint && (
        <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${DELTA_TONE_CLASS[tone]}`}>
          {hint}
        </span>
      )}
    </div>
  );
}

export default StatCard;
