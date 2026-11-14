import { useCallback, useEffect, useState } from "react";
import type { ChurchEvent } from "@/lib/api";

const EVENTS_KEY = "bcc_admin_events_v1";

function seed(): ChurchEvent[] {
  const now = new Date().toISOString();
  return [
    {
      id: "seed-summit-2026",
      title: "Dominion Summit 2026",
      description: "Seven glorious days, 7th–13th Dec 2026, 9AM–9PM daily at Mawanga, Kwa Buda Church Headquarters. Theme: Growing and Prevailing. Convenor Pst. J.B. Tajeu with Apostle Jesse Karanja.",
      date: "2026-12-07",
      time: "9:00 AM",
      venue: "Mawanga, Kwa Buda Church Headquarters",
      category: "Summit",
      published: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "seed-ascend-2026",
      title: "21 Days of Ascend — Prayer 'n Fasting",
      description: "21 days of seeking God, fasting 6AM–6PM with morning, evening and midnight prayers. 9th–29th Nov 2026.",
      date: "2026-11-09",
      time: "5:45 AM",
      venue: "Mawanga, Kwa Buda Church Grounds",
      category: "Fasting",
      published: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function readLocal(): ChurchEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(EVENTS_KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as ChurchEvent[];
  } catch {
    return seed();
  }
}

function writeLocal(events: ChurchEvent[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function useLocalEvents() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEvents(readLocal());
    setLoaded(true);
  }, []);

  const save = useCallback((next: ChurchEvent[]) => {
    setEvents(next);
    writeLocal(next);
  }, []);

  const create = useCallback(
    (data: Omit<ChurchEvent, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const ev: ChurchEvent = {
        ...data,
        id: `local-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      setEvents((prev) => {
        const next = [ev, ...prev];
        writeLocal(next);
        return next;
      });
      return ev;
    },
    []
  );

  const update = useCallback(
    (id: string, patch: Partial<ChurchEvent>) => {
      setEvents((prev) => {
        const next = prev.map((e) =>
          e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e
        );
        writeLocal(next);
        return next;
      });
    },
    []
  );

  const remove = useCallback((id: string) => {
    setEvents((prev) => {
      const next = prev.filter((e) => e.id !== id);
      writeLocal(next);
      return next;
    });
  }, []);

  return { events, loaded, save, create, update, remove, setEvents };
}

export function exportEventsCsv(events: ChurchEvent[]): string {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [
    ["id", "title", "date", "time", "venue", "category", "published", "description"].join(","),
    ...events.map((e) =>
      [e.id, e.title, e.date, e.time ?? "", e.venue ?? "", e.category ?? "", e.published, e.description]
        .map(esc)
        .join(",")
    ),
  ];
  return rows.join("\n");
}

export function downloadFile(filename: string, content: string, mime = "text/csv") {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}
