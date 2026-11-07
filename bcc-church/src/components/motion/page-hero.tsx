import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageHero({ title, description }: { title: ReactNode; description: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-royal py-20 african-pattern">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-blob absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="animate-blob absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-globe/25 blur-3xl" style={{ animationDelay: "-6s" }} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative container mx-auto px-4 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl lg:text-6xl font-bold font-serif mb-6 text-white"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>
      </motion.div>
    </section>
  );
}
