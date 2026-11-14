import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { IciTabs } from "./inputs";

/**
 * Ported from ici-card-craft FilterInput — no MUI.
 * Multi-category popover filter with Apply / Reset.
 * value: { [categoryKey]: string[] }
 */
export interface FilterCategory {
  key: string;
  label: string;
  options: { label: string; value: string }[];
  single?: boolean;
}

const emptyFor = (categories: FilterCategory[]): Record<string, string[]> =>
  Object.fromEntries(categories.map((c) => [c.key, []]));

export function FilterInput({
  categories,
  value,
  onChange,
}: {
  categories: FilterCategory[];
  value: Record<string, string[]>;
  onChange: (value: Record<string, string[]>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(categories[0]?.key ?? "");
  const [draft, setDraft] = useState<Record<string, string[]>>(value);
  const ref = useRef<HTMLDivElement>(null);

  const activeCategory = categories.find((c) => c.key === activeKey) ?? categories[0];
  const totalSelected = Object.values(value).reduce((n, arr) => n + arr.length, 0);
  const activeLabels = categories.filter((c) => (value[c.key]?.length ?? 0) > 0).map((c) => c.label);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleOpen = () => {
    setDraft(value);
    setActiveKey(categories[0]?.key ?? "");
    setOpen((v) => !v);
  };

  const toggle = (optValue: string) => {
    setDraft((prev) => {
      const current = prev[activeCategory.key] ?? [];
      const isOn = current.includes(optValue);
      const next = activeCategory.single ? (isOn ? [] : [optValue]) : isOn ? current.filter((v) => v !== optValue) : [...current, optValue];
      return { ...prev, [activeCategory.key]: next };
    });
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className={`inline-flex min-w-[130px] items-center justify-between gap-2 rounded border bg-white px-3.5 py-2 text-[13px] transition-colors ${
          totalSelected > 0 ? "border-primary text-primary" : "border-[#353F50] text-[#353F50] hover:bg-slate-50"
        }`}
      >
        {totalSelected > 0 ? (
          <>
            <span className="truncate">{activeLabels.join(", ")} ({totalSelected})</span>
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </>
        ) : (
          <>Add Filter <Plus size={15} /></>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-40 mt-1 w-64 rounded border border-slate-200 bg-white p-4 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">Available Filters</span>
            <button type="button" onClick={() => setOpen(false)} className="border-0 bg-transparent p-0 text-slate-400 outline-none hover:text-slate-600" aria-label="Close">
              <X size={16} />
            </button>
          </div>

          {categories.length > 1 && (
            <div className="mb-2 text-sm">
              <IciTabs tabs={categories.map((c) => ({ label: c.label, value: c.key }))} value={activeCategory.key} onChange={setActiveKey} />
            </div>
          )}

          <div className="-mx-4 my-2 flex max-h-44 flex-col overflow-auto bg-white py-1">
            {activeCategory?.options.map((opt) => {
              const checked = (draft[activeCategory.key] ?? []).includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggle(opt.value)}
                  className={`flex w-full items-center justify-between border-0 bg-transparent px-4 py-2 text-left text-sm transition-colors hover:bg-primary hover:text-white ${checked ? "font-semibold text-primary" : "text-slate-700"}`}
                >
                  {opt.label}
                  {checked && <Check size={16} />}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => { const cleared = emptyFor(categories); setDraft(cleared); onChange(cleared); setOpen(false); }}
              className="flex-1 rounded-[10px] border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Reset</button>
            <button type="button" onClick={() => { onChange(draft); setOpen(false); }}
              className="flex-1 rounded-[10px] bg-primary px-3 py-2 text-xs font-semibold text-white hover:opacity-95">Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterInput;
