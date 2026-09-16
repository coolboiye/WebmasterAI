import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ACTIVITIES, ActivityId, TOTAL_XP, levelForXp } from "@/lib/progress-data";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  displayName: string;
  xp: number;
  activitiesDone: number;
};

async function loadLeaderboard(): Promise<{ rows: Row[]; configured: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { rows: [], configured: false };

  const [{ data: profiles }, { data: completions }] = await Promise.all([
    supabase.from("profiles").select("id, display_name"),
    supabase.from("activity_completions").select("user_id, activity_id"),
  ]);

  const xpByUser = new Map<string, { xp: number; count: number }>();
  for (const row of completions ?? []) {
    const activity = ACTIVITIES[row.activity_id as ActivityId] as { xp: number } | undefined;
    const entry = xpByUser.get(row.user_id) ?? { xp: 0, count: 0 };
    entry.xp += activity?.xp ?? 0;
    entry.count += 1;
    xpByUser.set(row.user_id, entry);
  }

  const rows: Row[] = (profiles ?? [])
    .map((p) => {
      const stats = xpByUser.get(p.id) ?? { xp: 0, count: 0 };
      return {
        id: p.id,
        displayName: p.display_name ?? "Student",
        xp: stats.xp,
        activitiesDone: stats.count,
      };
    })
    .sort((a, b) => b.xp - a.xp);

  return { rows, configured: true };
}

export default async function LeaderboardPage() {
  const { rows, configured } = await loadLeaderboard();

  return (
    <div className="page section">
      <div className="prose stack" style={{ gap: "var(--space-8)" }}>
        <div className="stack" style={{ gap: "var(--space-3)" }}>
          <h1>Leaderboard</h1>
          <p className="text-secondary" style={{ fontSize: "1.0625rem" }}>
            Everyone who has signed in with Google, ranked by XP earned across the three modules.
          </p>
        </div>

        {!configured ? (
          <p className="feedback">
            No Supabase project is connected yet, so there&rsquo;s no shared leaderboard to show — this
            page (and cross-device progress) turns on once <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> are set. See the README for setup steps. Until
            then, everyone&rsquo;s progress is tracked locally on their own device from the{" "}
            <Link href="/progress">Progress</Link> page.
          </p>
        ) : rows.length === 0 ? (
          <p className="text-secondary">
            Nobody has signed in yet. Sign in with Google from the nav bar to be the first one on the
            board.
          </p>
        ) : (
          <ul className="row-list">
            {rows.map((row, i) => (
              <li key={row.id} className="row-list-item">
                <div className="row-link" style={{ cursor: "default" }}>
                  <span className="row-title">
                    <span className="mono text-secondary" style={{ marginRight: "var(--space-3)" }}>
                      #{i + 1}
                    </span>
                    {row.displayName}
                  </span>
                  <span className="row-meta mono">
                    {row.xp} / {TOTAL_XP} XP &middot; {levelForXp(row.xp).name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
