"use client";

import { useAuth } from "@/lib/auth-context";
import { levelForXp } from "@/lib/progress-data";

export type LeaderboardRow = {
  id: string;
  displayName: string;
  xp: number;
  activitiesDone: number;
};

export function LeaderboardList({ rows, totalXp }: { rows: LeaderboardRow[]; totalXp: number }) {
  const { user } = useAuth();
  const leaderXp = Math.max(1, ...rows.map((r) => r.xp));

  return (
    <ol className="border-t border-line">
      {rows.map((row, i) => {
        const isYou = user?.id === row.id;
        const width = Math.max(2, (row.xp / leaderXp) * 100);

        return (
          <li
            key={row.id}
            className={`grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-2 border-b border-line py-4 sm:grid-cols-[2.5rem_minmax(0,1fr)_9rem_5rem] sm:gap-x-6 ${
              isYou ? "bg-surface" : ""
            }`}
          >
            <span className="mono text-[0.9375rem] text-faint">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="flex min-w-0 flex-wrap items-baseline gap-x-3">
              <p className="truncate text-[1rem] font-medium text-ink">{row.displayName}</p>
              {isYou && <span className="tag tag-brand">You</span>}
              <span className="text-[0.875rem] text-faint">{levelForXp(row.xp).name}</span>
            </div>

            <div className="col-start-2 sm:col-start-auto">
              <div className="rail">
                <div className="rail-fill" style={{ width: `${width}%` }} />
              </div>
            </div>

            <p className="mono col-start-2 text-[0.9375rem] text-ink sm:col-start-auto sm:text-right">
              {row.xp}
              <span className="text-faint">/{totalXp}</span>
            </p>
          </li>
        );
      })}
    </ol>
  );
}
