import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, MapPin, Mic } from "lucide-react";
import { DirectionsModal, type Destination } from "@/components/map/directions-modal";
import { SummitCountdown } from "@/components/motion/countdown";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";
import { motion } from "framer-motion";
import { ascend, fallbackPhotos, photos, photoProps, summit } from "@/lib/site";

/**
 * Dominion Summit — the annual convention whose theme becomes
 * the theme for the entire year. Update `summit` in lib/site.ts each December.
 */
export default function Summit() {
  const [directionsTo, setDirectionsTo] = useState<Destination>(null);
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-primary african-pattern">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-blob absolute -top-24 left-1/3 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="animate-blob absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-royal/40 blur-3xl" style={{ animationDelay: "-6s" }} />
      </div>

      <div className="relative container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* Poster — confirmed official flyer */}
        <Reveal from="left">
          <motion.figure
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <span className="absolute left-4 top-4 z-[2] rounded-full bg-accent px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-primary shadow-xl">
              Confirmed · {summit.yearTheme}
            </span>
            <img
              {...photoProps(photos.summitPoster, fallbackPhotos.summitPoster, `${summit.name} ${summit.year} — ${summit.yearTheme} poster`)}
              loading="lazy"
              className="w-full h-auto rounded-xl shadow-2xl ring-1 ring-accent/40"
              data-testid="img-summit-poster"
            />
            <figcaption className="mt-3 text-center text-[11px] font-black uppercase tracking-[0.28em] text-accent">
              {summit.edition}th Annual Convention · {summit.dates} · {summit.time}
            </figcaption>
          </motion.figure>
        </Reveal>

        {/* Details */}
        <div>
          <Reveal from="right">
            <p className="eyebrow text-accent mb-4">{summit.dates}</p>
            <h2 className="display-section text-white">
              {summit.name} <span className="gold-accent">{summit.year}</span>
            </h2>
          </Reveal>
          <Reveal from="right" delay={0.1}>
            <p className="mt-4 text-lg text-white/75 leading-relaxed max-w-xl">
              Seven glorious days at {summit.venue} with convenor{" "}
              <span className="font-bold text-white">{summit.convenor}</span> and{" "}
              <span className="font-bold text-white">{summit.coConvenor}</span>, daily{" "}
              {summit.time}. Come expectant — come prevailing.
            </p>
          </Reveal>
          <Reveal from="scale" delay={0.16}>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">
              Confirmed {summit.year} theme
            </p>
            <p className="mt-2 font-serif text-5xl lg:text-6xl font-black gold-accent uppercase leading-[1.02]">
              Growing <span className="text-white">and</span> Prevailing
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[summit.convenor, summit.coConvenor, ...summit.guests].map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-bold text-white/90"
                >
                  {m}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal from="up" delay={0.2}>
            <div className="mt-6">
              <SummitCountdown />
            </div>
          </Reveal>
          <Reveal from="up" delay={0.22}>
            <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-white/85 text-sm font-medium">
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={17} className="text-accent" /> {summit.dates}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={17} className="text-accent" /> {summit.venue}
              </span>
              <span className="inline-flex items-center gap-2">
                <Mic size={17} className="text-accent" /> Convenor {summit.convenor}
              </span>
              <span className="inline-flex items-center gap-2">
                <Mic size={17} className="text-accent" /> {summit.time} daily
              </span>
            </div>
          </Reveal>
          <Reveal from="up" delay={0.28}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button size="lg" className="btn-shine bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8" data-testid="button-summit-register">
                  Reserve Your Seat <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="glass-pill text-white rounded-full px-8 border-white/30"
                data-testid="button-summit-venue"
                onClick={() =>
                  setDirectionsTo({
                    name: `${summit.name} ${summit.year} — ${summit.venue}`,
                    query: `Beautiful Courts Christian Church, ${summit.venue}, Nakuru, Kenya`,
                  })
                }
              >
                <MapPin size={18} className="mr-2" /> Get Directions
              </Button>
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 self-center font-bold text-accent hover:underline"
                data-testid="link-all-events"
              >
                All events <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      {/* 21 Days of Ascend — full prayer & fasting section */}
      <div className="relative container mx-auto px-4 mt-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center rounded-[2rem] border border-accent/25 bg-white/[0.04] backdrop-blur p-6 sm:p-10">
          {/* Big readable poster */}
          <Reveal from="left" className="w-full">
            <motion.figure
              whileHover={{ scale: 1.015 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="mx-auto max-w-md"
            >
              <img
                {...photoProps(photos.ascendPoster, fallbackPhotos.ascendPoster, "21 Days of Ascend prayer and fasting poster")}
                loading="lazy"
                className="w-full h-auto rounded-2xl shadow-2xl ring-1 ring-accent/40"
                data-testid="img-ascend-poster"
              />
              <figcaption className="mt-3 text-center text-[11px] font-black uppercase tracking-[0.28em] text-accent">
                {ascend.dates} · {ascend.venue}
              </figcaption>
            </motion.figure>
          </Reveal>

          {/* Details */}
          <div>
            <Reveal from="right">
              <p className="eyebrow text-accent mb-4">Prayer & fasting</p>
              <h3 className="display-section text-white">
                {ascend.name} <span className="gold-accent">of Dominion</span>
              </h3>
              <p className="mt-3 font-serif text-xl italic text-white/75">{ascend.subtitle}</p>
            </Reveal>
            <Reveal from="right" delay={0.1}>
              <p className="mt-4 text-white/70 leading-relaxed max-w-lg">
                Twenty-one days of seeking God together — fasting {ascend.fasting} daily,
                and meeting morning, evening, and midnight to pray. Come hungry; leave full.
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
                  className="rounded-2xl border border-white/10 bg-primary/80 px-4 py-4 text-center hover:border-accent/50 transition-colors"
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">{s.name}</p>
                  <p className="mt-1 font-serif text-2xl font-black text-accent">{s.time}</p>
                </motion.div>
              ))}
            </motion.div>

            <Reveal from="up" delay={0.15}>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 border border-accent/40 px-4 py-2 text-sm font-bold text-accent">
                  Fasting {ascend.fasting} daily
                </span>
                <Link href="/contact">
                  <Button className="btn-shine rounded-full bg-accent px-7 font-bold text-primary hover:bg-accent/90" data-testid="button-ascend-join">
                    Join the fast <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <DirectionsModal destination={directionsTo} onClose={() => setDirectionsTo(null)} />
    </section>
  );
}
