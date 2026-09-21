"use client";

import Link from "next/link";
import { useState } from "react";
import { ACTIVITIES, MODULES, ModuleId } from "@/lib/progress-data";
import { useProgress } from "@/lib/progress-context";
import { useAuth } from "@/lib/auth-context";
import { BadgeList, ProgressPanel } from "@/components/ProgressWidgets";
import { Reveal } from "@/components/ui/Reveal";
import {
  AlertIcon,
  CheckIcon,
  CompassIcon,
  GaugeIcon,
  GoogleIcon,
  LayersIcon,
  ScaleIcon,
  ShieldIcon,
  TrophyIcon,
} from "@/components/ui/Icons";

const MODULE_ICON: Record<ModuleId, typeof CompassIcon> = {
  fundamentals: CompassIcon,
  tools: LayersIcon,
  ethics: ScaleIcon,
};

export default function ProgressPage() {
  const { isActivityComplete, resetProgress, hydrated, syncing } = useProgress();
  const { user, profile, supabaseConfigured } = useAuth();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="shell band">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <Reveal>
          <header className="flex flex-col gap-4">
            <span className="eyebrow">
              <GaugeIcon size={13} />
              Dashboard
            </span>
            <h1>Your progress</h1>
            <p className="measure text-[0.9375rem] leading-relaxed text-mute">
              {syncing ? (
                <>
                  Signed in as <span className="text-ink">{profile?.displayName}</span> — saved to your
                  account, synced across devices, and visible on the{" "}
                  <Link href="/leaderboard" className="text-brand-soft underline underline-offset-4 transition-colors hover:text-brand-strong">
                    leaderboard
                  </Link>
                  .
                </>
              ) : (
                "Tracked on this device only, in this browser — nothing here is sent anywhere."
              )}
            </p>
          </header>
        </Reveal>

        {!syncing && supabaseConfigured && !user && (
          <Reveal delay={80}>
            <div className="surface flex flex-wrap items-center gap-4 border-brand/25 bg-brand/5 p-5">
              <GoogleIcon size={20} />
              <p className="min-w-[12rem] flex-1 text-[0.9375rem] leading-relaxed text-mute">
                Sign in with Google to save this across devices and show up on the leaderboard.
              </p>
              <Link href="/login" className="btn btn-secondary btn-sm">
                Sign in
              </Link>
            </div>
          </Reveal>
        )}

        <Reveal delay={120}>
          <ProgressPanel />
        </Reveal>

        <Reveal delay={160}>
          <section className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-4">
              <h2>Modules</h2>
              <p className="font-mono text-[0.75rem] tracking-[0.14em] text-faint uppercase">
                {Object.keys(ACTIVITIES).length} activities
              </p>
            </div>

            <ul className="grid gap-4 md:grid-cols-3">
              {(Object.keys(MODULES) as ModuleId[]).map((id) => {
                const mod = MODULES[id];
                const Icon = MODULE_ICON[id];
                const doneCount = mod.activities.filter((a) => hydrated && isActivityComplete(a)).length;

                return (
                  <li key={id} className="surface surface flex flex-col p-5">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line-strong bg-raised text-brand-strong">
                        <Icon size={16} />
                      </span>
                      <p className="min-w-0 text-[0.875rem] font-medium text-ink">{mod.title}</p>
                    </div>

                    <ul className="mt-4 flex flex-1 flex-col gap-2.5 border-t border-line pt-4">
                      {mod.activities.map((activityId) => {
                        const done = hydrated && isActivityComplete(activityId);
                        return (
                          <li key={activityId} className="flex items-center gap-2.5">
                            <span
                              aria-hidden="true"
                              className={`grid size-4 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                                done ? "border-brand-2 bg-brand-2 text-ink" : "border-line-strong text-transparent"
                              }`}
                            >
                              <CheckIcon size={10} />
                            </span>
                            <span className={`min-w-0 flex-1 text-[0.875rem] ${done ? "text-mute" : "text-ink"}`}>
                              {ACTIVITIES[activityId].label}
                            </span>
                            <span className="font-mono text-[0.75rem] text-faint">
                              {ACTIVITIES[activityId].xp}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    <p className="mt-4 font-mono text-[0.75rem] tracking-[0.12em] text-faint uppercase">
                      {doneCount}/{mod.activities.length} complete
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        </Reveal>

        <Reveal delay={200}>
          <section className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-4">
              <h2>Badges</h2>
              <p className="font-mono text-[0.75rem] tracking-[0.14em] text-faint uppercase">4 available</p>
            </div>
            <BadgeList />
          </section>
        </Reveal>

        <Reveal delay={240}>
          <section className="flex flex-col gap-4 border-t border-line pt-8">
            <h2>Reset</h2>
            {syncing && (
              <p className="measure text-[0.875rem] leading-relaxed text-faint">
                Signed-in progress is kept as a permanent record for the leaderboard, so reset below only
                clears this browser&rsquo;s local copy — your account progress will reappear on reload.
              </p>
            )}

            {!confirming ? (
              <button
                type="button"
                className="btn btn-secondary self-start"
                onClick={() => setConfirming(true)}
              >
                Reset progress
              </button>
            ) : (
              <div className="surface animate-pop flex flex-wrap items-center gap-4 border-bad/30 bg-bad-soft/40 p-5">
                <AlertIcon size={19} className="shrink-0 text-bad" />
                <p className="min-w-[12rem] flex-1 text-[0.9375rem] leading-relaxed text-mute">
                  Clear every activity completed in this browser? This can&rsquo;t be undone.
                </p>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      resetProgress();
                      setConfirming(false);
                    }}
                  >
                    Confirm reset
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setConfirming(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>
        </Reveal>

        <Reveal delay={280}>
          <nav aria-label="Related pages" className="flex flex-wrap gap-3 border-t border-line pt-8">
            <Link href="/leaderboard" className="btn btn-secondary btn-sm">
              <TrophyIcon size={15} />
              Leaderboard
            </Link>
            <Link href="/copyright" className="btn btn-secondary btn-sm">
              <ShieldIcon size={15} />
              Copyright checklist
            </Link>
          </nav>
        </Reveal>
      </div>
    </div>
  );
}
