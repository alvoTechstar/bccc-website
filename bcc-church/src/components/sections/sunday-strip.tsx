import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Baby, Clock, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";

const cards = [
  {
    img: "https://images.unsplash.com/photo-1507692049790-de58290a4334?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    kicker: "Sundays",
    title: "An encounter with God",
    text: "Spirit-filled worship that ushers you into His presence. Come ready for something real.",
  },
  {
    img: "https://images.unsplash.com/photo-1478147427282-58a87a120781?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    kicker: "The Word",
    title: "Practical, powerful teaching",
    text: "Rooted in Scripture, built for real life — home, business, and community.",
  },
  {
    img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    kicker: "Community",
    title: "People doing life together",
    text: "You were never meant to do life alone. Find your people from day one.",
  },
];

export default function SundayStrip() {
  return (
    <section className="py-20 lg:py-28 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <Reveal>
            <p className="eyebrow text-accent mb-4">What to expect</p>
            <h2 className="display-section text-primary max-w-2xl">
              What happens when <span className="gold-accent">you show up.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 font-bold text-primary hover:text-royal transition-colors"
            >
              Plan a visit
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-transform group-hover:translate-x-1">
                <ArrowRight size={18} />
              </span>
            </Link>
          </Reveal>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-3 gap-5"
        >
          {cards.map((c, i) => (
            <motion.article key={c.title} variants={staggerDir(i + 1)} className="media-card group h-[420px]">
              <img src={c.img} alt={c.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="media-card-body p-7">
                <p className="eyebrow text-accent mb-3">{c.kicker}</p>
                <h3 className="font-serif text-3xl font-bold text-white leading-tight mb-2">{c.title}</h3>
                <p className="text-white/75 text-[15px] leading-relaxed max-w-sm">{c.text}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <Reveal delay={0.1} className="mt-8">
          <div className="glass-pill !bg-primary/95 rounded-2xl px-6 py-5 flex flex-col md:flex-row items-center gap-4 justify-between border border-accent/25">
            <div className="flex items-center gap-4 text-white">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary shrink-0">
                <Baby size={22} />
              </span>
              <div>
                <p className="font-bold text-lg leading-tight">What about my kids?</p>
                <p className="text-white/70 text-sm">Safe, fun, engaging — BCC Kids Church has them covered.</p>
              </div>
            </div>
            <div className="flex items-center gap-5 text-white/85 text-sm font-medium">
              <span className="inline-flex items-center gap-1.5"><Clock size={16} className="text-accent" /> 8:30 & 10:30</span>
              <span className="hidden sm:inline-flex items-center gap-1.5"><MapPin size={16} className="text-accent" /> Northern Bypass style welcome</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
