import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Compass, Telescope } from "lucide-react";
import { Reveal, Marquee } from "@/components/motion/reveal";
import { fallbackPhotos, photos, photoProps } from "@/lib/site";

export default function MissionVision() {
  return (
    <section id="mission-vision" className="relative py-20 lg:py-28 bg-primary overflow-hidden african-pattern scroll-mt-20">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-blob absolute top-0 left-1/4 h-80 w-80 rounded-full bg-royal/50 blur-3xl" />
        <div className="animate-blob absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-accent/20 blur-3xl" style={{ animationDelay: "-6s" }} />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 items-end mb-14">
          <Reveal from="left">
            <p className="eyebrow text-accent mb-4">Why we exist</p>
            <h2 className="display-section text-white">
              Sent on <span className="gold-accent">mission.</span>
              <br />
              Moved by <span className="gold-accent">vision.</span>
            </h2>
          </Reveal>
          <Reveal from="right" delay={0.12}>
            <p className="text-lg text-white/70 leading-relaxed max-w-xl lg:ml-auto">
              Two sentences carry this house — the dominion mandate we live by
              every day, and the reigning generation we are becoming. Everything
              else is details.
            </p>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Mission — photo card */}
          <motion.article
            initial={{ opacity: 0, x: -64, rotate: -1.5 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="media-card group min-h-[480px]"
          >
            <img
              {...photoProps(photos.congregation, fallbackPhotos.congregation, "BCC Church congregation in worship")}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute left-6 top-6 z-[2] font-serif text-7xl font-black text-white/25">01</span>
            <span className="absolute right-6 top-6 z-[2] flex h-13 w-13 items-center justify-center rounded-2xl bg-accent p-3 text-primary shadow-xl">
              <Compass size={26} />
            </span>
            <div className="media-card-body p-7 lg:p-9">
              <p className="eyebrow text-accent mb-3">Our mission — today</p>
              <h3 className="font-serif text-3xl lg:text-4xl font-bold text-white leading-tight mb-3" data-testid="text-mission-title">
                To win souls and disciple nations into dominion.
              </h3>
              <p className="text-white/75 leading-relaxed max-w-lg" data-testid="text-mission-content">
                To evangelize the world through the power of the Holy Spirit — raising believers
                who take dominion in their families, businesses, cities, and nations; establishing
                strong Christian communities that worship God in spirit and truth and demonstrate
                Christ's love through practical service to humanity.
              </p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-accent/80">Genesis 1:28 · Mark 16:15</p>
            </div>
          </motion.article>

          {/* Vision — gold statement card */}
          <motion.article
            initial={{ opacity: 0, x: 64, rotate: 1.5 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="bento gold-surface p-7 lg:p-9 min-h-[480px] flex flex-col justify-between group overflow-hidden"
          >
            <div aria-hidden className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/25 blur-3xl" />
            <div className="flex items-start justify-between">
              <span className="font-serif text-7xl font-black text-primary/15">02</span>
              <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-primary p-3 text-accent shadow-xl transition-transform group-hover:rotate-12">
                <Telescope size={26} />
              </span>
            </div>
            <div className="relative">
              <p className="eyebrow text-primary/70 mb-3">Our vision — tomorrow</p>
              <h3 className="font-serif text-3xl lg:text-4xl font-bold text-primary leading-tight mb-3" data-testid="text-vision-title">
                A generation walking in dominion.
              </h3>
              <p className="text-primary/75 leading-relaxed max-w-lg" data-testid="text-vision-content">
                To be a thriving church raising kingdom champions — men and women reigning in life
                across Kenya and East Africa; churches planted in every city and town, training
                centers and community programs everywhere, and Christ enthroned in every home.
              </p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-primary/60">Romans 5:17 · Revelation 5:10</p>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-2 font-bold text-primary hover:gap-3.5 transition-all"
              >
                Read our full story <ArrowRight size={18} />
              </Link>
            </div>
          </motion.article>
        </div>
      </div>

      {/* Verse ticker */}
      <div className="relative mt-14 border-y border-white/10 bg-black/25 py-3.5">
        <Marquee>
          {Array.from({ length: 6 }).flatMap((_, k) => [
            <span key={`a-${k}`} className="text-[13px] font-bold uppercase tracking-[0.3em] text-white/70">
              Go into all the world — Mark 16:15
            </span>,
            <span key={`b-${k}`} className="text-accent/60">✦</span>,
            <span key={`c-${k}`} className="text-[13px] font-bold uppercase tracking-[0.3em] text-white/70">
              The earth shall be filled with His glory — Hab. 2:14
            </span>,
            <span key={`d-${k}`} className="text-accent/60">✦</span>,
          ])}
        </Marquee>
      </div>
    </section>
  );
}
