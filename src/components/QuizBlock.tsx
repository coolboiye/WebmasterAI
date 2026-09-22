"use client";

import { useState } from "react";
import { ACTIVITIES, ActivityId } from "@/lib/progress-data";
import { useProgress } from "@/lib/progress-context";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/Icons";

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
};

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuizBlock({ activityId, questions }: { activityId: ActivityId; questions: QuizQuestion[] }) {
  const { completeActivity, isActivityComplete, hydrated } = useProgress();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState(false);

  const alreadyDone = hydrated && isActivityComplete(activityId) && !reviewing;
  const question = questions[index]!;
  const isLast = index === questions.length - 1;
  const isCorrect = selected === question.correctId;
  const xp = ACTIVITIES[activityId].xp;

  function selectOption(optionId: string) {
    if (isCorrect) return; // locked in once correct
    setSelected(optionId);
  }

  function next() {
    if (isLast) {
      completeActivity(activityId);
      setReviewing(false);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  if (alreadyDone) {
    return (
      <div className="surface flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4">
        <span className="mono text-[0.8125rem] text-ok">+{xp} XP</span>
        <p className="min-w-[10rem] flex-1 text-[0.9375rem] text-ink">Module quiz complete.</p>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => {
            setReviewing(true);
            setIndex(0);
            setSelected(null);
          }}
        >
          Review questions
        </button>
      </div>
    );
  }

  return (
    <div className="surface">
      {/* progress + count */}
      <div className="flex items-center gap-4 border-b border-line px-5 py-3.5">
        <span className="mono shrink-0 text-[0.8125rem] text-mute">
          {String(index + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
        </span>
        <div className="flex flex-1 items-center gap-1" aria-hidden="true">
          {questions.map((q, i) => (
            <span
              key={q.id}
              className={`h-[3px] flex-1 transition-colors duration-300 ease-out ${
                i < index || (i === index && isCorrect)
                  ? "bg-brand"
                  : i === index
                    ? "bg-mute"
                    : "bg-line"
              }`}
            />
          ))}
        </div>
        <span className="tag shrink-0">{xp} XP</span>
      </div>

      <div className="px-5 py-6 sm:px-6">
        <p className="text-[1.125rem] leading-snug font-semibold text-ink">{question.prompt}</p>

        <div className="mt-6 flex flex-col gap-2.5" role="group" aria-label="Answer options">
          {question.options.map((option, i) => {
            const isChosen = selected === option.id;
            const state = isChosen ? (isCorrect ? "correct" : "incorrect") : "idle";

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => selectOption(option.id)}
                disabled={isCorrect}
                aria-pressed={isChosen}
                className={`option-row flex cursor-pointer items-start gap-4 rounded-[3px] border px-4 py-3.5 text-left text-[1rem] leading-relaxed disabled:cursor-default ${
                  state === "correct"
                    ? "border-ok bg-ok-soft text-ink"
                    : state === "incorrect"
                      ? "animate-flash border-bad bg-bad-soft text-ink"
                      : "border-line-strong text-body hover:border-faint hover:bg-wash hover:text-ink"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mono mt-px w-4 shrink-0 text-[0.875rem] ${
                    state === "correct" ? "text-ok" : state === "incorrect" ? "text-bad" : "text-faint"
                  }`}
                >
                  {state === "correct" ? <CheckIcon size={15} /> : LETTERS[i]}
                </span>
                <span className="min-w-0 flex-1">{option.text}</span>
              </button>
            );
          })}
        </div>

        {selected && (
          <div
            role="status"
            className={`animate-settle mt-6 border-l-2 py-1 pl-5 ${
              isCorrect ? "border-ok" : "border-bad"
            }`}
          >
            <p className="text-[0.9375rem] font-semibold text-ink">
              {isCorrect ? "Correct" : "Not quite"}
            </p>
            <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-body">
              {isCorrect ? question.explanation : "That isn't the strongest answer — try another option."}
            </p>
          </div>
        )}

        {isCorrect && (
          <button type="button" className="btn btn-primary mt-7" onClick={next}>
            {isLast ? "Finish module quiz" : "Next question"}
            <ArrowRightIcon size={17} />
          </button>
        )}
      </div>
    </div>
  );
}
