/**
 * Request guards for the Groq proxy routes.
 *
 * The whole site spends one shared Groq key, and Groq's free tier is a single
 * quota for that account — so the routes that spend it need ceilings that don't
 * depend on the visitor behaving. There are three, because they stop different
 * things:
 *
 *   - per visitor, per minute → one person (or a stray script) can't drain it
 *   - whole site, per minute  → a class arriving at once is shaped to stay under
 *                               Groq's own rate limit instead of spending calls
 *                               on 429s
 *   - whole site, per day     → nothing can run the key dry over a weekend
 *
 * Counters live in module state, which is the honest trade for not adding a
 * database: a single long-lived server (`npm start`, the classroom machine)
 * enforces all three exactly, while a serverless deployment enforces each
 * instance's share and resets on cold starts — a real ceiling, just a fuzzier
 * one. Moving to a shared store later only means replacing the three helpers at
 * the bottom of this file.
 */

const MINUTE_MS = 60_000;

type Buckets = Map<string, number[]>;
type Budget = { day: string; used: number };
type GuardState = { buckets: Buckets; budget: Budget };

/**
 * Kept on `globalThis` so a dev hot reload — which re-evaluates this module —
 * doesn't silently hand every visitor a fresh allowance mid-session.
 */
const state: GuardState = ((globalThis as typeof globalThis & { __groqGuard?: GuardState }).__groqGuard ??= {
  buckets: new Map(),
  budget: { day: utcDay(), used: 0 },
});

/** The day the budget is measured against; UTC so a server's timezone can't skew it. */
function utcDay(): string {
  return new Date().toISOString().slice(0, 10);
}

function envLimit(name: string, fallback: number): number {
  const raw = Number(process.env[name]);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : fallback;
}

/**
 * Defaults chosen against a free-tier key: Groq allows roughly 30 requests a
 * minute across the account, so the site-wide cap sits just under it and the
 * per-visitor cap is generous enough for a classroom sharing one NAT address
 * (a comparison run costs two requests).
 */
export const LIMITS = {
  perVisitorPerMinute: envLimit("GROQ_LIMIT_PER_VISITOR_PER_MINUTE", 12),
  sitePerMinute: envLimit("GROQ_LIMIT_SITE_PER_MINUTE", 30),
  callsPerDay: envLimit("GROQ_LIMIT_CALLS_PER_DAY", 1000),
  modelLookupsPerMinute: envLimit("GROQ_LIMIT_MODEL_LOOKUPS_PER_MINUTE", 20),
};

export type LimitDecision = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

/** Sliding window: only timestamps inside `windowMs` count, so a burst can't refill mid-window. */
export function checkRateLimit(key: string, limit: number, windowMs = MINUTE_MS): LimitDecision {
  const at = Date.now();
  const recent = (state.buckets.get(key) ?? []).filter((stamp) => at - stamp < windowMs);

  if (recent.length >= limit) {
    state.buckets.set(key, recent);
    return {
      allowed: false,
      limit,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (at - recent[0])) / 1000)),
    };
  }

  recent.push(at);
  state.buckets.set(key, recent);
  pruneIfCrowded(at, windowMs);

  return { allowed: true, limit, remaining: limit - recent.length, retryAfterSeconds: 0 };
}

/** One entry per visitor address: without this the map would grow all day. */
function pruneIfCrowded(at: number, windowMs: number): void {
  if (state.buckets.size < 2_000) return;

  for (const [key, stamps] of state.buckets) {
    const newest = stamps[stamps.length - 1] ?? 0;
    if (at - newest >= windowMs) state.buckets.delete(key);
  }
}

export type BudgetDecision = { allowed: boolean; used: number; limit: number };

export function checkDailyBudget(limit = LIMITS.callsPerDay): BudgetDecision {
  if (state.budget.day !== utcDay()) state.budget = { day: utcDay(), used: 0 };

  return { allowed: state.budget.used < limit, used: state.budget.used, limit };
}

/**
 * Counted per outbound Groq request rather than per page action, because the
 * route retries once when a model leaks its reasoning channel — that retry
 * spends real quota, so it has to show up in the day's total.
 */
export function recordGroqCall(): void {
  if (state.budget.day !== utcDay()) state.budget = { day: utcDay(), used: 0 };

  state.budget.used += 1;
}

/**
 * Best available visitor address for throttling. Behind a proxy that's the first
 * hop in `x-forwarded-for`; a direct connection falls back to the headers Vercel
 * and Netlify set. Everyone behind one school NAT shares a key, which is exactly
 * why the per-visitor limit is generous — it's a flood stop, not a per-student
 * budget.
 */
export function clientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const address =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    "unknown";

  return `${scope}:${address}`;
}

/** Plain-language wait time for the message a visitor actually reads. */
export function retryHint(seconds: number): string {
  if (seconds >= 60) {
    const minutes = Math.ceil(seconds / 60);
    return `about ${minutes} minute${minutes === 1 ? "" : "s"}`;
  }

  return `about ${seconds} second${seconds === 1 ? "" : "s"}`;
}
