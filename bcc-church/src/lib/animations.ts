import type { Variants } from "framer-motion";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_SPRING = { type: "spring", stiffness: 120, damping: 18 } as const;

const D = 0.7;

/** Directional entrance variants — pick a different one per block so motion never repeats. */
export const fromUp: Variants = {
  initial: { opacity: 0, y: 44 },
  animate: { opacity: 1, y: 0, transition: { duration: D, ease: EASE_OUT } },
};

export const fromDown: Variants = {
  initial: { opacity: 0, y: -44 },
  animate: { opacity: 1, y: 0, transition: { duration: D, ease: EASE_OUT } },
};

export const fromLeft: Variants = {
  initial: { opacity: 0, x: -64 },
  animate: { opacity: 1, x: 0, transition: { duration: D, ease: EASE_OUT } },
};

export const fromRight: Variants = {
  initial: { opacity: 0, x: 64 },
  animate: { opacity: 1, x: 0, transition: { duration: D, ease: EASE_OUT } },
};

export const fromScale: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: D, ease: EASE_OUT } },
};

export const fromBlur: Variants = {
  initial: { opacity: 0, scale: 1.04, filter: "blur(10px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.9, ease: EASE_OUT } },
};

export const fromRotate: Variants = {
  initial: { opacity: 0, y: 32, rotate: -2.5 },
  animate: { opacity: 1, y: 0, rotate: 0, transition: { duration: D, ease: EASE_OUT } },
};

export const fromRotateR: Variants = {
  initial: { opacity: 0, y: 32, rotate: 2.5 },
  animate: { opacity: 1, y: 0, rotate: 0, transition: { duration: D, ease: EASE_OUT } },
};

/** Stagger children alternate left/right so grids sweep in from both sides. */
export const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const staggerItemL: Variants = {
  initial: { opacity: 0, x: -56 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.65, ease: EASE_OUT } },
};

export const staggerItemR: Variants = {
  initial: { opacity: 0, x: 56 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.65, ease: EASE_OUT } },
};

/** Cycle L/R/up/scale across grid children: index % 4. */
export function staggerDir(index: number): Variants {
  const m = index % 4;
  if (m === 0) return staggerItemL;
  if (m === 1) return fromDown;
  if (m === 2) return staggerItemR;
  return fromScale;
}

// Back-compat aliases
export const fadeInUp = fromUp;
export const fadeInLeft = fromLeft;
export const fadeInRight = fromRight;
export const slideUp = fromUp;

export const scaleOnHover = {
  whileHover: { scale: 1.04, y: -2 },
  whileTap: { scale: 0.97 },
};
