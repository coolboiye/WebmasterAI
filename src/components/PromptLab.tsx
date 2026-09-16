"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@/lib/progress-context";

const ROUNDS = [
  {
    weak: "Write about dogs.",
    strong:
      "Write a 150-word explainer for a 9th grader on why dogs' sense of smell is so much stronger than humans'. Include two concrete comparisons.",
    why: "Names the audience, sets a length, and asks for specific comparisons instead of \"anything about dogs.\"",
  },
  {
    weak: "help with math",
    strong:
      "I'm stuck solving 2x + 5 = 17. Walk me through each step and explain the reasoning — don't just give me the final answer.",
    why: "States the exact problem and asks for reasoning, not just an answer, which is what actually helps you learn it.",
  },
  {
    weak: "make my essay better",
    strong:
      "Here's my essay's intro paragraph [paste it]. Suggest 2-3 specific changes to make the thesis clearer, without rewriting my sentences for me.",
    why: "Gives the model the actual text to react to, limits the scope to feedback rather than a rewrite, and caps how many suggestions to give.",
  },
  {
    weak: "summarize this article",
    strong:
      "Summarize this article in 5 bullet points aimed at someone who hasn't read it, and flag anything that sounds like it needs fact-checking: [paste article]",
    why: "Specifies the format (5 bullets), the audience, and asks the model to flag uncertain claims instead of stating everything with equal confidence.",
  },
];

export function PromptLab() {
  const { completeActivity, isActivityComplete, hydrated } = useProgress();
  const [attempts, setAttempts] = useState<string[]>(ROUNDS.map(() => ""));
  const [revealed, setRevealed] = useState<boolean[]>(ROUNDS.map(() => false));

  const allRevealed = revealed.every(Boolean);
  const allAttempted = attempts.every((a) => a.trim().length > 0);

  useEffect(() => {
    if (allRevealed && allAttempted) completeActivity("tools-promptlab");
  }, [allRevealed, allAttempted, completeActivity]);

  const done = hydrated && isActivityComplete("tools-promptlab");

  if (done) {
    return <p><strong>Completed</strong> — 30 XP earned.</p>;
  }

  return (
    <div className="stack" style={{ gap: "var(--space-8)" }}>
      {ROUNDS.map((round, i) => (
        <div key={round.weak} className="stack" style={{ gap: "var(--space-3)" }}>
          <p className="text-secondary" style={{ fontSize: "0.875rem" }}>
            Weak prompt {i + 1} of {ROUNDS.length}
          </p>
          <p className="mono" style={{ fontSize: "0.9375rem" }}>
            &ldquo;{round.weak}&rdquo;
          </p>
          <label className="stack" style={{ gap: "var(--space-2)" }}>
            <span style={{ fontSize: "0.875rem" }}>Rewrite it to be specific and useful:</span>
            <textarea
              rows={3}
              value={attempts[i]}
              onChange={(e) =>
                setAttempts((prev) => prev.map((val, idx) => (idx === i ? e.target.value : val)))
              }
              placeholder="Type your improved version here"
            />
          </label>
          {!revealed[i] ? (
            <button
              className="btn btn-secondary"
              style={{ alignSelf: "flex-start" }}
              disabled={attempts[i].trim().length === 0}
              onClick={() => setRevealed((prev) => prev.map((v, idx) => (idx === i ? true : v)))}
            >
              Compare with a strong version
            </button>
          ) : (
            <div className="feedback stack" style={{ gap: "var(--space-2)" }}>
              <p className="mono" style={{ fontSize: "0.9375rem" }}>&ldquo;{round.strong}&rdquo;</p>
              <p className="text-secondary" style={{ fontSize: "0.875rem" }}>{round.why}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}