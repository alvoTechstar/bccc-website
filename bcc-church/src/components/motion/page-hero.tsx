import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageHero({ title, description, eyebrow }: { title: ReactNode; description: string; eyebrow?: string }) {
  return (
    <section className="relative overflow-hidden bg-primary py-16 lg:py-20 african-pattern">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative container mx-auto px-4"
      >
        {eyebrow && (
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">{eyebrow}</p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl text-4xl lg:text-5xl font-bold font-serif leading-[1.05] text-white"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70"
        >
          {description}
        </motion.p>
      </motion.div>
    </section>
  );
}
