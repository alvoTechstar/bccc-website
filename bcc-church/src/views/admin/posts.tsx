import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, FileText, Pencil, PenLine, RefreshCw, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { api, type BlogPostInput } from "@/lib/api";
import type { BlogPost } from "@/lib/schemas";
import { IciCard } from "@/components/cards/card";
import { StatCard } from "@/components/cards/stat-card";
import { StatusPill } from "@/components/feedback/status-pill";
import { FormInput, FormSelect, FormTextarea } from "@/components/inputs/form-field";
import { ImageUpload } from "@/components/inputs/image-upload";
import { resolveUploadUrl } from "@/utilities/Endpoints";
import {
  AddButton,
  AdminButton,
  AdminDangerButton,
  AdminGhostButton,
} from "@/components/buttons/admin-buttons";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";

const CATEGORIES = ["Spiritual Growth", "Community Outreach", "Youth Ministry", "Church Development", "Worship Ministry", "Women's Ministry", "Leadership Training"];
const EMPTY: BlogPostInput = { title: "", content: "", excerpt: "", category: "Spiritual Growth", author: "", published: true };

export default function AdminPosts() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: posts = [], isLoading, isError, refetch, isFetching } = useQuery<BlogPost[]>({
    queryKey: ["admin", "posts"],
    queryFn: () => api.getBlogPosts(),
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<BlogPostInput>(EMPTY);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [syncSecret, setSyncSecret] = useState("");

  const openCreate = () => { setEditing(null); setForm(EMPTY); setExistingImages([]); setNewFiles([]); setDialogOpen(true); };
  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({ title: p.title, content: p.content, excerpt: p.excerpt, category: p.category, author: p.author, published: p.published });
    setExistingImages(p.images && p.images.length > 0 ? p.images : (p.imageUrl ? [p.imageUrl] : []));
    setNewFiles([]);
    setDialogOpen(true);
  };

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["admin", "posts"] }); qc.invalidateQueries({ queryKey: ["/api/blog/posts"] }); };

  const save = useMutation({
    mutationFn: () => {
      const payload = { ...form, images: newFiles, keepImages: existingImages };
      return editing ? api.updateBlogPost(editing.id, payload) : api.createBlogPost(payload);
    },
    onSuccess: () => { toast({ title: editing ? "Post updated" : "Post created" }); setDialogOpen(false); invalidate(); },
    onError: (e: Error) => toast({ title: "Save failed", description: e.message, variant: "destructive" }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api.deleteBlogPost(id),
    onSuccess: () => { toast({ title: "Post deleted" }); invalidate(); },
    onError: (e: Error) => toast({ title: "Delete failed", description: e.message, variant: "destructive" }),
  });
  const syncFb = useMutation({
    mutationFn: () => api.syncFacebookPosts(20, syncSecret.trim() || undefined),
    onSuccess: (r) => { toast({ title: "Facebook sync done", description: `Fetched ${r.fetched}, created ${r.created}, updated ${r.updated}.` }); invalidate(); },
    onError: (e: Error) => toast({ title: "Sync failed", description: e.message, variant: "destructive" }),
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
          { icon: <FileText size={16} />, label: "Total posts", count: posts.length, hint: "All articles", tone: "info" as const },
          { icon: <Eye size={16} />, label: "Published", count: posts.filter((p) => p.published).length, hint: "Live on blog", tone: "success" as const },
          { icon: <PenLine size={16} />, label: "Drafts", count: posts.filter((p) => !p.published).length, hint: "Unpublished", tone: "warning" as const },
        ].map((s, i) => (
          <motion.div key={s.label} variants={staggerDir(i)}>
            <StatCard icon={s.icon} label={s.label} count={s.count} hint={s.hint} tone={s.tone} />
          </motion.div>
        ))}
      </motion.div>

      <Reveal from="left">
      <IciCard
        title={`Blog posts · ${posts.length}`}
        subtitle="Create, edit and publish articles · Facebook sync pulls the church page"
        actions={
          <>
            <AdminGhostButton onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={13} /> {isFetching ? "Loading…" : "Refresh"}
            </AdminGhostButton>
            <AddButton onClick={openCreate} data-testid="button-post-new">
              New post
            </AddButton>
          </>
        }
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-end">
          <div className="flex-1">
            <FormInput
              label="Sync secret (only if backend sets SYNC_SECRET)"
              type="password"
              value={syncSecret}
              onChange={(e) => setSyncSecret(e.target.value)}
              placeholder="x-sync-secret (optional)"
            />
          </div>
          <AdminGhostButton onClick={() => syncFb.mutate()} disabled={syncFb.isPending}>
            {syncFb.isPending ? "Syncing…" : "Sync from Facebook"}
          </AdminGhostButton>
        </div>
      </IciCard>
      </Reveal>

      {isLoading ? (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">Loading posts…</p>
      ) : isError ? (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-[13px] font-bold text-[#353F50]">Could not load posts — backend may be asleep.</p>
      ) : posts.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-[13px] font-bold text-[#353F50]">No posts yet — create the first one.</p>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-40px" }}
          className="grid gap-4 md:grid-cols-2"
        >
          {posts.map((p, i) => (
            <motion.article
              key={p.id}
              variants={staggerDir(i)}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl"
            >
              {/* Cover — uploaded photo or funky gradient monogram */}
              <div className="relative h-40 shrink-0 overflow-hidden">
                {(p.images?.[0] ?? p.imageUrl) ? (
                  <img
                    src={resolveUploadUrl(p.images?.[0] ?? p.imageUrl) ?? ""}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#1d3a6e] to-royal" />
                    <div className="absolute inset-0 african-pattern opacity-60" />
                    <span className="absolute -bottom-7 -right-2 font-serif text-[130px] font-black leading-none text-white/15">
                      {(p.title || "?").charAt(0).toUpperCase()}
                    </span>
                    <span className="absolute bottom-3 left-4 font-serif text-lg font-bold italic text-white/85">
                      BCC Stories
                    </span>
                  </>
                )}
                <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute left-3 top-3 flex gap-1.5">
                  <StatusPill label={p.category} tone="info" showDot={false} />
                  {p.source === "facebook" ? <StatusPill label="Facebook" tone="purple" /> : null}
                  {!p.published ? <StatusPill label="Draft" tone="warning" /> : null}
                </span>
              </div>
              {/* Body */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-1 font-serif text-lg font-bold leading-snug text-slate-800">{p.title}</h3>
                <p className="mt-0.5 text-xs font-semibold text-slate-400">
                  By {p.author}{p.createdAt ? ` · ${new Date(p.createdAt).toLocaleDateString()}` : ""}
                </p>
                <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-slate-600">{p.excerpt}</p>
                <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                  <AdminGhostButton onClick={() => openEdit(p)}><Pencil size={13} /> Edit</AdminGhostButton>
                  <AdminDangerButton onClick={() => { if (confirm(`Delete "${p.title}"?`)) remove.mutate(p.id); }}>
                    <Trash2 size={13} /> Delete
                  </AdminDangerButton>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}

      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setDialogOpen(false)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
              <h2 className="text-sm font-semibold text-slate-800">{editing ? "Edit post" : "New post"}</h2>
              <button type="button" onClick={() => setDialogOpen(false)} className="text-slate-400 hover:text-slate-600" aria-label="Close">✕</button>
            </div>
            <div className="space-y-3 px-5 py-4">
              <FormInput label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <div className="grid gap-3 md:grid-cols-2">
                <FormInput label="Author *" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                <FormSelect label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </FormSelect>
              </div>
              <FormTextarea label="Excerpt *" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
              <FormTextarea label="Content *" rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
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
                <AdminButton onClick={() => save.mutate()} disabled={save.isPending || !form.title || !form.content}>
                  {save.isPending ? "Saving…" : editing ? "Save changes" : "Publish post"}
                </AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
