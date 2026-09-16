"use client";

import Link from "next/link";
import { BADGES, BadgeId, MODULES, ModuleId } from "@/lib/progress-data";
import { useProgress } from "@/lib/progress-context";

export function ProgressSummary() {
  const { xp, totalXp, level, hydrated } = useProgress();
  const pct = hydrated ? Math.round((xp / totalXp) * 100) : 0;

  return (
    <div className="stack" style={{ gap: "var(--space-3)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <p style={{ fontWeight: 500 }}>{level.name}</p>
        <p className="mono text-secondary" style={{ fontSize: "0.875rem" }}>
          {hydrated ? xp : 0} / {totalXp} XP
        </p>
      </div>
      <div className="xp-bar-track">
        <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      {level.next && (
        <p className="text-secondary" style={{ fontSize: "0.8125rem" }}>
          {level.next.min - xp > 0 ? `${level.next.min - xp} XP to ${level.next.name}` : `Ready for ${level.next.name}`}
        </p>
      )}
    </div>
  );
}

export function BadgeGrid() {
  const { earnedBadges, hydrated } = useProgress();

  return (
    <div className="badge-grid">
      {(Object.keys(BADGES) as BadgeId[]).map((id) => {
        const badge = BADGES[id];
        const earned = hydrated && earnedBadges.includes(id);
        return (
          <div key={id} className="badge" data-earned={earned}>
            <span className="badge-label">{badge.label}</span>
            <span className="badge-desc">{badge.description}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ModuleList() {
  const { completed, hydrated } = useProgress();

  return (
    <ul className="row-list">
      {(Object.keys(MODULES) as ModuleId[]).map((id) => {
        const mod = MODULES[id];
        const doneCount = mod.activities.filter((a) => hydrated && completed[a]).length;
        const isDone = doneCount === mod.activities.length;
        return (
          <li key={id} className="row-list-item">
            <Link href={mod.path} className="row-link">
              <span className="row-title">
                <span className="status-dot" data-done={isDone} />
                {mod.title}
              </span>
              <span className="row-meta mono">
                {doneCount}/{mod.activities.length}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
