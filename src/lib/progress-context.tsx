"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ACTIVITIES, ActivityId, BADGES, BadgeId, TOTAL_XP, levelForXp } from "./progress-data";
import { useAuth } from "./auth-context";
import { createClient } from "./supabase/client";

const STORAGE_KEY = "ai-portal-progress";

type CompletionMap = Partial<Record<ActivityId, boolean>>;

type ProgressContextValue = {
  completed: CompletionMap;
  xp: number;
  level: ReturnType<typeof levelForXp>;
  totalXp: number;
  earnedBadges: BadgeId[];
  isActivityComplete: (id: ActivityId) => boolean;
  completeActivity: (id: ActivityId) => void;
  resetProgress: () => void;
  hydrated: boolean;
  /** True when progress is being saved to Supabase (signed in), not just this browser. */
  syncing: boolean;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function readLocal(): CompletionMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLocal(map: CompletionMap) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Storage can fail in private browsing; progress still works for the session.
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user, authReady, supabaseConfigured } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [completed, setCompleted] = useState<CompletionMap>({});
  const [hydrated, setHydrated] = useState(false);
  // Tracks which user (or "guest") the current `completed` state was loaded
  // for, so the sign-in effect below only runs its merge-up logic once per
  // transition instead of on every render.
  const loadedForRef = useRef<string | null>(null);

  useEffect(() => {
    if (!authReady) return;

    const key = user?.id ?? "guest";
    if (loadedForRef.current === key) return;
    loadedForRef.current = key;

    let cancelled = false;

    async function load() {
      const local = readLocal();

      if (!user || !supabase) {
        if (!cancelled) {
          setCompleted(local);
          setHydrated(true);
        }
        return;
      }

      const { data, error } = await supabase
        .from("activity_completions")
        .select("activity_id")
        .eq("user_id", user.id);

      if (cancelled) return;

      const remote: CompletionMap = {};
      if (!error && data) {
        for (const row of data) remote[row.activity_id as ActivityId] = true;
      }

      // Merge up: anything finished locally as a guest before signing in
      // gets pushed to Supabase so it isn't lost.
      const toPush = (Object.keys(local) as ActivityId[]).filter((id) => local[id] && !remote[id]);
      if (toPush.length > 0) {
        await supabase.from("activity_completions").upsert(
          toPush.map((id) => ({ user_id: user.id, activity_id: id, xp: ACTIVITIES[id]?.xp ?? 0 })),
          { onConflict: "user_id,activity_id", ignoreDuplicates: true }
        );
        for (const id of toPush) remote[id] = true;
      }

      setCompleted(remote);
      setHydrated(true);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [authReady, user, supabase]);

  const completeActivity = useCallback(
    (id: ActivityId) => {
      setCompleted((prev) => {
        if (prev[id]) return prev;
        const next = { ...prev, [id]: true };
        writeLocal(next);
        return next;
      });

      if (user && supabase) {
        supabase
          .from("activity_completions")
          .upsert(
            { user_id: user.id, activity_id: id, xp: ACTIVITIES[id]?.xp ?? 0 },
            { onConflict: "user_id,activity_id", ignoreDuplicates: true }
          )
          .then(({ error }) => {
            if (error) console.error("Couldn't save progress to Supabase:", error.message);
          });
      }
    },
    [user, supabase]
  );

  const resetProgress = useCallback(() => {
    setCompleted({});
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // No-op if storage is unavailable.
    }
    // Note: this only clears the local/guest copy. Signed-in progress lives
    // in Supabase as an append-only log (no delete policy is set up), so a
    // signed-in student who resets and reloads will see their real progress
    // come back — that's intentional, not a bug.
  }, []);

  const xp = useMemo(
    () => Object.entries(completed).reduce((sum, [id, done]) => (done ? sum + ACTIVITIES[id as ActivityId].xp : sum), 0),
    [completed]
  );

  const earnedBadges = useMemo(() => {
    return (Object.keys(BADGES) as BadgeId[]).filter((badgeId) => {
      const requires = BADGES[badgeId].requires;
      if (requires === "all") {
        return (Object.keys(BADGES) as BadgeId[])
          .filter((id) => id !== "ai-fluent")
          .every((id) => BADGES[id].requires !== "all" && (BADGES[id].requires as ActivityId[]).every((a) => completed[a]));
      }
      return requires.every((a) => completed[a]);
    });
  }, [completed]);

  const value: ProgressContextValue = {
    completed,
    xp,
    level: levelForXp(xp),
    totalXp: TOTAL_XP,
    earnedBadges,
    isActivityComplete: (id) => Boolean(completed[id]),
    completeActivity,
    resetProgress,
    hydrated,
    syncing: Boolean(user) && supabaseConfigured,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
