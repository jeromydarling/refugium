import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { slideUp } from '@/lib/animations';

interface AnimatedSectionProps {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
}

export function AnimatedSection({ children, variants = slideUp, className, delay = 0 }: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={delay ? { delay } : undefined}
      className={className}
    >
      {children}
    </motion.section>
  );
}
