import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useInView, useSpring, useMotionValue, useTransform } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   EASING CURVES — consistent across the entire app
   ═══════════════════════════════════════════════════════════════ */
export const EASE_APPLE = [0.16, 1, 0.3, 1];
export const EASE_SPRING = [0.32, 0.72, 0, 1];
export const EASE_SMOOTH = [0.25, 0.46, 0.45, 0.94];
export const EASE_OUT_EXPO = [0.19, 1, 0.22, 1];

/* ═══════════════════════════════════════════════════════════════
   FadeIn — simple vertical fade-in on scroll
   ═══════════════════════════════════════════════════════════════ */
export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
  y = 24,
  className = '',
  once = true,
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-60px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: EASE_APPLE }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SlideIn — directional slide (left/right/up/down)
   ═══════════════════════════════════════════════════════════════ */
export const SlideIn = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.55,
  distance = 32,
  className = '',
  once = true,
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-40px 0px' });

  const dirMap = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };
  const offset = dirMap[direction] || dirMap.up;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{ duration, delay, ease: EASE_APPLE }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ScaleIn — pop-scale entrance
   ═══════════════════════════════════════════════════════════════ */
export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.45,
  className = '',
  once = true,
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-40px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
      transition={{ duration, delay, ease: EASE_SPRING }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   StaggerContainer + StaggerItem — orchestrated reveals
   ═══════════════════════════════════════════════════════════════ */
export const StaggerContainer = ({
  children,
  staggerDelay = 0.08,
  delay = 0,
  className = '',
  once = true,
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-40px 0px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({
  children,
  className = '',
  y = 20,
  scale = 1,
  ...props
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y, scale: scale < 1 ? scale : 1 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.45, ease: EASE_APPLE },
      },
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════
   AnimatedCounter — smooth number counting animation
   ═══════════════════════════════════════════════════════════════ */
export const AnimatedCounter = ({
  target,
  duration = 1.5,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px 0px' });
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, {
    damping: 30,
    stiffness: 80,
    duration: duration * 1000,
  });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (isInView) {
      motionVal.set(target);
    }
  }, [isInView, target, motionVal]);

  useEffect(() => {
    const unsubscribe = springVal.on('change', (v) => {
      setDisplay(v.toFixed(decimals));
    });
    return unsubscribe;
  }, [springVal, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════════
   AnimatedProgress — smooth progress bar fill
   ═══════════════════════════════════════════════════════════════ */
export const AnimatedProgress = ({
  value = 0,
  className = '',
  barClassName = '',
  height = 'h-2',
  delay = 0.3,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px 0px' });

  return (
    <div ref={ref} className={`${height} overflow-hidden rounded-full bg-[#FAF7F2] border border-[#E1DCC9] ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: `${value}%` } : { width: 0 }}
        transition={{ duration: 1.2, delay, ease: EASE_OUT_EXPO }}
        className={`h-full rounded-full bg-gradient-to-r from-[#412D15] to-[#8F7554] ${barClassName}`}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   HoverLift — lifts on hover with spring physics
   ═══════════════════════════════════════════════════════════════ */
export const HoverLift = ({
  children,
  className = '',
  lift = -4,
  ...props
}) => (
  <motion.div
    whileHover={{ y: lift, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
    whileTap={{ scale: 0.98 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════
   MagneticButton — subtle magnetic pull effect
   ═══════════════════════════════════════════════════════════════ */
export const MagneticButton = ({
  children,
  className = '',
  strength = 0.15,
  ...props
}) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PageTransition — wraps entire pages for entrance/exit
   ═══════════════════════════════════════════════════════════════ */
export const PageTransition = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.4, ease: EASE_APPLE }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════
   BlurFadeIn — entrance with blur-to-sharp transition
   ═══════════════════════════════════════════════════════════════ */
export const BlurFadeIn = ({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  once = true,
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-40px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: 'blur(8px)', y: 12 }}
      animate={isInView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : { opacity: 0, filter: 'blur(8px)', y: 12 }}
      transition={{ duration, delay, ease: EASE_APPLE }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   GlowPulse — ambient glow animation for badges / status dots
   ═══════════════════════════════════════════════════════════════ */
export const GlowPulse = ({
  children,
  className = '',
  color = 'rgba(65, 45, 21, 0.4)',
  ...props
}) => (
  <motion.div
    animate={{
      boxShadow: [
        `0 0 0px 0px ${color}`,
        `0 0 16px 4px ${color}`,
        `0 0 0px 0px ${color}`,
      ],
    }}
    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════
   Shimmer — horizontal shimmer effect for loading / emphasis
   ═══════════════════════════════════════════════════════════════ */
export const Shimmer = ({ className = '', ...props }) => (
  <motion.div
    className={`relative overflow-hidden ${className}`}
    {...props}
  >
    <motion.div
      className="absolute inset-0 -translate-x-full"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
      }}
      animate={{ x: ['–100%', '100%'] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
    />
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════
   AnimatedDropdown — smooth enter/exit for menus
   ═══════════════════════════════════════════════════════════════ */
export const AnimatedDropdown = ({ isOpen, children, className = '' }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -4, scale: 0.98 }}
        transition={{ duration: 0.2, ease: EASE_APPLE }}
        className={className}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

/* ═══════════════════════════════════════════════════════════════
   FloatingParticle — decorative ambient floating element
   ═══════════════════════════════════════════════════════════════ */
export const FloatingParticle = ({
  size = 6,
  color = '#412D15',
  opacity = 0.15,
  duration = 6,
  delay = 0,
  className = '',
}) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none ${className}`}
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      opacity,
    }}
    animate={{
      y: [0, -20, 0],
      x: [0, 8, 0],
      opacity: [opacity, opacity * 1.5, opacity],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

export default FadeIn;
