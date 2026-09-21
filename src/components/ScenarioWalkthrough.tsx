"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/Icons";

type Choice = { id: string; text: string; feedback: string; recommended?: boolean };
type Scenario = { prompt: string; choices: Choice[] };

const SCENARIOS: Scenario[] = [
  {
    prompt:
      "A friend asks you to use an AI tool to write their entire history essay and turn it in as their own work. What do you do?",
    choices: [
      {
        id: "a",
        text: "Write it for them — it saves everyone time.",
        feedback:
          "Submitting AI-written work as your own is academic dishonesty at most schools, and it means your friend doesn't learn the material either.",
      },
      {
        id: "b",
        text: "Decline, but offer to help them brainstorm an outline or check grammar with AI instead.",
        feedback:
          "This is usually the strongest option: it draws a clear line between using AI as a study aid — often allowed — and using it to replace your own work, which usually isn't.",
        recommended: true,
      },
      {
        id: "c",
        text: "Report your friend to a teacher right away.",
        feedback:
          "Not automatically wrong, but talking to your friend directly first — and pointing them to an acceptable use of AI — is often more constructive than escalating immediately.",
      },
    ],
  },
  {
    prompt:
      "An AI tool generates a paragraph for your science report that includes a surprising statistic. What's the right next step?",
    choices: [
      {
        id: "a",
        text: "Include it as-is — the AI generated it, so it's probably accurate.",
        feedback:
          "AI tools can state incorrect information confidently and fluently. Fluent-sounding text is not the same as verified text.",
      },
      {
        id: "b",
        text: "Check the statistic against a trustworthy source before including it.",
        feedback:
          "This is the strongest option. Treat AI output as a first draft to verify, not a finished, fact-checked source.",
        recommended: true,
      },
      {
        id: "c",
        text: "Delete the statistic entirely rather than deal with it.",
        feedback:
          "Safe, but it throws away a potentially useful point instead of taking the short step of verifying it.",
      },
    ],
  },
  {
    prompt:
      "You want to use an AI image generator to create the cover art for this competition's website. What should you check first?",
    choices: [
      {
        id: "a",
        text: "Nothing — if the tool generated it, you own it and can use it however you want.",
        feedback:
          "AI-generated art sits in a legally unsettled area, and competitions frequently have their own specific rules about it — assuming it's automatically fine can cost you points or disqualify a submission.",
      },
      {
        id: "b",
        text: "Check this competition's rules on AI-generated art, and keep a record of what tool and prompt you used.",
        feedback:
          "Exactly right — event rules on AI-generated content vary and change, and keeping a record protects you if anyone later asks how an asset was made.",
        recommended: true,
      },
      {
        id: "c",
        text: "Use it, but don't mention anywhere that AI was involved.",
        feedback:
          "Concealing how an asset was made is worse than the AI use itself — if it's later discovered, it looks like you tried to hide something.",
      },
    ],
  },
  {
    prompt:
      "You're chatting with a free AI tool and it starts responding in a way that's clearly incorrect about a topic you know well. What's the best move?",
    choices: [
      {
        id: "a",
        text: "Assume you're wrong, since the AI sounds confident.",
        feedback:
          "Confidence in tone is not evidence of accuracy. An AI tool has no way to signal uncertainty just by how it phrases things.",
      },
      {
        id: "b",
        text: "Push back, ask it to double check itself, and independently verify with another source.",
        feedback:
          "Good instinct — a model can sometimes catch its own error when challenged, but the real safeguard is checking against a source you trust, not just trusting the AI's second attempt either.",
        recommended: true,
      },
      {
        id: "c",
        text: "Stop using AI tools entirely going forward.",
        feedback:
          "An understandable reaction, but an overcorrection — the more useful skill is knowing when to verify, not avoiding the tool altogether.",
      },
    ],
  },
];

export function ScenarioWalkthrough() {
  const { completeActivity, isActivityComplete, hydrated } = useProgress();
  const [index, setIndex] = useState(0);
  const [choiceId, setChoiceId] = useState<string | null>(null);

  const done = hydrated && isActivityComplete("ethics-scenario");
  const scenario = SCENARIOS[index]!;
  const isLast = index === SCENARIOS.length - 1;
  const chosen = scenario.choices.find((c) => c.id === choiceId);

  function next() {
    if (isLast) {
      completeActivity("ethics-scenario");
      return;
    }
    setIndex((i) => i + 1);
    setChoiceId(null);
  }

  return (
    <div className="surface">
      <div className="flex items-center gap-4 border-b border-line px-5 py-3.5">
        <span className="mono shrink-0 text-[0.8125rem] text-mute">
          {String(index + 1).padStart(2, "0")} / {String(SCENARIOS.length).padStart(2, "0")}
        </span>
        <div className="flex flex-1 items-center gap-1" aria-hidden="true">
          {SCENARIOS.map((s, i) => (
            <span
              key={s.prompt}
              className={`h-[3px] flex-1 transition-colors duration-150 ${
                i < index ? "bg-brand" : i === index ? "bg-mute" : "bg-line"
              }`}
            />
          ))}
        </div>
        <span className="tag shrink-0">30 XP</span>
      </div>

      <div className="px-5 py-6 sm:px-6">
        <p className="text-[1.125rem] leading-snug font-semibold text-ink">{scenario.prompt}</p>

        <div className="mt-6 flex flex-col gap-2.5" role="group" aria-label="Scenario choices">
          {scenario.choices.map((choice) => {
            const isChosen = choiceId === choice.id;
            const markRecommended = Boolean(choiceId) && Boolean(choice.recommended);

            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => setChoiceId(choice.id)}
                aria-pressed={isChosen}
                className={`flex cursor-pointer items-start gap-4 rounded-[3px] border px-4 py-3.5 text-left text-[1rem] leading-relaxed transition-colors duration-150 ${
                  isChosen
                    ? "border-brand bg-surface text-ink"
                    : "border-line-strong text-body hover:border-faint hover:bg-surface hover:text-ink"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-[0.4rem] grid size-4 shrink-0 place-items-center rounded-[2px] border transition-colors duration-150 ${
                    isChosen ? "border-brand" : "border-faint"
                  }`}
                >
                  {isChosen && <span className="size-2 rounded-[1px] bg-brand" />}
                </span>
                <span className="min-w-0 flex-1">
                  {choice.text}
                  {markRecommended && <span className="tag tag-ok mt-2.5 block w-fit">Strongest option</span>}
                </span>
              </button>
            );
          })}
        </div>

        {chosen && (
          <div
            role="status"
            className={`mt-6 border-l-2 py-1 pl-5 ${chosen.recommended ? "border-ok" : "border-brand"}`}
          >
            <p className="text-[0.9375rem] font-semibold text-ink">
              {chosen.recommended ? "Strongest move" : "Worth reconsidering"}
            </p>
            <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-body">{chosen.feedback}</p>
          </div>
        )}

        {chosen && (
          <button type="button" className="btn btn-primary mt-7" onClick={next}>
            {isLast ? "Finish scenarios" : "Next scenario"}
            {isLast ? <CheckIcon size={17} /> : <ArrowRightIcon size={17} />}
          </button>
        )}
      </div>

      {done && (
        <p className="border-t border-line px-5 py-3.5 text-[0.875rem] text-mute">
          Walkthrough complete — 30 XP earned.
        </p>
      )}
    </div>
  );
}
