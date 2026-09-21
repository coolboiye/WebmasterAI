"use client";

import Link from "next/link";
import { ACTIVITIES, BADGES, BadgeId, MODULES, ModuleId, MODULE_ORDER } from "@/lib/progress-data";
import { useProgress } from "@/lib/progress-context";
import { CheckIcon } from "@/components/ui/Icons";

const SHORT: Record<ModuleId, string> = {
  fundamentals: "Concepts",
  tools: "Tools",
  ethics: "Ethics",
};

/** Finds the badge that unlocks when this module's activities are all done. */
function badgeForModule(id: ModuleId) {
  const needed = MODULES[id].activities;
  return (Object.keys(BADGES) as BadgeId[]).find((badgeId) => {
    const requires = BADGES[badgeId].requires;
    return requires !== "all" && requires.length === needed.length && needed.every((a) => requires.includes(a));
  });
}

export function ModuleRail({ current }: { current: ModuleId }) {
  const { completed, hydrated, earnedBadges } = useProgress();
  const mod = MODULES[current];
  const badgeId = badgeForModule(current);

  const earnedXp = mod.activities.reduce((sum, a) => sum + (hydrated && completed[a] ? ACTIVITIES[a].xp : 0), 0);
  const totalXp = mod.activities.reduce((sum, a) => sum + ACTIVITIES[a].xp, 0);
  const pct = totalXp > 0 ? (earnedXp / totalXp) * 100 : 0;
  const badgeEarned = Boolean(badgeId) && hydrated && earnedBadges.includes(badgeId as BadgeId);

  return (
    <div className="surface">
      <div className="border-b border-line px-5 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[0.9375rem] font-semibold text-ink">This module</p>
          <p className="mono text-[0.8125rem] text-faint">
            {earnedXp}/{totalXp} XP
          </p>
        </div>
        <div className="mt-3">
          <div className="rail">
            <div className="rail-fill" style={{ width: `${hydrated ? pct : 0}%` }} />
          </div>
        </div>
      </div>

      <ul>
        {mod.activities.map((activityId) => {
          const done = hydrated && Boolean(completed[activityId]);
          return (
            <li
              key={activityId}
              className="flex items-center gap-3 border-b border-line px-5 py-3 last:border-b-0"
            >
              <span
                aria-hidden="true"
                className={`grid size-4 shrink-0 place-items-center rounded-[2px] border ${
                  done ? "border-ok bg-ok-soft text-ok" : "border-line-strong text-transparent"
                }`}
              >
                <CheckIcon size={10} />
              </span>
              <span className={`min-w-0 flex-1 text-[0.9375rem] ${done ? "text-mute" : "text-ink"}`}>
                {ACTIVITIES[activityId].label}
              </span>
              <span className="mono shrink-0 text-[0.8125rem] text-faint">{ACTIVITIES[activityId].xp}</span>
            </li>
          );
        })}
      </ul>

      {badgeId && (
        <p className="border-t border-line px-5 py-3.5 text-[0.875rem] leading-relaxed text-faint">
          {badgeEarned
            ? `Badge earned: ${BADGES[badgeId].label}.`
            : `Finish all ${mod.activities.length} to earn the ${BADGES[badgeId].label} badge.`}
        </p>
      )}

      <div className="flex flex-col border-t border-line">
        {MODULE_ORDER.filter((id) => id !== current).map((id) => (
          <Link
            key={id}
            href={MODULES[id].path}
            className="border-b border-line px-5 py-3 text-[0.9375rem] text-mute transition-colors duration-150 last:border-b-0 hover:bg-surface hover:text-brand"
          >
            Go to {SHORT[id]}
          </Link>
        ))}
      </div>
    </div>
  );
}
