import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { EASE_OUT } from "@/lib/animations";
import { cn } from "@/lib/utils";

export type RevealFrom = "up" | "down" | "left" | "right" | "scale" | "blur" | "rotate-l" | "rotate-r";

const OFFSETS: Record<RevealFrom, { x: number; y: number; scale: number; blur: string; rotate: number }> = {
  up: { x: 0, y: 36, scale: 1, blur: "blur(0px)", rotate: 0 },
  down: { x: 0, y: -36, scale: 1, blur: "blur(0px)", rotate: 0 },
  left: { x: -56, y: 0, scale: 1, blur: "blur(0px)", rotate: 0 },
  right: { x: 56, y: 0, scale: 1, blur: "blur(0px)", rotate: 0 },
  scale: { x: 0, y: 12, scale: 0.92, blur: "blur(0px)", rotate: 0 },
  blur: { x: 0, y: 0, scale: 1.04, blur: "blur(10px)", rotate: 0 },
  "rotate-l": { x: 0, y: 28, scale: 1, blur: "blur(0px)", rotate: -2.5 },
  "rotate-r": { x: 0, y: 28, scale: 1, blur: "blur(0px)", rotate: 2.5 },
};

type RevealProps = {
  children: ReactNode;
  delay?: number;
  from?: RevealFrom;
  y?: number;
  className?: string;
  once?: boolean;
};

/** Scroll-triggered entrance from ANY direction — vary `from` per block. */
export function Reveal({ children, delay = 0, from = "up", y, className, once = true }: RevealProps) {
  const o = OFFSETS[from];
  const iy = y ?? o.y;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: o.x, y: iy, scale: o.scale, filter: o.blur, rotate: o.rotate }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)", rotate: 0 }}
      viewport={{ once, margin: "-70px" }}
      transition={{ duration: 0.75, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  from = "blur",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  from?: RevealFrom;
}) {
  return (
    <div className={cn("mb-14", align === "center" ? "text-center" : "text-left")}>
      <Reveal from="down">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal from={from} delay={0.08}>
        <h2 className="display-section mt-5 text-primary">{title}</h2>
      </Reveal>
      {description && (
        <Reveal from={from === "left" ? "right" : "left"} delay={0.16}>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl leading-relaxed mx-auto">{description}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Animated number that counts up when scrolled into view. */
export function Counter({ to, suffix = "", duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration, bounce: 0 });

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, mv, to]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v).toLocaleString()}${suffix}`;
    });
    return unsub;
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/** Infinite marquee strip for values / verses. */
export function Marquee({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("marquee overflow-hidden", className)}>
      <div className="marquee-track flex w-max items-center gap-10 pr-10">{children}</div>
    </div>
  );
}
