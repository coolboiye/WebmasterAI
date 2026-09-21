"use client";

import { useMemo } from "react";
import { useLocalStorageState } from "@/lib/use-local-storage";
import { Field } from "@/components/ui/Field";
import { Reveal } from "@/components/ui/Reveal";
import { ClockIcon, ListIcon, PlusIcon, PrinterIcon, TrashIcon } from "@/components/ui/Icons";

type Entry = {
  id: string;
  date: string;
  student: string;
  hours: string;
  task: string;
};

const EMPTY_ENTRY = (): Entry => ({
  id: crypto.randomUUID(),
  date: "",
  student: "",
  hours: "",
  task: "",
});

export default function WorkLogPage() {
  const [entries, setEntries, hydrated] = useLocalStorageState<Entry[]>("ai-portal-worklog", []);

  const totalHours = useMemo(
    () => entries.reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0),
    [entries]
  );

  const contributors = useMemo(
    () => new Set(entries.map((e) => e.student.trim()).filter(Boolean)).size,
    [entries]
  );

  function updateEntry(id: string, patch: Partial<Entry>) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="shell band">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <Reveal>
          <header className="flex flex-col gap-4">
            <span className="eyebrow">
              <ListIcon size={13} />
              State entry requirement
            </span>
            <h1>Student work log</h1>
            <p className="measure text-[0.9375rem] leading-relaxed text-mute">
              A record of who worked on the site, when, and on what — required for the state submission.
            </p>
          </header>
        </Reveal>

        <Reveal delay={80}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="surface p-4">
              <p className="font-mono text-[0.75rem] tracking-[0.14em] text-faint uppercase">Total hours</p>
              <p className="mt-2 font-mono text-xl font-semibold text-ink">
                {hydrated ? totalHours : 0}
              </p>
            </div>
            <div className="surface p-4">
              <p className="font-mono text-[0.75rem] tracking-[0.14em] text-faint uppercase">Sessions</p>
              <p className="mt-2 font-mono text-xl font-semibold text-ink">
                {hydrated ? entries.length : 0}
              </p>
            </div>
            <div className="surface col-span-2 p-4 sm:col-span-1">
              <p className="font-mono text-[0.75rem] tracking-[0.14em] text-faint uppercase">Contributors</p>
              <p className="mt-2 font-mono text-xl font-semibold text-ink">{hydrated ? contributors : 0}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn btn-secondary no-print"
              onClick={() => setEntries((prev) => [...prev, EMPTY_ENTRY()])}
            >
              <PlusIcon size={15} />
              Add entry
            </button>
            <button type="button" className="btn btn-ghost no-print" onClick={() => window.print()}>
              <PrinterIcon size={15} />
              Print / save as PDF
            </button>
          </div>
        </Reveal>

        {hydrated && entries.length === 0 ? (
          <Reveal delay={160}>
            <div className="surface surface flex flex-col items-center gap-4 px-6 py-14 text-center">
              <span className="grid size-12 place-items-center rounded-2xl border border-line-strong bg-raised text-brand-strong">
                <ClockIcon size={22} />
              </span>
              <div>
                <h2 className="text-base">No sessions logged yet</h2>
                <p className="mx-auto mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-mute">
                  Add one entry per work session. Entries are stored in this browser, so fill in the log on
                  the device you&rsquo;ll use for your final export.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm no-print"
                onClick={() => setEntries([EMPTY_ENTRY()])}
              >
                <PlusIcon size={15} />
                Add the first entry
              </button>
            </div>
          </Reveal>
        ) : (
          <ul className="flex flex-col gap-4">
            {entries.map((entry, index) => (
              <li key={entry.id} className="surface p-5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.75rem] tracking-[0.14em] text-faint uppercase">
                    Session {String(index + 1).padStart(2, "0")}
                  </span>
                  {parseFloat(entry.hours) > 0 && (
                    <span className="chip tag-brand">{parseFloat(entry.hours)} h</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    className="btn btn-ghost btn-sm no-print ml-auto"
                    aria-label={`Remove session ${index + 1}`}
                  >
                    <TrashIcon size={14} />
                    Remove
                  </button>
                </div>

                <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
                  <Field label="Date">
                    <input
                      type="date"
                      className="field"
                      value={entry.date}
                      onChange={(e) => updateEntry(entry.id, { date: e.target.value })}
                    />
                  </Field>
                  <Field label="Student">
                    <input
                      type="text"
                      className="field"
                      value={entry.student}
                      placeholder="Name"
                      onChange={(e) => updateEntry(entry.id, { student: e.target.value })}
                    />
                  </Field>
                  <Field label="Hours">
                    <input
                      type="number"
                      min="0"
                      step="0.25"
                      className="field"
                      value={entry.hours}
                      placeholder="0"
                      onChange={(e) => updateEntry(entry.id, { hours: e.target.value })}
                    />
                  </Field>
                  <Field label="Task" className="sm:col-span-3">
                    <input
                      type="text"
                      className="field"
                      value={entry.task}
                      placeholder="What was worked on"
                      onChange={(e) => updateEntry(entry.id, { task: e.target.value })}
                    />
                  </Field>
                </div>
              </li>
            ))}

            {entries.length > 0 && (
              <li className="surface flex items-center justify-between gap-4 border-brand/25 bg-brand/5 p-5">
                <p className="font-mono text-[0.75rem] tracking-[0.14em] text-faint uppercase">Total</p>
                <p className="font-mono text-lg font-semibold text-ink">
                  {totalHours}
                  <span className="ml-1.5 text-[0.8125rem] font-normal text-faint">hours</span>
                </p>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
