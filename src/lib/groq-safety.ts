/**
 * Guards around the Groq chat completions call.
 *
 * Reasoning models (openai/gpt-oss-*, qwen3, deepseek-r1 distills) generate an
 * internal "thinking" channel before the real answer. Groq usually separates
 * that into `message.reasoning`, but two things can still leak it into the
 * visible text:
 *
 *   1. Models that emit their own ` thinking…<｜end▁of▁thinking｜>` wrapper inline.
 *   2. A `reasoning_format` the model doesn't support, in which case the raw
 *      reasoning can land in `message.content`.
 *
 * The reasoning channel is also *not* language-anchored to the prompt, and
 * gpt-oss in particular is known to think in Chinese mid-sentence. That is the
 * "Groq spits out Chinese" symptom this module exists to kill.
 *
 * Everything here runs on the server only — see src/app/api/groq/route.ts.
 */

// Server-only module: imported by src/app/api/groq/route.ts.

export const SYSTEM_PROMPT = [
  "You are the assistant inside a classroom AI-literacy tool used by high school students.",
  "Follow these rules for every reply:",
  "1. Answer in the same language the student wrote in. If their message is in English, your entire reply must be in English — never mix in another language.",
  "2. Output only your finished answer. Never reveal, restate, or summarise your internal reasoning, analysis, or chain of thought.",
  "3. Never emit reasoning tags such as  thinking, <thinking>, or <|channel|> markers.",
  "4. Be concrete and concise. Prefer specific examples over general statements.",
].join("\n");

/** Appended only on the retry pass, when the first answer looked wrong. */
export const STRICT_LANGUAGE_ADDENDUM =
  "IMPORTANT: Your previous reply was not usable. Respond using English only, with no reasoning, notes, or translation into any other language.";

type Msg = { role: "system" | "user" | "assistant"; content: string };

export function buildMessages(prompt: string, strict = false): Msg[] {
  const system = strict ? `${SYSTEM_PROMPT}\n${STRICT_LANGUAGE_ADDENDUM}` : SYSTEM_PROMPT;
  return [
    { role: "system", content: system },
    { role: "user", content: prompt },
  ];
}

/** Scripts whose presence in an English reply signals leaked reasoning. */
const CJK =
  /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af\u0e00-\u0e7f\u0400-\u04ff]/;

/** Removes inline reasoning wrappers some models still emit in `content`. */
export function stripReasoningArtifacts(text: string): string {
  return text
    .replace(/<think(?:ing)?>[\s\S]*?<\/think(?:ing)?>/gi, "")
    // Groq/OpenAI-style special tokens: <|channel|> and the full-width
    // <｜end▁of▁thinking｜> variant that gpt-oss-family models emit.
    .replace(/<[|｜][^<>\n]{0,60}[|｜]>/g, "")
    // A bare "Thinking Process:" / "Reasoning:" header line on its own.
    .replace(/^\s*(?:thinking process|reasoning|analysis|chain of thought)\s*:?\s*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isForeignLine(line: string) {
  const compact = line.replace(/\s/g, "");
  if (compact.length < 6) return false;
  let foreign = 0;
  for (const char of compact) if (CJK.test(char)) foreign += 1;
  // A line that is mostly another script is a reasoning echo, not an answer.
  return foreign / compact.length > 0.4;
}

/**
 * Drops individual lines that are dominated by a non-Latin script. Line-level
 * (rather than whole-response) filtering means an English answer that merely
 * quoted a foreign term survives intact.
 */
export function dropForeignLines(text: string): string {
  const kept = text
    .split("\n")
    .filter((line) => !isForeignLine(line))
    .join("\n");

  return kept.replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Full clean-up applied to `message.content` before it reaches the browser.
 *
 * `prompt` matters: the foreign-line filter exists to delete a reasoning
 * channel that leaked, but a student is perfectly allowed to prompt in another
 * language. When the prompt itself is written in that script, the filter is
 * skipped so their real answer isn't thrown away.
 */
export function sanitizeCompletion(raw: string, prompt = ""): string {
  const stripped = stripReasoningArtifacts(raw ?? "");
  if (prompt && CJK.test(prompt)) return stripped;
  return dropForeignLines(stripped);
}

/** True when a reply is still mostly another script, relative to the prompt. */
export function looksLikeForeignLeak(content: string, prompt: string): boolean {
  const body = content.replace(/\s/g, "");
  if (body.length < 30) return false;
  // The student may genuinely be writing in another script — then don't judge.
  if (CJK.test(prompt)) return false;

  let foreign = 0;
  for (const char of body) if (CJK.test(char)) foreign += 1;
  return foreign / body.length > 0.25;
}
