import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, CalendarDays, Clock, Flame, MapPin, Sparkles } from "lucide-react";
import { PageHero } from "@/components/motion/page-hero";
import { Reveal, SectionHeading } from "@/components/motion/reveal";
import { SummitCountdown } from "@/components/motion/countdown";
import { staggerContainer, staggerDir } from "@/lib/animations";
import { DirectionsModal, type Destination } from "@/components/map/directions-modal";
import { ascend, fallbackPhotos, photos, photoProps, summit } from "@/lib/site";
import { api, Endpoints, resolveUploadUrl, type ChurchEvent } from "@/lib/api";

function eventDay(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(`${iso.slice(0, 10)}T00:00`);
  return Number.isNaN(d.getTime()) ? "—" : String(d.getDate()).padStart(2, "0");
}

function eventMonth(iso?: string | null): string {
  if (!iso) return "TBD";
  const d = new Date(`${iso.slice(0, 10)}T00:00`);
  return Number.isNaN(d.getTime())
    ? "TBD"
    : d.toLocaleString("en-US", { month: "short" }).toUpperCase();
}

const weekly = [
  { day: "Sunday", what: "First Service", time: "8:30 AM" },
  { day: "Sunday", what: "Second Service", time: "10:30 AM" },
  { day: "Wednesday", what: "Bible Study", time: "6:00 PM" },
  { day: "Friday", what: "Prayer Night", time: "7:00 PM" },
  { day: "Saturday", what: "Youth Service", time: "2:00 PM" },
];

