import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Download, History, MapPin, Pencil, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { downloadFile, exportEventsCsv } from "@/lib/admin-store";
import { api, type ChurchEvent, type EventInput } from "@/lib/api";
import { IciCard } from "@/components/cards/card";
import { StatCard } from "@/components/cards/stat-card";
import { StatusPill } from "@/components/feedback/status-pill";
import { FormInput, FormTextarea } from "@/components/inputs/form-field";
import { ImageUpload } from "@/components/inputs/image-upload";
import {
  AddButton,
  AdminButton,
  AdminDangerButton,
  AdminGhostButton,
} from "@/components/buttons/admin-buttons";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";

function dateParts(iso?: string): { day: string; mon: string } {
  if (!iso) return { day: "—", mon: "TBD" };
  const d = new Date(`${iso.slice(0, 10)}T00:00`);
  if (Number.isNaN(d.getTime())) return { day: "—", mon: "TBD" };
  return {
    day: String(d.getDate()).padStart(2, "0"),
    mon: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
  };
}

const EMPTY: EventInput = { title: "", description: "", date: "", time: "", venue: "", category: "General", published: true };

export default function AdminEvents() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: events = [], isLoading, isError, refetch, isFetching } = useQuery<ChurchEvent[]>({
    queryKey: ["admin", "events"],
    queryFn: api.getEvents,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ChurchEvent | null>(null);
  const [form, setForm] = useState<EventInput>(EMPTY);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["admin", "events"] }); };

  const openCreate = () => { setEditing(null); setForm(EMPTY); setExistingImages([]); setNewFiles([]); setDialogOpen(true); };
  const openEdit = (e: ChurchEvent) => {
    setEditing(e);
    setForm({ title: e.title, description: e.description, date: e.date?.slice(0, 10) ?? "", time: e.time ?? "", venue: e.venue ?? "", category: e.category ?? "General", published: e.published });
    setExistingImages(e.images && e.images.length > 0 ? e.images : (e.imageUrl ? [e.imageUrl] : []));
    setNewFiles([]);
    setDialogOpen(true);
  };

  const save = useMutation({
    mutationFn: () => {
      if (!form.title.trim() || !form.date) throw new Error("Title and date are required.");
      const payload = { ...form, images: newFiles, keepImages: existingImages };
      return editing ? api.updateEvent(editing.id, payload) : api.createEvent(payload);
    },
    onSuccess: () => { toast({ title: editing ? "Event updated" : "Event created" }); setDialogOpen(false); invalidate(); },
    onError: (e: Error) => toast({ title: "Save failed", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.deleteEvent(id),
    onSuccess: () => { toast({ title: "Event deleted" }); invalidate(); },
    onError: (e: Error) => toast({ title: "Delete failed", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-3">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { icon: <CalendarDays size={16} />, label: "Total events", count: events.length, hint: "All gatherings", tone: "info" as const },
          { icon: <Sparkles size={16} />, label: "Upcoming", count: events.filter((e) => (e.date ?? "") >= new Date().toISOString().slice(0, 10)).length, hint: "Still to come", tone: "success" as const },
          { icon: <History size={16} />, label: "Past", count: events.filter((e) => (e.date ?? "") < new Date().toISOString().slice(0, 10)).length, hint: "Already held", tone: "neutral" as const },
        ].map((s, i) => (
          <motion.div key={s.label} variants={staggerDir(i)}>
            <StatCard icon={s.icon} label={s.label} count={s.count} hint={s.hint} tone={s.tone} />
          </motion.div>
        ))}
      </motion.div>

      <Reveal from="left">
      <IciCard
        title={`Events · ${events.length}`}
        subtitle="Church gatherings — photos upload with each event"
        actions={
          <>
            <AdminGhostButton onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={13} /> {isFetching ? "Loading…" : "Refresh"}
            </AdminGhostButton>
            <AdminGhostButton onClick={() => downloadFile(`events-${new Date().toISOString().slice(0, 10)}.csv`, exportEventsCsv(events))}>
              <Download size={13} /> CSV
            </AdminGhostButton>
            <AdminGhostButton onClick={() => downloadFile(`events-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(events, null, 2), "application/json")}>
              JSON
            </AdminGhostButton>
            <AddButton onClick={openCreate} data-testid="button-event-new">
              New event
            </AddButton>
          </>
        }
      >
        {isLoading ? (
          <p className="py-8 text-center text-sm text-slate-500">Loading events…</p>
        ) : isError ? (
          <p className="py-8 text-center text-[13px] font-bold text-[#353F50]">Could not load events — backend may be asleep.</p>
        ) : events.length === 0 ? (
          <p className="py-4 text-center text-[13px] font-bold text-[#353F50]">No events — create the first one.</p>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-40px" }}
            className="grid gap-4 md:grid-cols-2"
          >
            {events.map((e, i) => {
              const { day, mon } = dateParts(e.date);
              return (
                <motion.article
                  key={e.id}
                  variants={staggerDir(i)}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="group flex gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-xl"
                >
                  {/* Date badge */}
                  <div className="flex w-16 shrink-0 flex-col items-center justify-center self-stretch rounded-xl bg-primary py-3 text-white">
                    <span className="font-serif text-3xl font-black leading-none">{day}</span>
                    <span className="mt-1 text-[11px] font-black uppercase tracking-[0.2em] text-accent">{mon}</span>
                    {e.time && <span className="mt-1 px-1 text-center text-[10px] font-semibold leading-tight text-white/70">{e.time}</span>}
                  </div>
                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <StatusPill label={e.category ?? "General"} tone="info" showDot={false} />
                      {!e.published && <StatusPill label="Draft" tone="warning" />}
                    </div>
                    <h3 className="mt-1.5 truncate text-[15px] font-bold text-slate-800">{e.title}</h3>
                    {e.venue && <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500"><MapPin size={12} className="shrink-0 text-accent" /> {e.venue}</p>}
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-600">{e.description}</p>
                    <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                      <AdminGhostButton onClick={() => openEdit(e)}><Pencil size={13} /> Edit</AdminGhostButton>
                      <AdminDangerButton onClick={() => { if (confirm(`Delete "${e.title}"?`)) remove.mutate(e.id); }}>
                        <Trash2 size={13} /> Delete
                      </AdminDangerButton>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </IciCard>
      </Reveal>

      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setDialogOpen(false)}>
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
              <h2 className="text-sm font-semibold text-slate-800">{editing ? "Edit event" : "New event"}</h2>
              <button type="button" onClick={() => setDialogOpen(false)} className="text-slate-400 hover:text-slate-600" aria-label="Close">✕</button>
            </div>
            <div className="space-y-3 px-5 py-4">
              <FormInput label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Dominion Summit 2027" />
              <div className="grid gap-3 md:grid-cols-2">
                <FormInput label="Date *" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <FormInput label="Time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="9:00 AM" />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <FormInput label="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="Mawanga Headquarters" />
                <FormInput label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Summit / Fasting / Service" />
              </div>
              <FormTextarea label="Description *" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <ImageUpload
                label="Photos"
                existing={existingImages}
                onRemoveExisting={(url) => setExistingImages((prev) => prev.filter((u) => u !== url))}
                files={newFiles}
                onAdd={(picked) => setNewFiles((prev) => [...prev, ...picked].slice(0, 10))}
                onRemoveFile={(i) => setNewFiles((prev) => prev.filter((_, j) => j !== i))}
                hint="JPG, PNG or WEBP — up to 10. The first photo is the cover."
              />
              <div className="flex justify-end gap-2">
                <AdminGhostButton onClick={() => setDialogOpen(false)}>Cancel</AdminGhostButton>
                <AdminButton onClick={() => save.mutate()} disabled={save.isPending}>
                  {save.isPending ? "Saving…" : editing ? "Save changes" : "Create event"}
                </AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
