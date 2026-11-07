import { Link } from "wouter";
import { ArrowRight, Play } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";
import { motion } from "framer-motion";

const sermons = [
  {
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tag: "Faith",
    title: "The Mandate to Be Fruitful",
    meta: "Bishop JB Tajeu · 42 min",
  },
  {
    img: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tag: "Grace",
    title: "Chosen for Fruitfulness",
    meta: "Pastor Samuel Kirui · 38 min",
  },
  {
    img: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tag: "Hope",
    title: "Walking in Trust",
    meta: "Rev. Mary Kimani · 45 min",
  },
];

export default function Sermons() {
  return (
    <section className="py-20 lg:py-28 bg-primary relative overflow-hidden african-pattern">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-blob absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>
      <div className="relative container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <Reveal>
            <p className="eyebrow text-accent mb-4">Watch & grow</p>
            <h2 className="display-section text-white max-w-2xl">
              Latest <span className="gold-accent">sermons.</span>
            </h2>
            <p className="mt-4 text-white/70 max-w-xl">Kingdom-focused messages that will transform your week.</p>
          </Reveal>
          <Reveal delay={0.12}>
            <Link href="/sermons" className="group inline-flex items-center gap-2 font-bold text-white hover:text-accent transition-colors">
              All sermons
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary transition-transform group-hover:translate-x-1">
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
          {sermons.map((s, i) => (
            <motion.article
              key={s.title}
              variants={staggerDir(i)}
              className={`media-card group ${i === 0 ? "md:col-span-1 md:row-span-1 h-[440px]" : "h-[440px]"}`}
            >
              <img src={s.img} alt={s.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute left-5 top-5 z-[2] rounded-full bg-accent px-3.5 py-1.5 text-[11px] font-black uppercase tracking-widest text-primary">
                {s.tag}
              </span>
              <span className="absolute right-5 top-5 z-[2] flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur border border-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={20} className="ml-0.5" />
              </span>
              <div className="media-card-body p-6">
                <h3 className="font-serif text-2xl font-bold text-white leading-snug mb-1.5">{s.title}</h3>
                <p className="text-white/70 text-sm">{s.meta}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
