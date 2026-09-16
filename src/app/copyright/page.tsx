"use client";

import { useLocalStorageState } from "@/lib/use-local-storage";

type Row = {
  id: string;
  asset: string;
  type: string;
  source: string;
  status: string;
  citation: string;
};

const EMPTY_ROW = (): Row => ({
  id: crypto.randomUUID(),
  asset: "",
  type: "Image",
  source: "",
  status: "Original / self-created",
  citation: "",
});

const STATUS_OPTIONS = [
  "Original / self-created",
  "Royalty-free / licensed for reuse",
  "Permission obtained from creator",
  "Not yet resolved",
];

const TYPE_OPTIONS = ["Image", "Text / research", "Music / audio", "Video", "Icon / font", "Code"];

export default function CopyrightPage() {
  const [rows, setRows, hydrated] = useLocalStorageState<Row[]>("ai-portal-copyright-rows", []);
  const [advisorName, setAdvisorName] = useLocalStorageState<string>("ai-portal-copyright-advisor", "");
  const [reviewed, setReviewed] = useLocalStorageState<boolean>("ai-portal-copyright-reviewed", false);

  const unresolved = rows.filter((r) => r.status === "Not yet resolved").length;

  function updateRow(id: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="page section">
      <div className="stack" style={{ gap: "var(--space-8)", maxWidth: "56rem" }}>
        <div className="stack prose" style={{ gap: "var(--space-3)" }}>
          <h1>Student Copyright Checklist</h1>
          <p className="text-secondary" style={{ fontSize: "1.0625rem" }}>
            Log every non-original asset on this site — every image, font, music clip, video, or
            block of text you didn't create yourself — before you submit.
          </p>
        </div>

        <div className="prose stack" style={{ gap: "var(--space-3)" }}>
          <p>
            For each asset, you need to know three things: who created it, whether it's copyrighted, and
            whether you have the right to use it — through permission, a royalty-free license, or because
            you made it yourself. If you can't answer all three for something on your site, resolve it
            before submitting, not after.
          </p>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th style={{ minWidth: "10rem" }}>Asset</th>
                <th style={{ minWidth: "8rem" }}>Type</th>
                <th style={{ minWidth: "10rem" }}>Source / creator</th>
                <th style={{ minWidth: "12rem" }}>Status</th>
                <th style={{ minWidth: "10rem" }}>Citation / license link</th>
                <th className="no-print"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="text"
                      value={row.asset}
                      placeholder="e.g. Header illustration"
                      onChange={(e) => updateRow(row.id, { asset: e.target.value })}
                    />
                  </td>
                  <td>
                    <select
                      value={row.type}
                      onChange={(e) => updateRow(row.id, { type: e.target.value })}
                      style={{ width: "100%", padding: "var(--space-2)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}
                    >
                      {TYPE_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.source}
                      placeholder="Name or site"
                      onChange={(e) => updateRow(row.id, { source: e.target.value })}
                    />
                  </td>
                  <td>
                    <select
                      value={row.status}
                      onChange={(e) => updateRow(row.id, { status: e.target.value })}
                      style={{ width: "100%", padding: "var(--space-2)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.citation}
                      placeholder="Link or license name"
                      onChange={(e) => updateRow(row.id, { citation: e.target.value })}
                    />
                  </td>
                  <td className="no-print">
                    <button className="btn btn-secondary" onClick={() => removeRow(row.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="no-print" style={{ display: "flex", gap: "var(--space-3)" }}>
          <button className="btn btn-secondary" onClick={() => setRows((prev) => [...prev, EMPTY_ROW()])}>
            Add asset
          </button>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            Print / save as PDF
          </button>
        </div>

        {hydrated && rows.length > 0 && (
          <p className="text-secondary" style={{ fontSize: "0.9375rem" }}>
            {unresolved > 0
              ? `${unresolved} asset${unresolved === 1 ? "" : "s"} still marked "Not yet resolved."`
              : "All logged assets are resolved."}
          </p>
        )}

        <div className="stack" style={{ gap: "var(--space-3)", borderTop: "1px solid var(--border)", paddingTop: "var(--space-6)" }}>
          <h2>Advisor review</h2>
          <label className="stack" style={{ gap: "var(--space-2)", maxWidth: "20rem" }}>
            <span style={{ fontSize: "0.875rem" }}>Chapter advisor name</span>
            <input type="text" value={advisorName} onChange={(e) => setAdvisorName(e.target.value)} />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "0.9375rem" }}>
            <input
              type="checkbox"
              checked={reviewed}
              onChange={(e) => setReviewed(e.target.checked)}
              style={{ width: "auto" }}
            />
            My chapter advisor has reviewed this checklist and confirms every asset above is properly
            licensed, permitted, or original.
          </label>
        </div>

        <p className="text-secondary" style={{ fontSize: "0.8125rem" }}>
          This page is a working template. Before submitting, confirm it matches the current National TSA
          Student Copyright Checklist for your conference year, since requirements can be updated between
          competitive events guides.
        </p>
      </div>
    </div>
  );
}
