"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { AlertIcon, CheckIcon, PlayIcon, SpinnerIcon } from "@/components/ui/Icons";

// Only used until /api/groq/models answers — the live list always wins, because
// an account's model access changes over time. The previous default
// (llama-3.1-8b-instant) was retired, which made every run fail with "model does
// not exist", so this list is kept to what the API actually returns now.
const FALLBACK_MODELS = ["openai/gpt-oss-20b", "openai/gpt-oss-120b", "qwen/qwen3.8-27b"];
const DEFAULT_MODEL = "openai/gpt-oss-20b"; // smallest current chat model — fastest, highest free-tier limits
const MAX_PROMPT_LENGTH = 4000;

const DEFAULT_PROMPT_A = "Write about dogs.";
const DEFAULT_PROMPT_B =
  "Write a 100-word explainer for a 9th grader on why dogs' sense of smell is so much stronger than humans'. Include two concrete comparisons.";

type RunResult = {
  content: string;
  latencyMs: number;
  usage: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } | null;
};

type RunState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | ({ status: "done" } & RunResult);

function LoadingLines() {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      {[92, 78, 60].map((width) => (
        <span key={width} className="block h-2.5 animate-pulse rounded-[2px] bg-line" style={{ width: `${width}%` }} />
      ))}
      <span className="mono mt-1 inline-flex items-center gap-2 text-[0.875rem] text-faint">
        waiting on groq
        <span className="animate-caret inline-block h-3.5 w-[2px] bg-brand" />
      </span>
    </div>
  );
}

function ResponsePanel({
  badge,
  prompt,
  state,
  accent,
}: {
  badge: string;
  prompt: string;
  state: RunState;
  accent: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex items-baseline justify-between gap-3">
        <p className={`text-[0.9375rem] font-semibold ${accent ? "text-brand-ink" : "text-ink"}`}>
          Response {badge}
        </p>
        {state.status === "done" && (
          <p className="mono text-[0.8125rem] text-faint">
            {state.latencyMs}ms
            {state.usage?.completion_tokens != null && ` · ${state.usage.completion_tokens} tok`}
          </p>
        )}
      </div>

      <div
        className="mt-2.5 min-h-[11rem] flex-1 overflow-y-auto border border-line bg-canvas p-4"
        style={{ maxHeight: "24rem" }}
        role="region"
        aria-label={`Response ${badge} output`}
        aria-live="polite"
      >
        {state.status === "idle" && (
          <p className="mono text-[0.875rem] text-faint">
            {prompt.trim() ? "ready — press run" : "enter a prompt to run this one"}
          </p>
        )}

        {state.status === "loading" && <LoadingLines />}

        {state.status === "error" && (
          <p className="flex gap-3 text-[0.9375rem] leading-relaxed text-bad">
            <AlertIcon size={16} className="mt-1 shrink-0" />
            <span>{state.message}</span>
          </p>
        )}

        {state.status === "done" && (
          <p className="animate-settle whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-body">
            {state.content}
          </p>
        )}
      </div>
    </div>
  );
}

