import type { Variants, Transition } from 'framer-motion';

// ── Transition presets ──────────────────────────────────────
export const springTransition: Transition = { type: 'spring', stiffness: 100, damping: 15 };
export const easeOutTransition: Transition = { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] };
export const gentleTransition: Transition = { duration: 0.6, ease: 'easeOut' };

// ── Variant sets ────────────────────────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: gentleTransition },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: easeOutTransition },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: easeOutTransition },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: easeOutTransition },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: easeOutTransition },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: easeOutTransition },
};

// ── Hover presets (for whileHover/whileTap) ─────────────────
export const cardHover = {
  whileHover: { y: -3, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 },
};

export const buttonTap = {
  whileTap: { scale: 0.95 },
};
