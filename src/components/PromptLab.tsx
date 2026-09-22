"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@/lib/progress-context";

const ROUNDS = [
  {
    weak: "Write about dogs.",
    strong:
      "Write a 150-word explainer for a 9th grader on why dogs' sense of smell is so much stronger than humans'. Include two concrete comparisons.",
    why: "Names the audience, sets a length, and asks for specific comparisons instead of \u201canything about dogs.\u201d",
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

  const revealedCount = revealed.filter(Boolean).length;
  const allRevealed = revealedCount === ROUNDS.length;
  const allAttempted = attempts.every((a) => a.trim().length > 0);

  useEffect(() => {
    if (allRevealed && allAttempted) completeActivity("tools-promptlab");
  }, [allRevealed, allAttempted, completeActivity]);

  const done = hydrated && isActivityComplete("tools-promptlab");

  return (
    <div className="surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <p className="text-[0.9375rem] text-mute">
          {done ? "Lab complete — 30 XP earned." : `${revealedCount} of ${ROUNDS.length} compared`}
        </p>
        <p className="text-[0.875rem] text-faint">Checklist: audience · format · goal · constraints</p>
      </div>

      <ol>
        {ROUNDS.map((round, i) => {
          const revealedThis = revealed[i];
          const attempted = attempts[i]!.trim().length > 0;

          return (
            <li key={round.weak} className="border-b border-line px-5 py-6 last:border-b-0">
              <div className="grid gap-5 lg:grid-cols-2 lg:gap-10">
                <label className="flex flex-col">
                  <span className="flex items-baseline gap-3">
                    <span className="mono text-[0.8125rem] text-brand-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.9375rem] text-faint">Given prompt</span>
                  </span>
                  <span className="mono mt-2 text-[0.9375rem] text-mute">&ldquo;{round.weak}&rdquo;</span>

                  <span className="field-label mt-5">Your rewrite</span>
                  <textarea
                    rows={4}
                    className="field"
                    value={attempts[i]}
                    placeholder="Name the audience, the format, the goal…"
                    onChange={(e) =>
                      setAttempts((prev) => prev.map((val, idx) => (idx === i ? e.target.value : val)))
                    }
                  />

                  {!revealedThis && (
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        disabled={!attempted}
                        onClick={() => setRevealed((prev) => prev.map((v, idx) => (idx === i ? true : v)))}
                      >
                        Compare with a strong version
                      </button>
                      {!attempted && (
                        <span className="text-[0.875rem] text-faint">Write your version first</span>
                      )}
                    </div>
                  )}
                </label>

                {revealedThis && (
                  <div className="animate-settle border-t border-line pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
                    <p className="text-[0.9375rem] text-faint">Stronger version</p>
                    <p className="mono mt-2 text-[0.9375rem] leading-relaxed text-ink">
                      &ldquo;{round.strong}&rdquo;
                    </p>
                    <p className="mt-4 border-t border-line pt-4 text-[0.9375rem] leading-relaxed text-mute">
                      {round.why}
                    </p>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
