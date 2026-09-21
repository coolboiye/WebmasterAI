"use client";

import { useLocalStorageState } from "@/lib/use-local-storage";
import { Field } from "@/components/ui/Field";
import { Reveal } from "@/components/ui/Reveal";
import { AlertIcon, CheckIcon, PlusIcon, PrinterIcon, ShieldIcon, TrashIcon } from "@/components/ui/Icons";

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
    <div className="shell band">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <Reveal>
          <header className="flex flex-col gap-4">
            <span className="eyebrow">
              <ShieldIcon size={13} />
              Go / no-go
            </span>
            <h1>Student copyright checklist</h1>
            <p className="measure text-[0.9375rem] leading-relaxed text-mute">
              Log every non-original asset on this site — every image, font, music clip, video, or block of
              text you didn&rsquo;t create yourself — before you submit.
            </p>
          </header>
        </Reveal>

        <Reveal delay={80}>
          <p className="measure text-[0.875rem] leading-relaxed text-mute">
            For each asset you need to know three things: who created it, whether it&rsquo;s copyrighted, and
            whether you have the right to use it — through permission, a royalty-free license, or because you
            made it yourself. If you can&rsquo;t answer all three for something on your site, resolve it
            before submitting, not after.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn btn-secondary no-print"
              onClick={() => setRows((prev) => [...prev, EMPTY_ROW()])}
            >
              <PlusIcon size={15} />
              Add asset
            </button>
            <button type="button" className="btn btn-ghost no-print" onClick={() => window.print()}>
              <PrinterIcon size={15} />
              Print / save as PDF
            </button>

            {hydrated && rows.length > 0 && (
              <span className={`chip ${unresolved > 0 ? "tag-bad" : "tag-brand"}`}>
                {unresolved > 0 ? <AlertIcon size={11} /> : <CheckIcon size={11} />}
                {unresolved > 0 ? `${unresolved} unresolved` : "all resolved"}
              </span>
            )}
          </div>
        </Reveal>

        {hydrated && rows.length === 0 ? (
          <Reveal delay={160}>
            <div className="surface surface flex flex-col items-center gap-4 px-6 py-14 text-center">
              <span className="grid size-12 place-items-center rounded-2xl border border-line-strong bg-raised text-brand-strong">
                <ShieldIcon size={22} />
              </span>
              <div>
                <h2 className="text-base">No assets logged yet</h2>
                <p className="mx-auto mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-mute">
                  Add the first entry for anything on this site you didn&rsquo;t create yourself — including
                  AI-generated images, icons, fonts, and code.
                </p>
              </div>
              <button type="button" className="btn btn-primary btn-sm no-print" onClick={() => setRows([EMPTY_ROW()])}>
                <PlusIcon size={15} />
                Add the first asset
              </button>
            </div>
          </Reveal>
        ) : (
          <ul className="flex flex-col gap-4">
            {rows.map((row, index) => (
              <li
                key={row.id}
                className={`surface p-5 transition-colors duration-300 ${
                  row.status === "Not yet resolved" ? "border-warn/35" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.75rem] tracking-[0.14em] text-faint uppercase">
                    Asset {String(index + 1).padStart(2, "0")}
                  </span>
                  {row.status === "Not yet resolved" && (
                    <span className="chip tag-bad">
                      <AlertIcon size={11} />
                      unresolved
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="btn btn-ghost btn-sm no-print ml-auto"
                    aria-label={`Remove asset ${index + 1}`}
                  >
                    <TrashIcon size={14} />
                    Remove
                  </button>
                </div>

                <div className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Asset">
                    <input
                      type="text"
                      className="field"
                      value={row.asset}
                      placeholder="e.g. Header illustration"
                      onChange={(e) => updateRow(row.id, { asset: e.target.value })}
                    />
                  </Field>
                  <Field label="Type">
                    <select
                      className="field"
                      value={row.type}
                      onChange={(e) => updateRow(row.id, { type: e.target.value })}
                    >
                      {TYPE_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Source / creator">
                    <input
                      type="text"
                      className="field"
                      value={row.source}
                      placeholder="Name or site"
                      onChange={(e) => updateRow(row.id, { source: e.target.value })}
                    />
                  </Field>
                  <Field label="Status">
                    <select
                      className="field"
                      value={row.status}
                      onChange={(e) => updateRow(row.id, { status: e.target.value })}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Citation / license link" className="sm:col-span-2">
                    <input
                      type="text"
                      className="field"
                      value={row.citation}
                      placeholder="Link or license name"
                      onChange={(e) => updateRow(row.id, { citation: e.target.value })}
                    />
                  </Field>
                </div>
              </li>
            ))}
          </ul>
        )}

        {hydrated && rows.length > 0 && (
          <p className="text-[0.875rem] text-faint">
            {unresolved > 0
              ? `${unresolved} asset${unresolved === 1 ? "" : "s"} still marked “Not yet resolved.”`
              : "All logged assets are resolved."}
          </p>
        )}

        <Reveal delay={160}>
          <section className="surface surface flex flex-col gap-5 p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg border border-line-strong bg-raised text-brand-strong">
                <CheckIcon size={16} />
              </span>
              <h2 className="text-base">Advisor review</h2>
            </div>

            <Field label="Chapter advisor name" className="max-w-xs">
              <input
                type="text"
                className="field"
                value={advisorName}
                onChange={(e) => setAdvisorName(e.target.value)}
              />
            </Field>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line-strong bg-surface/40 p-4 transition-colors duration-200 hover:border-line-strong">
              <input
                type="checkbox"
                checked={reviewed}
                onChange={(e) => setReviewed(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 accent-brand-strong"
              />
              <span className="text-[0.9375rem] leading-relaxed text-mute">
                My chapter advisor has reviewed this checklist and confirms every asset above is properly
                licensed, permitted, or original.
              </span>
            </label>

            {reviewed && advisorName.trim() && (
              <p className="animate-rise font-mono text-[0.8125rem] text-brand-soft">
                Reviewed by {advisorName.trim()}
              </p>
            )}
          </section>
        </Reveal>

        <p className="text-[0.875rem] leading-relaxed text-faint">
          This page is a working template. Before submitting, confirm it matches the current National TSA
          Student Copyright Checklist for your conference year, since requirements can be updated between
          competitive events guides.
        </p>
      </div>
    </div>
  );
}
