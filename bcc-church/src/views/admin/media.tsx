import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle2, Clapperboard, Facebook, ImagePlus, Instagram, Music2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, type PublishTarget } from "@/lib/api";
import { IciCard } from "@/components/cards/card";
import { StatCard } from "@/components/cards/stat-card";
import { StatusPill } from "@/components/feedback/status-pill";
import { FormTextarea } from "@/components/inputs/form-field";
import { AdminButton } from "@/components/buttons/admin-buttons";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";

const TARGETS: { key: PublishTarget; label: string; hint: string; icon: ReactNode }[] = [
  { key: "facebook", label: "Facebook", hint: "Church page post", icon: <Facebook size={16} /> },
  { key: "instagram", label: "Instagram", hint: "Photo / reel", icon: <Instagram size={16} /> },
  { key: "tiktok", label: "TikTok", hint: "Direct video post", icon: <Music2 size={16} /> },
];

function isVideo(f: File) {
  return f.type.startsWith("video/");
}

function MediaThumb({ file, onRemove }: { file: File; onRemove: () => void }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return (
    <span className="group relative block overflow-hidden rounded-lg border border-slate-200">
      {isVideo(file) ? (
        <video src={url} className="aspect-square h-full w-full object-cover" muted playsInline />
      ) : (
        <img src={url} alt={file.name} loading="lazy" className="aspect-square h-full w-full object-cover" />
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove file"
        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
      >
        <X size={13} />
      </button>
    </span>
  );
}

export default function AdminMedia() {
  const { toast } = useToast();
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [targets, setTargets] = useState<PublishTarget[]>(["facebook"]);
  const inputRef = useRef<HTMLInputElement>(null);

  const publish = useMutation({
    mutationFn: () => api.publishMedia(caption.trim(), files, targets),
    onSuccess: (r) => {
      const ok = Object.entries(r.results).filter(([, v]) => v.ok).length;
      const total = Object.keys(r.results).length;
      toast({
        title: ok === total ? "Published everywhere" : `Published to ${ok} of ${total}`,
        description: ok === total ? undefined : "Open a failed row below to see why.",
      });
    },
    onError: (e: Error) => toast({ title: "Publish failed", description: e.message, variant: "destructive" }),
  });

  const result = publish.data;
  const toggle = (t: PublishTarget) =>
    setTargets((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

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
          { icon: <Clapperboard size={16} />, label: "Ready to post", count: files.length, hint: "Files picked", tone: "info" as const },
          { icon: <Facebook size={16} />, label: "Destinations", count: targets.length, hint: "Targets ticked", tone: "purple" as const },
          { icon: <CheckCircle2 size={16} />, label: "Succeeded", count: result ? Object.values(result.results).filter((r) => r.ok).length : 0, hint: "Last publish", tone: "success" as const },
        ].map((s, i) => (
          <motion.div key={s.label} variants={staggerDir(i)}>
            <StatCard icon={s.icon} label={s.label} count={s.count} hint={s.hint} tone={s.tone} />
          </motion.div>
        ))}
      </motion.div>

      <Reveal from="up">
        <IciCard
          title="Publish service media"
          subtitle="Upload Sunday photos or a reel, write the caption once, post it to Facebook — Instagram and TikTok light up once connected"
          actions={
            <AdminButton
              onClick={() => publish.mutate()}
              disabled={publish.isPending || files.length === 0 || targets.length === 0}
            >
              {publish.isPending ? "Publishing…" : "Publish now"}
            </AdminButton>
          }
        >
          <div className="space-y-4">
            <FormTextarea
              label="Caption"
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What a service! 🙌 #DominionSummit #BCCChurch"
            />

            {files.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {files.map((f, i) => (
                  <MediaThumb key={`${f.name}-${f.size}-${i}`} file={f} onRemove={() => setFiles((prev) => prev.filter((_, j) => j !== i))} />
                ))}
              </div>
            )}
            <div>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-[#F8F8F8] px-3 py-4 text-xs font-semibold text-slate-500 transition hover:border-primary hover:text-primary"
              >
                <ImagePlus size={16} />
                {files.length > 0 ? "Add more photos / video" : "Upload photos or a reel from this device"}
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
                multiple
                className="hidden"
                onChange={(e) => {
                  setFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])].slice(0, 11));
                  e.target.value = "";
                }}
              />
              <p className="mt-1 text-[11px] text-slate-400">Photos + one video per publish (MP4/MOV, up to 150MB).</p>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Post to</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {TARGETS.map((t) => {
                  const on = targets.includes(t.key);
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => toggle(t.key)}
                      aria-pressed={on}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                        on ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${on ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}>
                        {t.icon}
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-slate-800">{t.label}</span>
                        <span className="block text-[11px] text-slate-500">{t.hint}</span>
                      </span>
                      <span className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full border ${on ? "border-primary bg-primary text-white" : "border-slate-300 text-transparent"}`}>
                        <CheckCircle2 size={13} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {result && (
              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Last publish</p>
                {Object.entries(result.results).map(([target, r]) => (
                  <div key={target} className="flex flex-wrap items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm">
                    <span className="text-sm font-bold capitalize text-slate-700">{target}</span>
                    <StatusPill label={r.ok ? "Posted" : "Not posted"} tone={r.ok ? "success" : "warning"} showDot={false} />
                    {r.url ? (
                      <a href={r.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary hover:underline">View post →</a>
                    ) : (
                      <span className="text-xs text-slate-500">{r.error ?? r.message ?? "No details"}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </IciCard>
      </Reveal>
    </div>
  );
}
