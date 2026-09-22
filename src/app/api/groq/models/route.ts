import { NextResponse } from "next/server";

const GROQ_MODELS_URL = "https://api.groq.com/openai/v1/models";

// Excludes speech-to-text (Whisper) and safety-classifier models, which
// aren't chat models and would just clutter the comparison dropdown.
const EXCLUDE_PATTERNS = [/whisper/i, /guard/i, /safeguard/i, /tts/i, /canopylabs/i, /allam-2-7b/i, /groq/i];

export async function GET() {
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

  return NextResponse.json({ models: ids });
}
