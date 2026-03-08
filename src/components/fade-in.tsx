"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  /** Direction to slide from: "up" (default) | "left" | "right" | "none" */
  direction?: "up" | "left" | "right" | "none";
  /** How much to offset (px), default 24 */
  offset?: number;
}

/**
 * Fades + slides a single element into view when it enters the viewport.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
  direction = "up",
  offset = 24,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  const hiddenX = direction === "left" ? -offset : direction === "right" ? offset : 0;
  const hiddenY = direction === "up" ? offset : 0;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: hiddenX, y: hiddenY }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

interface FadeInGroupProps {
  children: ReactNode;
  className?: string;
  /** Delay between each child (seconds) */
  stagger?: number;
  /** Base delay before first child (seconds) */
  baseDelay?: number;
  duration?: number;
  direction?: "up" | "left" | "right" | "none";
  offset?: number;
}

/**
 * Wraps multiple children and staggers their fade-in animations.
 * Each direct child gets an incremental delay.
 */
export function FadeInGroup({
  children,
  className,
  stagger = 0.1,
  baseDelay = 0,
  duration = 0.6,
  direction = "up",
  offset = 24,
}: FadeInGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  const hiddenX = direction === "left" ? -offset : direction === "right" ? offset : 0;
  const hiddenY = direction === "up" ? offset : 0;

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: baseDelay } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: hiddenX, y: hiddenY },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration, ease: [0.25, 0.1, 0.25, 1] } },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={itemVariants}>{children}</motion.div>}
    </motion.div>
  );
}
