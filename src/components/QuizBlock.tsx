"use client";

import { useState } from "react";
import { ACTIVITIES, ActivityId } from "@/lib/progress-data";
import { useProgress } from "@/lib/progress-context";

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
};

export function QuizBlock({ activityId, questions }: { activityId: ActivityId; questions: QuizQuestion[] }) {
  const { completeActivity, isActivityComplete, hydrated } = useProgress();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState(false);

  const alreadyDone = hydrated && isActivityComplete(activityId) && !reviewing;
  const question = questions[index];
  const isLast = index === questions.length - 1;
  const isCorrect = selected === question?.correctId;

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
      <div className="stack" style={{ gap: "var(--space-3)" }}>
        <p>
          <strong>Completed</strong> — {ACTIVITIES[activityId].xp} XP earned.
        </p>
        <button
          className="btn btn-secondary"
          style={{ alignSelf: "flex-start" }}
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
    <div className="stack" style={{ gap: "var(--space-4)" }}>
      <p className="text-secondary" style={{ fontSize: "0.875rem" }}>
        Question {index + 1} of {questions.length}
      </p>
      <p style={{ fontWeight: 500, fontSize: "1.0625rem" }}>{question.prompt}</p>
      <div className="stack" style={{ gap: "var(--space-2)" }}>
        {question.options.map((option) => {
          let state: "correct" | "incorrect" | undefined;
          if (selected === option.id) {
            state = isCorrect ? "correct" : "incorrect";
          }
          return (
            <button
              key={option.id}
              className="quiz-option"
              data-state={state}
              disabled={isCorrect}
              onClick={() => selectOption(option.id)}
              aria-pressed={selected === option.id}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {selected && (
        <p className="feedback">{isCorrect ? question.explanation : "Not quite — try another option."}</p>
      )}

      {isCorrect && (
        <button className="btn btn-primary" style={{ alignSelf: "flex-start" }} onClick={next}>
          {isLast ? "Finish" : "Next question"}
        </button>
      )}
    </div>
  );
}
