import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Play, Youtube } from "lucide-react";
import { PageHero } from "@/components/motion/page-hero";
import { Reveal, SectionHeading } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";
import {
  sermonVideos,
  youtubeChannelId,
  youtubeChannelUrl,
  youtubePlaylistEmbed,
  youtubeUploadsPlaylistId,
} from "@/lib/site";
import { useLiveBroadcast } from "@/lib/youtube-live";

type FeedVideo = { id: string; title: string; thumb: string; date: string };

function playlistAt(index: number, autoplay = false) {
  return `https://www.youtube.com/embed?listType=playlist&list=${youtubeUploadsPlaylistId}&index=${index}&rel=0${autoplay ? "&autoplay=1" : ""}`;
}

function idFromLink(link: string): string {
  const m = link.match(/[?&]v=([^&#]+)/);
  return m ? m[1] : "";
}

export default function Sermons() {
  const [active, setActive] = useState(sermonVideos[0]?.id ?? "");
  const [playing, setPlaying] = useState<number[]>([]);
  const [feed, setFeed] = useState<FeedVideo[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);

  // Latest uploads straight from the channel feed (thumbnails included).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rss = encodeURIComponent(
          `https://www.youtube.com/feeds/videos.xml?channel_id=${youtubeChannelId}`
        );
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rss}&count=12`);
        if (!res.ok) throw new Error("feed failed");
        const data = await res.json();
        const items: FeedVideo[] = (data.items ?? [])
          .map((it: { link: string; title: string; thumbnail?: string; pubDate?: string }) => {
            const id = idFromLink(it.link ?? "");
            return id
              ? {
                  id,
                  title: it.title ?? "Sermon",
                  thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
                  date: it.pubDate ?? "",
                }
              : null;
          })
          .filter(Boolean) as FeedVideo[];
        if (!cancelled) setFeed(items.slice(0, 9));
      } catch {
        if (!cancelled) setFeed([]);
      } finally {
        if (!cancelled) setFeedLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const curated = sermonVideos.find((v) => v.id === active);
  const picked = feed.find((v) => v.id === active);
  // While the channel is live, the live stream takes the featured spot
  // (until the visitor picks another video) — it plays right here.
  const { isLive, videoId: liveVideoId, title: liveTitle, embedUrl: liveEmbedUrl } =
    useLiveBroadcast();
  const showingLive = isLive && !active && liveVideoId && liveEmbedUrl;
  const topTitle = showingLive
    ? (liveTitle ?? "Live service")
    : (curated?.title ?? picked?.title ?? "Latest from our channel");
  const topSub = showingLive
    ? "Streaming live now — right here on our website"
    : (curated?.preacher ?? (picked ? "From our YouTube channel" : "Auto-updated — newest uploads play first"));
  const topSrc = showingLive
    ? liveEmbedUrl
    : active
      ? `https://www.youtube.com/embed/${active}?rel=0`
      : youtubePlaylistEmbed;

  const choose = (id: string) => {
    setActive(id);
    document
      .querySelector('[data-testid="video-featured-player"]')
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const fmtDate = (d: string) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <div>
      <PageHero
        title={<>Watch <span className="gold-accent">Sermons</span></>}
        description="Kingdom-focused messages from Beautiful Courts Christian Church — the latest from our pulpit, straight from our YouTube channel."
      />

      {/* Featured player — latest ready to play, or your pick */}
      <section className="py-16 bg-primary relative overflow-hidden african-pattern">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-blob absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 max-w-5xl">
          <Reveal from="scale">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/20">
              {showingLive && (
                <span
                  className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl"
                  data-testid="badge-live-now"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                  </span>
                  Live now
                </span>
              )}
              <div className="aspect-video w-full bg-black">
                <iframe
                  key={topSrc}
                  src={topSrc}
                  title={topTitle}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  data-testid="video-featured-player"
                />
              </div>
            </div>
          </Reveal>
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-white" data-testid="text-featured-sermon-title">
                {topTitle}
              </h2>
              <p className="text-accent font-semibold mt-1">{topSub}</p>
            </div>
            <a href={youtubeChannelUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground rounded-full shrink-0">
                <Youtube size={18} className="mr-2" /> Open our YouTube
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Library — real YouTube thumbnails, tap to play above */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Library"
            title={<>More from the <span className="gold-accent">pulpit</span></>}
            description="Fresh uploads from our channel — tap any message to play it in the player above."
          />
          {feedLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="overflow-hidden rounded-3xl">
                  <Skeleton className="h-[220px] w-full" />
                </div>
              ))}
            </div>
          ) : feed.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-60px" }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {feed.map((v, i) => (
                <motion.button
                  key={v.id}
                  variants={staggerDir(i)}
                  onClick={() => choose(v.id)}
                  className={`media-card group h-[240px] text-left w-full ${active === v.id ? "ring-2 ring-accent" : ""}`}
                  data-testid={`card-sermon-${i}`}
                >
                  <img
                    src={v.thumb}
                    alt={v.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {i === 0 && !active && (
                    <span className="absolute left-5 top-5 z-[2] rounded-full bg-accent px-3.5 py-1.5 text-[11px] font-black uppercase tracking-widest text-primary">
                      Latest
                    </span>
                  )}
                  <span className="absolute inset-0 z-[1] flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/95 text-primary shadow-xl transition-transform group-hover:scale-110">
                      <Play size={22} className="ml-0.5" />
                    </span>
                  </span>
                  <div className="media-card-body p-5">
                    <h3 className="font-serif text-lg font-bold text-white leading-snug line-clamp-2">{v.title}</h3>
                    {v.date && <p className="text-white/60 text-xs font-semibold mt-1">{fmtDate(v.date)}</p>}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            /* Offline fallback — index players need no feed at all */
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-60px" }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {[1, 2, 3, 4, 5, 6].map((n, i) => {
                const isPlaying = playing.includes(n);
                return (
                  <motion.div
                    key={n}
                    variants={staggerDir(i)}
                    className="media-card group h-[240px]"
                    data-testid={`card-sermon-${i}`}
                  >
                    {isPlaying ? (
                      <iframe
                        src={playlistAt(n, true)}
                        title={`Sermon ${n + 1} — BCC Church`}
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        onClick={() => setPlaying((p) => [...p, n])}
                        className="absolute inset-0 h-full w-full text-left"
                        aria-label={`Play sermon ${n + 1}`}
                      >
                        <span className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-royal" />
                        <span className="absolute inset-0 african-pattern opacity-70" />
                        <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary shadow-2xl transition-transform group-hover:scale-110">
                            <Play size={26} className="ml-1" />
                          </span>
                          <span className="font-serif text-xl font-bold text-white text-center leading-snug">
                            Sermon {n + 1}
                          </span>
                          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-accent">
                            Tap to play here
                          </span>
                        </span>
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Slim YouTube link */}
          <Reveal from="up" delay={0.1} className="mt-10">
            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-accent/30 bg-primary px-6 py-4 hover:border-accent/60 transition-colors"
              data-testid="link-youtube-all"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary shrink-0">
                  <Youtube size={20} />
                </span>
                <span className="font-bold text-white">Watch everything on our YouTube channel</span>
              </span>
              <ArrowRight size={20} className="text-accent shrink-0 transition-transform group-hover:translate-x-1.5" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-royal relative overflow-hidden">
        <div className="relative container mx-auto px-4 text-center max-w-3xl">
          <Reveal>
            <h2 className="display-section text-white">
              Never miss a <span className="gold-accent">word.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a href={youtubeChannelUrl} target="_blank" rel="noreferrer">
                <Button size="lg" className="btn-shine bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8" data-testid="button-subscribe">
                  <Youtube size={20} className="mr-2" /> Subscribe on YouTube
                </Button>
              </a>
              <a href="/contact">
                <Button size="lg" variant="outline" className="glass-pill text-white rounded-full px-8 border-white/30" data-testid="button-plan-visit-sermons">
                  Plan Your Visit <ArrowRight size={18} className="ml-2" />
                </Button>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
