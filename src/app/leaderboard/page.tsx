import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ACTIVITIES, ActivityId, TOTAL_XP } from "@/lib/progress-data";
import { LeaderboardList, type LeaderboardRow } from "@/components/LeaderboardList";
import { Reveal } from "@/components/ui/Reveal";
import { AlertIcon, ShieldIcon, TrophyIcon } from "@/components/ui/Icons";

export const dynamic = "force-dynamic";

type Row = LeaderboardRow;

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
    <div className="shell band">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <Reveal>
          <header className="flex flex-col gap-4">
            <span className="eyebrow">
              <TrophyIcon size={13} />
              Class ranking
            </span>
            <h1>Leaderboard</h1>
            <p className="measure text-[0.9375rem] leading-relaxed text-mute">
              Everyone who has signed in with Google, ranked by XP earned across the three modules.
            </p>
          </header>
        </Reveal>

        {!configured ? (
          <Reveal delay={80}>
            <div className="surface surface flex gap-4 p-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line-strong bg-raised text-mute">
                <AlertIcon size={18} />
              </span>
              <div className="min-w-0">
                <h2 className="text-base">No shared leaderboard yet</h2>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-mute">
                  A Supabase project isn&rsquo;t connected, so there&rsquo;s nothing shared to rank. This
                  page — and cross-device progress — switches on once{" "}
                  <code className="mono text-brand-soft">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                  <code className="mono text-brand-soft">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> are set. See
                  the README for setup steps. Until then, progress is tracked locally on each device from
                  the{" "}
                  <Link
                    href="/progress"
                    className="text-brand-soft underline underline-offset-4 transition-colors hover:text-brand-strong"
                  >
                    Progress
                  </Link>{" "}
                  page.
                </p>
              </div>
            </div>
          </Reveal>
        ) : rows.length === 0 ? (
          <Reveal delay={80}>
            <div className="surface surface flex flex-col items-center gap-4 px-6 py-14 text-center">
              <span className="grid size-12 place-items-center rounded-2xl border border-line-strong bg-raised text-brand-strong">
                <TrophyIcon size={22} />
              </span>
              <div>
                <h2 className="text-base">Nobody has signed in yet</h2>
                <p className="mx-auto mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-mute">
                  Sign in with Google from the menu above and you&rsquo;ll be the first name on the board.
                </p>
              </div>
              <Link href="/login" className="btn btn-primary btn-sm">
                Sign in
              </Link>
            </div>
          </Reveal>
        ) : (
          <>
            <Reveal delay={80}>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.75rem] tracking-[0.14em] text-faint uppercase">
                <span>{rows.length} students ranked</span>
                <span className="text-line-strong">·</span>
                <span>{TOTAL_XP} XP available</span>
              </div>
            </Reveal>
            <Reveal delay={140}>
              <LeaderboardList rows={rows} totalXp={TOTAL_XP} />
            </Reveal>
          </>
        )}

        <Reveal delay={200}>
          <div className="flex items-start gap-3.5 border-t border-line pt-6">
            <ShieldIcon size={16} className="mt-0.5 shrink-0 text-faint" />
            <p className="text-[0.875rem] leading-relaxed text-faint">
              Names and XP here are visible to anyone with this site&rsquo;s URL — that&rsquo;s what makes a
              class leaderboard work, but worth knowing before you sign in.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
