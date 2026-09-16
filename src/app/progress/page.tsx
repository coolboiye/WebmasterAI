"use client";

import Link from "next/link";
import { useState } from "react";
import { ACTIVITIES, MODULES, ModuleId } from "@/lib/progress-data";
import { useProgress } from "@/lib/progress-context";
import { useAuth } from "@/lib/auth-context";
import { BadgeGrid, ProgressSummary } from "@/components/ProgressWidgets";

export default function ProgressPage() {
  const { isActivityComplete, resetProgress, hydrated, syncing } = useProgress();
  const { user, profile, supabaseConfigured, signInWithGoogle } = useAuth();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="page section">
      <div className="prose stack" style={{ gap: "var(--space-12)" }}>
        <div className="stack" style={{ gap: "var(--space-3)" }}>
          <h1>Your progress</h1>
          {syncing ? (
            <p className="text-secondary" style={{ fontSize: "1.0625rem" }}>
              Signed in as {profile?.displayName} — saved to your account, synced across devices, and
              visible on the <Link href="/leaderboard">leaderboard</Link>.
            </p>
          ) : (
            <p className="text-secondary" style={{ fontSize: "1.0625rem" }}>
              Tracked on this device only, in this browser — nothing here is sent anywhere.
            </p>
          )}
          {!syncing && supabaseConfigured && !user && (
            <div className="feedback" style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <p style={{ margin: 0 }}>
                Sign in with Google to save this across devices and show up on the leaderboard.
              </p>
              <button className="btn btn-secondary" style={{ flexShrink: 0 }} onClick={signInWithGoogle}>
                Sign in
              </button>
            </div>
          )}
        </div>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <ProgressSummary />
        </div>

        <div className="stack" style={{ gap: "var(--space-6)" }}>
          <h2>Modules</h2>
          {(Object.keys(MODULES) as ModuleId[]).map((id) => {
            const mod = MODULES[id];
            return (
              <div key={id} className="stack" style={{ gap: "var(--space-3)" }}>
                <p style={{ fontWeight: 500 }}>{mod.title}</p>
                <ul className="stack" style={{ gap: "var(--space-2)", listStyle: "none", padding: 0 }}>
                  {mod.activities.map((activityId) => {
                    const done = hydrated && isActivityComplete(activityId);
                    return (
                      <li
                        key={activityId}
                        style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9375rem" }}
                      >
                        <span>
                          <span className="status-dot" data-done={done} />
                          {ACTIVITIES[activityId].label}
                        </span>
                        <span className="mono text-secondary">{ACTIVITIES[activityId].xp} XP</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <h2>Badges</h2>
          <BadgeGrid />
        </div>

        <div className="stack" style={{ gap: "var(--space-3)" }}>
          {syncing && (
            <p className="text-secondary" style={{ fontSize: "0.8125rem" }}>
              Signed-in progress is kept as a permanent record for the leaderboard, so reset below only
              clears this browser&rsquo;s local copy — your account progress will reappear on reload.
            </p>
          )}
          {!confirming ? (
            <button className="btn btn-secondary" style={{ alignSelf: "flex-start" }} onClick={() => setConfirming(true)}>
              Reset progress
            </button>
          ) : (
            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  resetProgress();
                  setConfirming(false);
                }}
              >
                Confirm reset
              </button>
              <button className="btn btn-secondary" onClick={() => setConfirming(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
