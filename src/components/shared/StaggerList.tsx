import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface StaggerListProps {
  children: React.ReactNode[];
  className?: string;
}

export function StaggerList({ children, className }: StaggerListProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children.map((child, i) => (
        <motion.div key={i} variants={staggerItem}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
