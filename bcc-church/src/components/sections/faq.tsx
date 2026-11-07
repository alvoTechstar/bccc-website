import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Plus } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What time are the Sunday services?",
    a: "Two services every Sunday — 8:30 AM and 10:30 AM. Each runs about two hours with worship, the Word, and community.",
  },
  {
    q: "Where do I go for the first time?",
    a: "Head to the Welcome Tent 15 minutes early. Our hosts will help with seats, kids check-in, and anything you need. You won't be singled out.",
  },
  {
    q: "What about my kids?",
    a: "BCC Kids Church runs a safe, fun space with games, interactive Bible lessons and crafts. Every volunteer is vetted and trained.",
  },
  {
    q: "What should I wear?",
    a: "Come as you are. Dress up or dress down — come comfortable and expect to be welcomed like family.",
  },
  {
    q: "Can I watch online?",
    a: "Yes. Sunday services stream live, and past sermons live on the sermons page. But nothing beats being in the room — plan a visit.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 grid lg:grid-cols-[1fr_1.4fr] gap-12">
        <Reveal>
          <p className="eyebrow text-accent mb-4">New here?</p>
          <h2 className="display-section text-primary">
            Questions, <span className="gold-accent">answered.</span>
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed max-w-md">
            What people ask before their first Sunday. Still curious? Our team replies fast.
          </p>
          <Link
            href="/contact"
            className="mt-7 group inline-flex items-center gap-2 font-bold text-primary hover:text-royal transition-colors"
          >
            Talk to our team
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-transform group-hover:translate-x-1">
              <ArrowRight size={18} />
            </span>
          </Link>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.06}>
                <div
                  className={cn(
                    "rounded-2xl border transition-colors overflow-hidden",
                    isOpen ? "border-accent/50 bg-accent/[0.06]" : "border-border bg-card hover:border-accent/40"
                  )}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-primary text-[17px]">{f.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        isOpen ? "bg-accent text-primary" : "bg-muted text-primary"
                      )}
                    >
                      <Plus size={18} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-6 pb-6 text-muted-foreground leading-relaxed">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
