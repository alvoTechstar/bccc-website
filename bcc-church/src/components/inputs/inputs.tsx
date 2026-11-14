import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

/** Ported from ici-card-craft SearchInput. */
export function IciSearchInput({
  value,
  onChange,
  placeholder = "Search...",
  label,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-xs font-semibold lowercase tracking-wide text-slate-500 first-letter:uppercase">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 transition focus-within:outline focus-within:outline-1 focus-within:outline-offset-0 focus-within:outline-primary">
        <Search size={16} className="shrink-0 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}

/** Ported from ici-card-craft TextInput label convention. */
export function IciLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-xs font-semibold lowercase tracking-wide text-slate-500 first-letter:uppercase">
      {children}
    </label>
  );
}

/** Ported from ici-card-craft FilterChip — borderless dropdown chip. */
export function IciFilterChip({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);
  const triggerLabel = selected && selected.value !== "all" ? selected.label : label;

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
      >
        {triggerLabel}
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="absolute left-0 z-40 m-0 mt-1 min-w-[180px] list-none border border-slate-200 bg-white py-1 pl-0 shadow-lg">
          {options.map((o) => {
            const active = o.value === value;
            return (
              <li key={o.value}>
                <button
                  type="button"
                  onClick={() => { onChange(o.value); setOpen(false); }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-primary hover:text-white ${active ? "font-semibold text-primary" : "text-slate-700"}`}
                >
                  {o.label}
                  {active && <Check size={14} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Ported from ici-card-craft Tabs — underline style. */
export function IciTabs({
  tabs,
  value,
  onChange,
}: {
  tabs: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-6 overflow-x-auto">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={`border-0 border-b-2 bg-transparent p-0 pb-2 text-sm outline-none transition-colors ${active ? "font-medium" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            style={active ? { borderColor: "var(--color-primary)", color: "var(--color-primary)" } : undefined}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export default IciSearchInput;