export default function Events() {
  const [directionsTo, setDirectionsTo] = useState<Destination>(null);

  // Gatherings posted from Admin → Events (GET live from the backend).
  const { data: liveEvents = [], isLoading: eventsLoading } = useQuery<ChurchEvent[]>({
    queryKey: [Endpoints.events],
    queryFn: api.getEvents,
  });
  const publishedEvents = liveEvents.filter((e) => e.published !== false);

  return (
    <div>
      <PageHero
        title={<>Gatherings & <span className="gold-accent">Events</span></>}
        description="Mountains move when the family gathers. Here is everything coming up at Beautiful Courts Christian Church."
      />

      {/* Dominion Summit — featured */}
      <section className="py-20 lg:py-28 bg-background overflow-hidden">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center max-w-6xl">
          <Reveal from="left">
            <img
              {...photoProps(photos.summitPoster, fallbackPhotos.summitPoster, `${summit.name} ${summit.year} poster`)}
              loading="eager"
              className="w-full h-auto rounded-2xl shadow-2xl ring-1 ring-accent/30"
              data-testid="img-events-summit-poster"
            />
          </Reveal>

          <div>
            <Reveal from="right">
              <p className="eyebrow text-accent mb-4">Flagship gathering · {summit.dates} · {summit.time}</p>
              <h2 className="display-section text-primary">
                {summit.name} <span className="gold-accent">{summit.year}</span>
              </h2>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.3em] text-accent">
                Theme: {summit.yearTheme}
              </p>
            </Reveal>
            <Reveal from="right" delay={0.1}>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Seven glorious days at {summit.venue} under convenor{" "}
                <strong className="text-primary">{summit.convenor}</strong>,
                daily {summit.time} — with guest ministers{" "}
                {summit.guests.join(", ")}.
              </p>
            </Reveal>

            <Reveal from="up" delay={0.16}>
              <SummitCountdown compact />
              <div className="mt-5 text-sm text-muted-foreground space-y-1.5">
                  <p className="flex items-center gap-2"><CalendarDays size={15} className="text-accent" /> {summit.dates}</p>
                  <p className="flex items-center gap-2"><MapPin size={15} className="text-accent" /> {summit.venue}</p>
                  <p className="flex items-center gap-2"><Sparkles size={15} className="text-accent" /> {summit.edition}th Annual Convention</p>
                </div>
            </Reveal>

            <Reveal from="up" delay={0.22}>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link href="/contact">
                  <Button size="lg" className="btn-shine bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8" data-testid="button-event-summit-register">
                    Reserve Your Seat <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8"
                  data-testid="button-event-summit-directions"
                  onClick={() =>
                    setDirectionsTo({
                      name: `${summit.name} ${summit.year} — ${summit.venue}`,
                      query: `Beautiful Courts Christian Church, ${summit.venue}, Nakuru, Kenya`,
                    })
                  }
                >
                  <MapPin size={18} className="mr-2" /> Get Directions
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 21 Days of Ascend */}
      <section className="py-20 lg:py-28 bg-primary relative overflow-hidden african-pattern">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-blob absolute top-0 right-1/4 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center max-w-6xl">
          <div className="order-2 lg:order-1">
            <Reveal from="left">
              <p className="eyebrow text-accent mb-4">{ascend.dates} · Fasting {ascend.fasting} daily</p>
              <h2 className="display-section text-white">
                {ascend.name} <span className="gold-accent">of Dominion</span>
              </h2>
              <p className="mt-3 font-serif text-xl italic text-white/75">{ascend.subtitle}</p>
            </Reveal>
            <Reveal from="left" delay={0.1}>
              <p className="mt-4 text-white/70 leading-relaxed max-w-lg">
                Twenty-one days of seeking God at {ascend.venue} — fasting {ascend.fasting} and
                meeting morning, evening, and midnight to pray.
              </p>
            </Reveal>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-6 grid sm:grid-cols-3 gap-3"
            >
              {ascend.sessions.map((s, i) => (
                <motion.div
                  key={s.name}
                  variants={staggerDir(i)}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 text-center hover:border-accent/50 transition-colors"
                >
                  <p className="flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-white/60">
                    <Flame size={12} className="text-accent" /> {s.name}
                  </p>
                  <p className="mt-1 font-serif text-2xl font-black text-accent">{s.time}</p>
                </motion.div>
              ))}
            </motion.div>
            <Reveal from="up" delay={0.15}>
              <Link href="/contact">
                <Button size="lg" className="btn-shine mt-7 rounded-full bg-accent px-8 font-bold text-primary hover:bg-accent/90" data-testid="button-event-ascend-join">
                  Join the fast <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </Reveal>
          </div>
          <Reveal from="right" className="order-1 lg:order-2">
            <img
              {...photoProps(photos.ascendPoster, fallbackPhotos.ascendPoster, "21 Days of Ascend poster")}
              loading="lazy"
              className="mx-auto w-full max-w-md h-auto rounded-2xl shadow-2xl ring-1 ring-accent/40"
              data-testid="img-events-ascend-poster"
            />
          </Reveal>
        </div>
      </section>

      {/* More gatherings — posted from Admin → Events */}
      {(eventsLoading || publishedEvents.length > 0) && (
        <section className="py-20 lg:py-28 bg-background overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl">
            <SectionHeading
              eyebrow="More gatherings"
              title={<>Coming up at <span className="gold-accent">BCC.</span></>}
              description="Everything the media team posts from the admin console lands here automatically."
            />
            {eventsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="overflow-hidden rounded-3xl border border-slate-200">
                    <Skeleton className="h-44 w-full" />
                    <div className="p-5 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-60px" }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {publishedEvents.map((e, i) => {
                  const cover = resolveUploadUrl(e.images?.[0] ?? e.imageUrl);
                  return (
                    <motion.article
                      key={e.id}
                      variants={staggerDir(i)}
                      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl"
                      data-testid={`card-event-${e.id}`}
                    >
                      <div className="relative h-44 shrink-0 overflow-hidden bg-gradient-to-br from-primary via-[#1d3a6e] to-royal">
                        {cover && (
                          <img
                            src={cover}
                            alt={e.title}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        <span className="absolute left-4 top-4 flex min-w-14 flex-col items-center rounded-xl bg-white/95 px-2.5 py-1.5 shadow">
                          <span className="font-serif text-2xl font-black leading-none text-primary">{eventDay(e.date)}</span>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">{eventMonth(e.date)}</span>
                        </span>
                        {e.category && (
                          <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-[11px] font-black uppercase tracking-widest text-primary">
                            {e.category}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-serif text-xl font-bold leading-snug text-slate-800">{e.title}</h3>
                        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate-500">
                          {e.time && <span className="inline-flex items-center gap-1"><Clock size={13} className="text-accent" /> {e.time}</span>}
                          {e.venue && <span className="inline-flex items-center gap-1"><MapPin size={13} className="text-accent" /> {e.venue}</span>}
                        </p>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{e.description}</p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                          <CalendarDays size={15} className="text-accent" /> {e.date?.slice(0, 10)}
                        </span>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Weekly rhythm */}
      <section className="py-20 lg:py-28 bg-muted">
        <div className="container mx-auto px-4 max-w-5xl">
          <SectionHeading
            eyebrow="Every week"
            title={<>The weekly <span className="gold-accent">rhythm.</span></>}
            description="Beyond the big gatherings, the family meets all week long. Plug in anywhere."
          />
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-60px" }}
            className="space-y-3"
          >
            {weekly.map((w, i) => (
              <motion.div
                key={`${w.day}-${w.what}`}
                variants={staggerDir(i)}
                className="group flex items-center justify-between gap-4 rounded-2xl bg-primary px-6 py-5 ring-1 ring-white/10 hover:ring-accent/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="font-serif text-lg font-black text-white/25">0{i + 1}</span>
                  <div>
                    <p className="font-bold text-white">{w.what}</p>
                    <p className="text-sm text-white/60 inline-flex items-center gap-1.5">
                      <Clock size={13} className="text-accent" /> {w.day}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-accent/15 px-4 py-2 text-sm font-black text-accent whitespace-nowrap">
                  {w.time}
                </span>
              </motion.div>
            ))}
          </motion.div>
          <Reveal from="up" delay={0.1} className="mt-8 text-center">
            <p className="text-muted-foreground">
              Coming from out of town?{" "}
              <Link href="/branches" className="font-bold text-accent hover:underline">
                Find your nearest branch →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-royal relative overflow-hidden">
        <div className="relative container mx-auto px-4 text-center max-w-3xl">
          <Reveal from="blur">
            <h2 className="display-section text-white">
              Don't just hear about it. <span className="gold-accent">Be there.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12} from="up">
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="btn-shine bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8" data-testid="button-events-visit">
                  Plan Your Visit <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link href="/sermons">
                <Button size="lg" variant="outline" className="glass-pill text-white rounded-full px-8 border-white/30" data-testid="button-events-sermons">
                  Catch Up on Sermons
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <DirectionsModal destination={directionsTo} onClose={() => setDirectionsTo(null)} />
    </div>
  );
}
