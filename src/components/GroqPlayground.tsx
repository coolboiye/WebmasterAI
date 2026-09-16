"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@/lib/progress-context";

const FALLBACK_MODELS = ["llama-3.1-8b-instant", "llama-3.3-70b-versatile", "openai/gpt-oss-20b", "openai/gpt-oss-120b"];
const DEFAULT_MODEL = "llama-3.1-8b-instant"; // highest free-tier rate limit — best fit for a shared classroom key

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

function ResponsePanel({ label, prompt, state }: { label: string; prompt: string; state: RunState }) {
  return (
    <div className="stack" style={{ gap: "var(--space-2)", flex: 1, minWidth: 0 }}>
      <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{label}</p>
      <div
        className="feedback"
        style={{
          minHeight: "8rem",
          maxHeight: "22rem",
          overflowY: "auto",
          whiteSpace: "pre-wrap",
          fontSize: "0.9375rem",
        }}
      >
        {state.status === "idle" && <span className="text-secondary">Response will appear here.</span>}
        {state.status === "loading" && <span className="text-secondary">Waiting on Groq&hellip;</span>}
        {state.status === "error" && <span style={{ color: "#b3261e" }}>{state.message}</span>}
        {state.status === "done" && state.content}
      </div>
      {state.status === "done" && (
        <p className="mono text-secondary" style={{ fontSize: "0.75rem" }}>
          {state.latencyMs}ms
          {state.usage?.completion_tokens != null && ` · ${state.usage.completion_tokens} tokens out`}
          {state.usage?.total_tokens != null && ` · ${state.usage.total_tokens} tokens total`}
        </p>
      )}
      {!prompt.trim() && <p className="text-secondary" style={{ fontSize: "0.75rem" }}>Enter a prompt above to run this one.</p>}
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
  const canRun = Boolean(promptA.trim() || promptB.trim()) && !running && modelsError === null;

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

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      {done && (
        <p>
          <strong>Completed</strong> — 40 XP earned. Keep experimenting below any time.
        </p>
      )}

      {modelsError && (
        <p className="feedback" style={{ borderColor: "#b3261e" }}>
          {modelsError}
        </p>
      )}

      <label className="stack" style={{ gap: "var(--space-2)", maxWidth: "24rem" }}>
        <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Model (used for both prompts, so the only variable is your wording)</span>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </label>

      <div className="stack" style={{ gap: "var(--space-4)" }}>
        <div style={{ display: "flex", gap: "var(--space-6)", flexWrap: "wrap" }}>
          <label className="stack" style={{ gap: "var(--space-2)", flex: 1, minWidth: "16rem" }}>
            <span style={{ fontSize: "0.875rem" }}>Prompt A</span>
            <textarea rows={4} value={promptA} onChange={(e) => setPromptA(e.target.value)} />
          </label>
          <label className="stack" style={{ gap: "var(--space-2)", flex: 1, minWidth: "16rem" }}>
            <span style={{ fontSize: "0.875rem" }}>Prompt B</span>
            <textarea rows={4} value={promptB} onChange={(e) => setPromptB(e.target.value)} />
          </label>
        </div>

        <button className="btn btn-primary" style={{ alignSelf: "flex-start" }} disabled={!canRun} onClick={runComparison}>
          {running ? "Running both prompts…" : "Run comparison"}
        </button>

        <div style={{ display: "flex", gap: "var(--space-6)", flexWrap: "wrap" }}>
          <ResponsePanel label="Response A" prompt={promptA} state={resultA} />
          <ResponsePanel label="Response B" prompt={promptB} state={resultB} />
        </div>
      </div>
    </div>
  );
}
