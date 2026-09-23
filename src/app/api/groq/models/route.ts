import { NextResponse } from "next/server";
import { checkRateLimit, clientKey, LIMITS, retryHint } from "@/lib/rate-limit";

const GROQ_MODELS_URL = "https://api.groq.com/openai/v1/models";

// Excludes speech-to-text (Whisper) and safety-classifier models, which
// aren't chat models and would just clutter the comparison dropdown.
const EXCLUDE_PATTERNS = [/whisper/i, /guard/i, /safeguard/i, /tts/i, /canopylabs/i, /allam-2-7b/i, /groq/i];

// The available models barely change but every playground visit asks for them,
// so hold one list instead of spending a Groq request per page load. Kept on
// `globalThis` so a dev hot reload doesn't throw the cached copy away.
const CACHE_TTL_MS = 10 * 60_000;
const cache = ((
  globalThis as typeof globalThis & { __groqModelCache?: { models: string[]; fetchedAt: number } }
).__groqModelCache ??= { models: [], fetchedAt: 0 });

// Belt and braces: the handler reads request headers, and it keeps state that
// only makes sense at runtime, so it must never be evaluated while building.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (cache.models.length > 0 && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return NextResponse.json({ models: cache.models });
  }

  // Only cache misses reach Groq, so this throttles someone hammering the
  // endpoint during an outage rather than normal classroom use.
  const visitor = checkRateLimit(clientKey(request, "models"), LIMITS.modelLookupsPerMinute);
  if (!visitor.allowed) {
    return NextResponse.json(
      {
        error: `Too many model-list requests from this device — try again in ${retryHint(visitor.retryAfterSeconds)}.`,
      },
      { status: 429, headers: { "Retry-After": String(visitor.retryAfterSeconds) } }
    );
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The Groq Prompt Playground isn't set up yet — ask your mentor to add GROQ_API_KEY." },
      { status: 500 }
    );
  }

  let response: Response;
  try {
    response = await fetch(GROQ_MODELS_URL, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  } catch {
    return NextResponse.json({ error: "Couldn't reach Groq." }, { status: 502 });
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "error" in data && (data.error as { message?: string })?.message) ||
      `Groq returned an error (status ${response.status}).`;
    return NextResponse.json({ error: message }, { status: 502 });
  }

  type GroqModel = { id: string };
  const ids: string[] = ((data?.data as GroqModel[] | undefined) ?? [])
    .map((m) => m.id)
    .filter((id) => !EXCLUDE_PATTERNS.some((pattern) => pattern.test(id)))
    .sort();

  cache.models = ids;
  cache.fetchedAt = Date.now();

  return NextResponse.json({ models: ids });
}
