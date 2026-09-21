"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger offset in milliseconds. */
  delay?: number;
  className?: string;
};

/**
 * Fades + lifts its children the first time they scroll into view.
 *
 * The hidden state only applies under `html.js` (set by an inline script in the
 * root layout), so with JavaScript disabled the content is simply visible
 * rather than stuck at opacity 0. `prefers-reduced-motion` short-circuits the
 * transition in CSS.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No observer support (or a very old browser): show the content outright.
    if (typeof IntersectionObserver === "undefined") {
      node.dataset.visible = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.visible = "true";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      style={{ "--reveal-delay": `${Math.min(delay, 120)}ms` } as React.CSSProperties}
      className={className}
    >
      {children}
    </div>
  );
}
