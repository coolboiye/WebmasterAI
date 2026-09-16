import { NextResponse } from "next/server";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MAX_PROMPT_LENGTH = 4000;
const MAX_TOKENS = 500;

// One shared key, set by the mentor in the server environment (GROQ_API_KEY),
// is used for every request — students never see or handle a key at all.
// Because it's read from process.env and only ever used server-side, it's
// never sent to the browser, unlike anything prefixed NEXT_PUBLIC_.
export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The Groq Prompt Playground isn't set up yet — ask your mentor to add GROQ_API_KEY." },
      { status: 500 }
    );
  }

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

  let response: Response;
  try {
    response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: MAX_TOKENS,
        temperature: 0.7,
        // Reasoning models (openai/gpt-oss-*, qwen/*) generate an internal
        // "thinking" pass before the real answer. Without this, that raw
        // reasoning text can leak into the visible response — including,
        // occasionally, in a different language than the prompt, which is a
        // known quirk of these models' reasoning channel. Non-reasoning
        // models ignore this field.
        reasoning_format: "hidden",
      }),
    });
  } catch {
    return NextResponse.json({ error: "Couldn't reach Groq. Try again in a moment." }, { status: 502 });
  }

  const latencyMs = Date.now() - startedAt;
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // 429 from Groq here means the *shared class key* hit its rate limit —
    // surface that plainly so a student doesn't think they broke something.
    if (response.status === 429) {
      return NextResponse.json(
        { error: "The class is sending prompts faster than Groq's free tier allows right now — wait about a minute and try again." },
        { status: 429 }
      );
    }
    const message =
      (data && typeof data === "object" && "error" in data && (data.error as { message?: string })?.message) ||
      `Groq returned an error (status ${response.status}).`;
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const content: string = data?.choices?.[0]?.message?.content ?? "";
  const usage = data?.usage ?? null;

  return NextResponse.json({
    content,
    model: data?.model ?? model,
    usage,
    latencyMs,
  });
}