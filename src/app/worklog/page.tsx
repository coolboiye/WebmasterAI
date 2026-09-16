"use client";

import { useMemo } from "react";
import { useLocalStorageState } from "@/lib/use-local-storage";

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
  const [entries, setEntries] = useLocalStorageState<Entry[]>("ai-portal-worklog", []);

  const totalHours = useMemo(
    () => entries.reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0),
    [entries]
  );

  function updateEntry(id: string, patch: Partial<Entry>) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="page section">
      <div className="stack" style={{ gap: "var(--space-8)", maxWidth: "56rem" }}>
        <div className="prose stack" style={{ gap: "var(--space-3)" }}>
          <h1>Student Work Log</h1>
          <p className="text-secondary" style={{ fontSize: "1.0625rem" }}>
            A record of who worked on the site, when, and on what — required for the state submission.
          </p>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th style={{ minWidth: "8rem" }}>Date</th>
                <th style={{ minWidth: "8rem" }}>Student</th>
                <th style={{ minWidth: "5rem" }}>Hours</th>
                <th style={{ minWidth: "14rem" }}>Task</th>
                <th className="no-print"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <input
                      type="date"
                      value={entry.date}
                      onChange={(e) => updateEntry(entry.id, { date: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={entry.student}
                      placeholder="Name"
                      onChange={(e) => updateEntry(entry.id, { student: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.25"
                      value={entry.hours}
                      onChange={(e) => updateEntry(entry.id, { hours: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={entry.task}
                      placeholder="What was worked on"
                      onChange={(e) => updateEntry(entry.id, { task: e.target.value })}
                    />
                  </td>
                  <td className="no-print">
                    <button className="btn btn-secondary" onClick={() => removeEntry(entry.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {entries.length > 0 && (
                <tr>
                  <td colSpan={2} />
                  <td className="mono" style={{ fontWeight: 600 }}>{totalHours}</td>
                  <td className="text-secondary">total hours</td>
                  <td className="no-print" />
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="no-print" style={{ display: "flex", gap: "var(--space-3)" }}>
          <button className="btn btn-secondary" onClick={() => setEntries((prev) => [...prev, EMPTY_ENTRY()])}>
            Add entry
          </button>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            Print / save as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
