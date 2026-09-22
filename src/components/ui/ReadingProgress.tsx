"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-linked reading position for the long-form module pages.
 *
 * The value is written straight to a custom property from a rAF-throttled
 * scroll listener, so scrolling never triggers a React render, and the bar
 * itself only ever animates a transform.
 */
export function ReadingProgress() {
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const read = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      fill.style.setProperty("--read", String(read));
    };

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div className="reading-progress no-print" aria-hidden="true">
      <div ref={fillRef} className="reading-progress-fill" />
    </div>
  );
}
