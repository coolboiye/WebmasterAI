"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ACTIVITIES, BADGES, BadgeId, MODULES, ModuleId } from "@/lib/progress-data";
import { useProgress } from "@/lib/progress-context";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/Icons";

/** Counts a number up when it first becomes available, so XP reads as earned. */
function useCountUp(value: number, active: boolean, duration = 700) {
  const [display, setDisplay] = useState(active ? value : 0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setDisplay(0);
      fromRef.current = 0;
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setDisplay(value);
      fromRef.current = value;
      return;
    }

    const from = fromRef.current;
    if (from === value) return;

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [value, active, duration]);

  return display;
}

function Rail({ pct, tone }: { pct: number; tone?: "ok" }) {
  const scale = Math.min(100, Math.max(0, pct)) / 100;
  return (
    <div className="rail" role="presentation">
      <div className="rail-fill" data-tone={tone} style={{ "--rail-scale": scale } as CSSProperties} />
    </div>
  );
}

/**
 * Flat data panel: level, XP, and the next milestone. Used as the hero visual
 * and as the header of the progress dashboard.
 */
export function ProgressPanel() {
  const { xp, totalXp, level, earnedBadges, hydrated } = useProgress();
  const shown = useCountUp(xp, hydrated);
  const pct = hydrated && totalXp > 0 ? (xp / totalXp) * 100 : 0;
  const remaining = level.next ? Math.max(0, level.next.min - xp) : 0;

  return (
    <section className="surface progress-panel" aria-label="Your progress">
      <div className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-4">
        <span className="text-[0.9375rem] font-semibold text-ink">Your progress</span>
        <span className="mono text-[0.8125rem] text-faint">
          {hydrated ? xp : 0}/{totalXp} XP
        </span>
      </div>

      <div className="px-5 py-6">
        <p className="mono flex items-baseline gap-2 text-[1.75rem] leading-none font-medium text-ink">
          <span>{Math.round(pct)}</span>
          <span className="text-[1rem] text-faint">% complete</span>
        </p>

        <div className="mt-4">
          <Rail pct={hydrated ? pct : 0} />
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <dt className="text-[0.8125rem] text-faint">Level</dt>
            <dd className="mt-0.5 text-[0.9375rem] text-ink">{hydrated ? level.name : "Novice"}</dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-faint">XP earned</dt>
            <dd className="mono mt-0.5 text-[0.9375rem] text-ink">{shown}</dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-faint">Badges</dt>
            <dd className="mono mt-0.5 text-[0.9375rem] text-ink">
              {hydrated ? earnedBadges.length : 0}/4
            </dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-faint">Next</dt>
            <dd className="mt-0.5 text-[0.9375rem] text-ink">
              {level.next ? `${level.next.name} at ${level.next.min}` : "Top level"}
            </dd>
          </div>
        </dl>

        {level.next && (
          <p className="mt-6 border-t border-line pt-4 text-[0.875rem] text-mute">
            {remaining} XP to reach {level.next.name}.
          </p>
        )}
      </div>
    </section>
  );
}

const MODULE_BLURB: Record<ModuleId, string> = {
  fundamentals: "What AI is, how it learns from data, and where it already shows up in your day.",
  tools: "Matching tools to tasks and writing prompts that get you something you can actually use.",
  ethics: "Academic honesty, bias, privacy, and copyright — the judgment calls that come with AI.",
};

/** Rule-separated module index. Rows, not cards. */
export function ModuleList() {
  const { completed, hydrated } = useProgress();

  return (
    <ol className="border-t border-line">
      {(Object.keys(MODULES) as ModuleId[]).map((id, index) => {
        const mod = MODULES[id];
        const doneCount = mod.activities.filter((a) => hydrated && completed[a]).length;
        const total = mod.activities.length;
        const isDone = doneCount === total;
        const moduleXp = mod.activities.reduce((sum, a) => sum + ACTIVITIES[a].xp, 0);
        const pct = total > 0 ? (doneCount / total) * 100 : 0;

        return (
          <li key={id} className="border-b border-line">
            <Link
              href={mod.path}
              className="module-link group -mx-3 grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-x-4 gap-y-3 px-3 py-6 sm:grid-cols-[2.5rem_minmax(0,1fr)_11rem] sm:items-center sm:gap-x-8"
            >
              <span aria-hidden="true" className="module-wash" />
              <span aria-hidden="true" className="module-accent" />

              <span className="module-inner relative z-10 mono pt-1 text-[0.875rem] text-brand-ink sm:pt-0">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="module-inner relative z-10 min-w-0">
                <span className="block text-[1.125rem] font-semibold tracking-[-0.015em] text-ink">
                  {mod.title}
                </span>
                <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-mute">
                  {MODULE_BLURB[id]}
                </span>
                <span className="mono mt-3 block text-[0.8125rem] text-faint sm:hidden">
                  {doneCount}/{total} done · {moduleXp} XP
                </span>
              </span>

              {/* `sm:pr-4` keeps the XP text and its rail just inside the row's
                  hover wash instead of flush against the page edge. */}
              <span className="module-inner relative z-10 col-start-2 flex items-center gap-4 sm:col-start-auto sm:flex-col sm:items-end sm:gap-2 sm:pr-4">
                <span className="mono hidden text-[0.8125rem] text-mute sm:block">
                  {doneCount}/{total} done · {moduleXp} XP
                </span>
                <span className="w-full max-w-[9rem]">
                  <Rail pct={hydrated ? pct : 0} tone={isDone ? "ok" : undefined} />
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

/** Rule-separated badge list. Earned state is carried by a check, not a medal. */
export function BadgeList() {
  const { earnedBadges, hydrated } = useProgress();

  return (
    <ul className="border-t border-line">
      {(Object.keys(BADGES) as BadgeId[]).map((id) => {
        const badge = BADGES[id];
        const earned = hydrated && earnedBadges.includes(id);

        return (
          <li key={id} className="flex items-start gap-4 border-b border-line py-5">
            <span
              aria-hidden="true"
              className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-[3px] border ${
                earned ? "border-ok bg-ok-soft text-ok" : "border-line-strong text-transparent"
              }`}
            >
              <CheckIcon size={13} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className={`text-[1rem] font-medium ${earned ? "text-ink" : "text-mute"}`}>{badge.label}</p>
                {earned && <span className="tag tag-ok">Earned</span>}
              </div>
              <p className="mt-1 text-[0.9375rem] leading-relaxed text-mute">{badge.description}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Closing call to action, shared by several pages. */
export function NextStepLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-brand-ink transition-colors duration-200 hover:text-ink"
    >
      {children}
      <ArrowRightIcon size={16} className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
    </Link>
  );
}
