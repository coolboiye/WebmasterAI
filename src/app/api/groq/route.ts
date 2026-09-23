import { NextResponse } from "next/server";
import { buildMessages, looksLikeForeignLeak, sanitizeCompletion } from "@/lib/groq-safety";
import { checkDailyBudget, checkRateLimit, clientKey, LIMITS, recordGroqCall, retryHint } from "@/lib/rate-limit";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MAX_PROMPT_LENGTH = 4000;
const MAX_TOKENS = 2000;

// Reasoning models accept a reasoning_format of parsed|raw|hidden. `parsed`
// keeps the thinking channel in `message.reasoning` and leaves `message.content`
// clean, which is the only part we render. Non-reasoning models ignore it.
const REASONING_FORMAT = "parsed";

type GroqChoice = { message?: { content?: string | null; reasoning?: string | null } };
type GroqPayload = {
  choices?: GroqChoice[];
  model?: string;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  error?: { message?: string };
};

type Attempt = {
  content: string;
  payload: GroqPayload | null;
  status: number;
  ok: boolean;
};

/** One call to Groq. Network failures surface as a thrown error. */
async function callGroq(
  apiKey: string,
  model: string,
  prompt: string,
  strict: boolean
): Promise<Attempt> {
  // Counted per outbound request rather than per page action: the retry path in
  // POST spends quota too, so it has to show up in the day's total.
  recordGroqCall();

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: buildMessages(prompt, strict),
      max_tokens: MAX_TOKENS,
      temperature: 0.7,
      reasoning_format: REASONING_FORMAT,
    }),
  });

  const payload = (await response.json().catch(() => null)) as GroqPayload | null;
  const raw = payload?.choices?.[0]?.message?.content ?? "";

  return {
    content: sanitizeCompletion(raw, prompt),
    payload,
    status: response.status,
    ok: response.ok,
  };
}

/**
 * Three ceilings in front of the shared key: the day's budget first (once that's
 * gone, nothing else matters), then this visitor's own rate, then the site's.
 * The visitor check runs before the site check so one flood can't consume
 * everyone else's share of the site-wide window.
 */
function requestGuard(request: Request): NextResponse | null {
  const budget = checkDailyBudget();
  if (!budget.allowed) {
    return NextResponse.json(
      {
        error:
          "The playground has reached its daily prompt limit and pauses until tomorrow. Every lesson, quiz, and checklist on the site still works.",
      },
      { status: 503 }
    );
  }

  const visitor = checkRateLimit(clientKey(request, "prompt"), LIMITS.perVisitorPerMinute);
  if (!visitor.allowed) {
    return NextResponse.json(
      {
        error: `That's this playground's speed limit for one device — try again in ${retryHint(visitor.retryAfterSeconds)}.`,
      },
      { status: 429, headers: { "Retry-After": String(visitor.retryAfterSeconds) } }
    );
  }

  const site = checkRateLimit("prompt:site", LIMITS.sitePerMinute);
  if (!site.allowed) {
    return NextResponse.json(
      {
        error: `The playground is handling a lot of prompts at once right now — try again in ${retryHint(site.retryAfterSeconds)}.`,
      },
      { status: 429, headers: { "Retry-After": String(site.retryAfterSeconds) } }
    );
  }

  return null;
}

// One shared key, set by the mentor in the server environment (GROQ_API_KEY),
// is used for every request — students never see or handle a key at all.
// Because it's read from process.env and only ever used server-side, it's never
// sent to the browser, unlike anything prefixed NEXT_PUBLIC_.
export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The Groq Prompt Playground isn't set up yet — ask your mentor to add GROQ_API_KEY." },
      { status: 500 }
    );
  }

  const limited = requestGuard(request);
  if (limited) return limited;

  let body: { model?: string; prompt?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const { model, prompt } = body;

  if (!model || typeof model !== "string") {
    return NextResponse.json({ error: "Missing model." }, { status: 400 });
  }
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ error: "Prompt is empty." }, { status: 400 });
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json(
      { error: `Prompt is too long — keep it under ${MAX_PROMPT_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const startedAt = Date.now();

  let first: Attempt;
  try {
    first = await callGroq(apiKey, model, prompt, false);
  } catch {
    return NextResponse.json({ error: "Couldn't reach Groq. Try again in a moment." }, { status: 502 });
  }

  if (!first.ok) {
    // 429 from Groq here means the *shared class key* hit its rate limit —
    // surface that plainly so a student doesn't think they broke something.
    if (first.status === 429) {
      return NextResponse.json(
        {
          error:
            "The class is sending prompts faster than Groq's free tier allows right now — wait about a minute and try again.",
        },
        { status: 429 }
      );
    }
    const message =
      first.payload?.error?.message ?? `Groq returned an error (status ${first.status}).`;
    return NextResponse.json({ error: message }, { status: 502 });
  }

  let content = first.content;
  let payload = first.payload;

  // Some models still leave reasoning text in the visible content, and that
  // channel is not anchored to the prompt's language — so an English prompt can
  // come back with Chinese reasoning pasted on top. When that happens (or the
  // answer came back empty), ask once more with a firmer instruction before
  // giving up.
  const needsRetry = !content.trim() || looksLikeForeignLeak(content, prompt);

  if (needsRetry) {
    try {
      const second = await callGroq(apiKey, model, prompt, true);
      const secondClean = second.ok && second.content.trim() && !looksLikeForeignLeak(second.content, prompt);
      const secondUsable = second.ok && second.content.trim() && !content.trim();

      if (secondClean || secondUsable) {
        content = second.content;
        payload = second.payload;
      }
    } catch {
      // Keep whatever the first pass produced; the checks below decide.
    }
  }

  if (!content.trim()) {
    return NextResponse.json(
      {
        error:
          "The model returned only its internal reasoning instead of an answer. Try rephrasing the prompt, or pick a different model.",
      },
      { status: 502 }
    );
  }

  if (looksLikeForeignLeak(content, prompt)) {
    return NextResponse.json(
      {
        error:
          "The model answered in the wrong language. Try again, rephrase the prompt, or switch to a different model.",
      },
      { status: 502 }
    );
  }

  const latencyMs = Date.now() - startedAt;

  return NextResponse.json({
    content,
    model: payload?.model ?? model,
    usage: payload?.usage ?? null,
    latencyMs,
  });
}
