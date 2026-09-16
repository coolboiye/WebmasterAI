// Central definition of every gamified activity, its XP value, the badges
// that depend on it, and the level thresholds. Keeping this in one file
// means the dashboard, the module pages, and the badge grid all read from
// the same source of truth instead of hard-coding numbers in three places.

export type ActivityId =
  | "fundamentals-quiz"
  | "fundamentals-vocab"
  | "tools-quiz"
  | "tools-promptlab"
  | "tools-groqlab"
  | "ethics-quiz"
  | "ethics-scenario";

export type ModuleId = "fundamentals" | "tools" | "ethics";

export const ACTIVITIES: Record<ActivityId, { label: string; xp: number; module: ModuleId }> = {
  "fundamentals-quiz": { label: "Concepts check", xp: 100, module: "fundamentals" },
  "fundamentals-vocab": { label: "Vocabulary set", xp: 20, module: "fundamentals" },
  "tools-quiz": { label: "Tools check", xp: 100, module: "tools" },
  "tools-promptlab": { label: "Prompt Lab", xp: 30, module: "tools" },
  "tools-groqlab": { label: "Live Prompt Playground", xp: 40, module: "tools" },
  "ethics-quiz": { label: "Ethics check", xp: 100, module: "ethics" },
  "ethics-scenario": { label: "Scenario walkthrough", xp: 30, module: "ethics" },
};

export const TOTAL_XP = Object.values(ACTIVITIES).reduce((sum, a) => sum + a.xp, 0);

export const MODULES: Record<ModuleId, { title: string; path: string; activities: ActivityId[] }> = {
  fundamentals: {
    title: "Fundamental AI Concepts",
    path: "/modules/fundamentals",
    activities: ["fundamentals-quiz", "fundamentals-vocab"],
  },
  tools: {
    title: "Practical AI Tools & Techniques",
    path: "/modules/tools",
    activities: ["tools-quiz", "tools-promptlab", "tools-groqlab"],
  },
  ethics: {
    title: "Ethical AI Usage",
    path: "/modules/ethics",
    activities: ["ethics-quiz", "ethics-scenario"],
  },
};

// The order modules are meant to be taken in — drives the Back/Next buttons
// at the bottom of each module page.
export const MODULE_ORDER: ModuleId[] = ["fundamentals", "tools", "ethics"];

export type BadgeId = "explorer" | "prompt-engineer" | "ethics-guardian" | "ai-fluent";

export const BADGES: Record<BadgeId, { label: string; description: string; requires: ActivityId[] | "all" }> = {
  explorer: {
    label: "Explorer",
    description: "Completed every activity in Fundamental AI Concepts.",
    requires: ["fundamentals-quiz", "fundamentals-vocab"],
  },
  "prompt-engineer": {
    label: "Prompt Engineer",
    description: "Completed every activity in Practical AI Tools & Techniques.",
    requires: ["tools-quiz", "tools-promptlab", "tools-groqlab"],
  },
  "ethics-guardian": {
    label: "Ethics Guardian",
    description: "Completed every activity in Ethical AI Usage.",
    requires: ["ethics-quiz", "ethics-scenario"],
  },
  "ai-fluent": {
    label: "AI Fluent",
    description: "Earned every badge and finished the portal.",
    requires: "all",
  },
};

export const LEVELS = [
  { name: "Novice", min: 0 },
  { name: "Apprentice", min: 100 },
  { name: "AI Literate", min: 200 },
  { name: "AI Fluent", min: 300 },
] as const;

export function levelForXp(xp: number) {
  let current: (typeof LEVELS)[number] = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.min) current = level;
  }
  const index = LEVELS.indexOf(current);
  const next = LEVELS[index + 1];
  return { name: current.name, next: next ?? null };
}