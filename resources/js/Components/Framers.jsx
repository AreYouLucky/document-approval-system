import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const LazySection = ({ children, animation = 'fade-up' }) => {
  const { ref, inView } = useInView({
    triggerOnce: false, 
    threshold: 0.05,
  });

  const animations = {
    'fade-up': {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 50 },
    },
    'fade-down': {
      initial: { opacity: 0, y: -50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -50 },
    },
    'fade-left': {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 },
    },
    'fade-right': {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 50 },
    },
    'fade-in': {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    'zoom-in': {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
    },
  };

  const { initial, animate, exit } = animations[animation] || animations['fade-up'];

  return (
    <div ref={ref}>
      <motion.div
        initial={initial}
        animate={inView ? animate : exit}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default LazySection;
