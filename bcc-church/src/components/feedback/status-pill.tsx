import type { ReactNode } from "react";

/**
 * Ported from ici-card-craft StatusPill — no MUI, Tailwind only.
 * Uniform width via `width` (min-width, centered) + small radius by default.
 */
export type StatusTone = "success" | "danger" | "warning" | "info" | "purple" | "neutral";

const toneClass: Record<StatusTone, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  info: "bg-blue-50 text-blue-800 ring-blue-200",
  purple: "bg-purple-50 text-purple-700 ring-purple-200",
  neutral: "bg-slate-100 text-slate-600 ring-slate-200",
};

const dotClass: Record<StatusTone, string> = {
  success: "bg-emerald-500",
  danger: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-600",
  purple: "bg-purple-500",
  neutral: "bg-slate-400",
};

export function statusToTone(status: string): StatusTone {
  const normalized = status.toLowerCase().trim();
  const key = normalized.replace(/-/g, "_").replace(/ /g, "_");
  if (["active", "approved", "success", "completed", "confirmed", "published", "resubmission_accepted"].includes(key)) return "success";
  if (["declined", "failed", "blocked", "rejected", "cancelled", "canceled", "inactive"].includes(key)) return "danger";
  if (["new", "pending", "hold", "dormant", "processing", "returned", "return", "initiated", "draft"].includes(key)) return "warning";
  if (["tithe", "offering", "general", "offering_general"].includes(key)) return "info";
  if (["building", "building_fund", "mission", "mission_support"].includes(key)) return "purple";
  return "neutral";
}

export function StatusPill({
  label,
  tone,
  showDot = true,
  radius = "sm",
  width,
  className,
}: {
  label: ReactNode;
  tone?: StatusTone;
  showDot?: boolean;
  radius?: "full" | "sm";
  width?: string;
  className?: string;
}) {
  const t = tone ?? statusToTone(typeof label === "string" ? label : "neutral");
  return (
    <span
      style={width ? { minWidth: width } : undefined}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap ${width ? "justify-center" : ""} ${radius === "full" ? "rounded-full" : "rounded-[3px]"} px-2.5 py-1 text-xs font-semibold ring-1 ${toneClass[t]} ${className ?? ""}`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${dotClass[t]}`} />}
      {label}
    </span>
  );
}

export default StatusPill;
