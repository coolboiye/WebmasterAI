"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@/lib/progress-context";

type Term = { term: string; definition: string };

export function VocabList({ terms }: { terms: Term[] }) {
  const { completeActivity, isActivityComplete, hydrated } = useProgress();
  const [opened, setOpened] = useState<Record<string, boolean>>({});

  const allOpened = terms.every((t) => opened[t.term]);

  useEffect(() => {
    if (allOpened) completeActivity("fundamentals-vocab");
  }, [allOpened, completeActivity]);

  const done = hydrated && isActivityComplete("fundamentals-vocab");

  return (
    <div className="stack" style={{ gap: "var(--space-3)" }}>
      {terms.map((t) => {
        const isOpen = Boolean(opened[t.term]);
        return (
          <button
            key={t.term}
            className="vocab-term"
            aria-expanded={isOpen}
            onClick={() => setOpened((prev) => ({ ...prev, [t.term]: !prev[t.term] }))}
          >
            <span className="vocab-term-head">
              <span>{t.term}</span>
              <span className="text-secondary mono" style={{ fontSize: "0.8125rem" }}>
                {isOpen ? "hide" : "show"}
              </span>
            </span>
            {isOpen && <p className="vocab-def">{t.definition}</p>}
          </button>
        );
      })}
      <p className="text-secondary" style={{ fontSize: "0.875rem" }}>
        {done ? "Completed — 20 XP earned." : `${Object.keys(opened).length} of ${terms.length} opened`}
      </p>
    </div>
  );
}