export function GroqPlayground() {
  const { completeActivity, isActivityComplete, hydrated } = useProgress();
  const [models, setModels] = useState<string[]>(FALLBACK_MODELS);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [promptA, setPromptA] = useState(DEFAULT_PROMPT_A);
  const [promptB, setPromptB] = useState(DEFAULT_PROMPT_B);
  const [resultA, setResultA] = useState<RunState>({ status: "idle" });
  const [resultB, setResultB] = useState<RunState>({ status: "idle" });

  const done = hydrated && isActivityComplete("tools-groqlab");
  const running = resultA.status === "loading" || resultB.status === "loading";
  const tooLong = promptA.length > MAX_PROMPT_LENGTH || promptB.length > MAX_PROMPT_LENGTH;
  // A failed model-list fetch doesn't block running: the fallback list above is
  // known-good, and a run reports its own error far more usefully than a
  // disabled button does. (Blocking here also meant our own rate limit could
  // take the whole playground offline for a visitor who just reloaded a lot.)
  const canRun = Boolean(promptA.trim() || promptB.trim()) && !running && !tooLong;

  useEffect(() => {
    let cancelled = false;

    fetch("/api/groq/models")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.models && data.models.length > 0) {
          setModels(data.models);
          setModel((prev) => (data.models.includes(prev) ? prev : data.models[0]));
        } else if (data.error) {
          setModelsError(data.error as string);
        }
      })
      .catch(() => {
        if (!cancelled) setModelsError("Couldn't reach the Groq Prompt Playground right now.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function runOne(prompt: string, setResult: (s: RunState) => void): Promise<boolean> {
    if (!prompt.trim()) return false;
    setResult({ status: "loading" });
    try {
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ status: "error", message: data.error ?? "Something went wrong." });
        return false;
      }
      setResult({ status: "done", content: data.content, latencyMs: data.latencyMs, usage: data.usage });
      return true;
    } catch {
      setResult({ status: "error", message: "Network error — check your connection and try again." });
      return false;
    }
  }

  async function runComparison() {
    const outcomes = await Promise.all([runOne(promptA, setResultA), runOne(promptB, setResultB)]);
    if (outcomes.some(Boolean)) completeActivity("tools-groqlab");
  }

  function swapPrompts() {
    setPromptA(promptB);
    setPromptB(promptA);
    setResultA({ status: "idle" });
    setResultB({ status: "idle" });
  }

  function resetPrompts() {
    setPromptA(DEFAULT_PROMPT_A);
    setPromptB(DEFAULT_PROMPT_B);
    setResultA({ status: "idle" });
    setResultB({ status: "idle" });
  }

  return (
    <div className="surface">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4 border-b border-line px-5 py-4">
        <label className="flex min-w-[14rem] flex-1 flex-col">
          <span className="field-label">Model</span>
          <select className="field" value={model} onChange={(e) => setModel(e.target.value)}>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <p className="min-w-0 flex-1 pb-2.5 text-[0.875rem] leading-relaxed text-faint">
          Both prompts run on this one model, so the only variable is your wording.
        </p>
      </div>

      {done && (
        <p className="border-b border-line px-5 py-3 text-[0.875rem] text-mute">
          <span className="text-ok">+40 XP</span> — you can keep experimenting below any time.
        </p>
      )}

      {modelsError && (
        <p className="flex gap-3 border-b border-line px-5 py-4 text-[0.9375rem] leading-relaxed text-mute">
          <AlertIcon size={17} className="mt-1 shrink-0 text-warn" />
          <span>{modelsError}</span>
        </p>
      )}

      <div className="px-5 py-6">
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-8">
          {(
            [
              { badge: "A", value: promptA, set: setPromptA, accent: true },
              { badge: "B", value: promptB, set: setPromptB, accent: false },
            ]
          ).map((editor) => (
            <label key={editor.badge} className="flex flex-col">
              <span className="flex items-baseline justify-between gap-3">
                <span className={`text-[0.9375rem] font-semibold ${editor.accent ? "text-brand-ink" : "text-ink"}`}>
                  Prompt {editor.badge}
                </span>
                <span className={`mono text-[0.8125rem] ${editor.value.length > MAX_PROMPT_LENGTH ? "text-bad" : "text-faint"}`}>
                  {editor.value.length}/{MAX_PROMPT_LENGTH}
                </span>
              </span>
              <textarea
                rows={4}
                maxLength={MAX_PROMPT_LENGTH + 200}
                className="field mt-2.5"
                value={editor.value}
                onChange={(e) => editor.set(e.target.value)}
                placeholder={editor.badge === "A" ? "A vague version…" : "A specific version…"}
              />
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <button type="button" className="btn btn-primary" disabled={!canRun} onClick={runComparison}>
            {running ? (
              <>
                <SpinnerIcon size={17} className="animate-spin" />
                Running both prompts…
              </>
            ) : (
              <>
                <PlayIcon size={16} />
                Run comparison
              </>
            )}
          </button>
          <button type="button" className="btn btn-quiet" onClick={swapPrompts} disabled={running}>
            Swap A and B
          </button>
          <button type="button" className="btn btn-quiet" onClick={resetPrompts} disabled={running}>
            Reset prompts
          </button>
          {tooLong && <span className="tag tag-bad">prompt too long</span>}
        </div>

        <div className="mt-8 grid gap-6 border-t border-line pt-7 lg:grid-cols-2 lg:gap-8">
          <ResponsePanel badge="A" prompt={promptA} state={resultA} accent />
          <ResponsePanel badge="B" prompt={promptB} state={resultB} accent={false} />
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5 text-[0.8125rem] text-faint">
          <span className="inline-flex items-center gap-2">
            <CheckIcon size={13} />
            Shared class key — no account needed
          </span>
          <span>Answers match your prompt&apos;s language</span>
        </div>
      </div>
    </div>
  );
}
