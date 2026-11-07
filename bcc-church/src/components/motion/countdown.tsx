import { useEffect, useState } from "react";
import { summit } from "@/lib/site";

export const SUMMIT_DATE = new Date("2026-12-07T08:00:00+03:00");

export function useCountdown(target: Date = SUMMIT_DATE) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    mins: Math.floor((diff / 60_000) % 60),
    secs: Math.floor((diff / 1_000) % 60),
    live: diff === 0,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Live countdown to the Dominion Summit — drop anywhere. */
export function SummitCountdown({ compact = false }: { compact?: boolean }) {
  const { days, hours, mins, secs, live } = useCountdown();
  const units = [
    { v: String(days), l: "Days" },
    { v: pad(hours), l: "Hours" },
    { v: pad(mins), l: "Minutes" },
    { v: pad(secs), l: "Seconds" },
  ];
  return (
    <div data-testid="summit-countdown" className="rounded-[1.75rem] border border-accent/35 bg-black/30 backdrop-blur px-5 py-5 sm:px-7 sm:py-6 shadow-2xl">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-accent mb-4">
        <span className={`h-2 w-2 rounded-full ${live ? "bg-red-500" : "bg-accent animate-pulse-soft"}`} />
        {live ? `${summit.name} ${summit.year} is on!` : `Countdown to ${summit.name} ${summit.year}`}
      </p>
      <div className={`flex gap-2.5 ${compact ? "" : "sm:gap-4"}`}>
        {units.map((u) => (
          <div
            key={u.l}
            className={`flex-1 rounded-2xl border border-accent/25 bg-primary/80 text-center shadow-lg ${
              compact ? "px-2 py-3" : "px-2 py-4 sm:px-4 sm:py-5"
            }`}
          >
            <p className={`font-serif font-black gold-accent tabular-nums leading-none ${compact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-6xl"}`}>
              {u.v}
            </p>
            <p className="mt-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.24em] text-white/70">{u.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
