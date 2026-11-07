import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, MapPin, Radio } from "lucide-react";
import { Marquee } from "@/components/motion/reveal";
import { EASE_OUT } from "@/lib/animations";
import { fallbackPhotos, photos, photoProps } from "@/lib/site";

const container = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const item = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE_OUT } },
};

const values = [
  "Faith",
  "Love",
  "Hope",
  "Community",
  "Worship",
  "Grace",
  "Fellowship",
  "Service",
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-primary min-h-[100svh] flex flex-col">
      {/* Full-bleed worship backdrop */}
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0" aria-hidden>
        <img
          {...photoProps(photos.congregation, fallbackPhotos.congregation, "")}
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary" />
      <div aria-hidden className="absolute inset-0 african-pattern opacity-100" />
      <div aria-hidden className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-accent/25 blur-3xl" />

      {/* Service bar */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10 border-b border-white/10"
      >
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] font-medium text-primary-foreground/85">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-white">
              <Radio size={14} className="text-accent" /> Live every Sunday
            </span>
          </span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} className="text-accent" /> Nakuru · Narok · Online
          </span>
          <span className="hidden md:inline text-white/30">|</span>
          <Link href="/branches" className="hidden md:inline-flex items-center gap-1 hover:text-accent transition-colors">
            Find a branch <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>

      {/* Headline block */}
      <motion.div
        variants={container}
        initial="initial"
        animate="animate"
        style={{ y: contentY }}
        className="relative z-10 container mx-auto px-4 flex-1 flex flex-col justify-center py-16 lg:py-24 max-w-6xl"
      >
        <motion.p variants={item} className="eyebrow text-accent mb-6">
          Beautiful Courts Christian Church
        </motion.p>

        <motion.h1 variants={item} className="display-hero text-white max-w-5xl">
          Raising
          <span className="gold-accent block">Kingdom Champions</span>
          <span className="block text-white/90">across Kenya.</span>
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-2xl text-lg lg:text-xl text-primary-foreground/80 leading-relaxed">
          A church for people who want to live out their God-given purpose — in faith,
          family, business, and beyond. Come as you are. Leave transformed.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-col sm:flex-row gap-4">
          <Link href="/contact">
            <Button
              size="lg"
              className="btn-shine bg-accent text-accent-foreground hover:bg-accent/90 text-base px-9 py-7 rounded-full font-bold"
              data-testid="button-join-services"
            >
              Plan Your Visit <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
          <Link href="/sermons">
            <Button
              size="lg"
              variant="outline"
              className="glass-pill text-white hover:bg-white/20 text-base px-9 py-7 rounded-full font-bold border-white/30"
              data-testid="button-watch-live"
            >
              <span className="mr-2 inline-flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse-soft" />
              Watch Online
            </Button>
          </Link>
        </motion.div>

        <motion.div variants={item} className="mt-12 flex flex-wrap gap-3">
          {[
            { time: "8:30 AM", label: "First Service" },
            { time: "10:30 AM", label: "Second Service" },
          ].map((s) => (
            <div
              key={s.time}
              className="glass-pill rounded-2xl px-5 py-3 flex items-baseline gap-3"
            >
              <span className="text-xl font-black text-white font-serif">{s.time}</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/70">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom marquee */}
      <div className="relative z-10 border-t border-white/10 bg-black/30 py-3.5 backdrop-blur-sm">
        <Marquee>
          {[...values, ...values].map((v, i) => (
            <span key={i} className="flex items-center gap-10 text-[13px] font-bold uppercase tracking-[0.3em] text-accent/90">
              {v}
              <span className="text-accent/50">✦</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
