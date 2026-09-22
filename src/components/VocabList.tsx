"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@/lib/progress-context";

type Term = { term: string; definition: string };

export function VocabList({ terms }: { terms: Term[] }) {
  const { completeActivity, isActivityComplete, hydrated } = useProgress();
  const [opened, setOpened] = useState<Record<string, boolean>>({});

  const openedCount = terms.filter((t) => opened[t.term]).length;
  const allOpened = openedCount === terms.length;

  useEffect(() => {
    if (allOpened) completeActivity("fundamentals-vocab");
  }, [allOpened, completeActivity]);

  const done = hydrated && isActivityComplete("fundamentals-vocab");

  return (
    <div>
      <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
        <p className="text-[0.875rem] text-mute">
          {done ? "Set complete — 20 XP earned." : `${openedCount} of ${terms.length} opened`}
        </p>
      </div>

      <ul>
        {terms.map((t, index) => {
          const isOpen = Boolean(opened[t.term]);
          return (
            <li key={t.term} className="border-b border-line">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpened((prev) => ({ ...prev, [t.term]: !prev[t.term] }))}
                className="row-hover flex w-full cursor-pointer items-baseline gap-4 py-3.5 text-left"
              >
                <span className="mono w-6 shrink-0 text-[0.8125rem] text-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={`flex-1 text-[1rem] ${isOpen ? "font-semibold text-brand-ink" : "text-ink"}`}>
                  {t.term}
                </span>
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-[0.875rem] text-faint transition-transform duration-300 ease-out ${
                    isOpen ? "rotate-180 text-brand-ink" : ""
                  }`}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>

              {/* 0fr → 1fr keeps the reveal smooth without animating height. */}
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="pb-4 pl-10 text-[0.9375rem] leading-relaxed text-mute">{t.definition}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
