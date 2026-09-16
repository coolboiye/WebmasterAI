import Link from "next/link";
import { MODULES, MODULE_ORDER, ModuleId } from "@/lib/progress-data";

export function ModuleNav({ current }: { current: ModuleId }) {
  const index = MODULE_ORDER.indexOf(current);
  const prevId = index > 0 ? MODULE_ORDER[index - 1] : null;
  const nextId = index < MODULE_ORDER.length - 1 ? MODULE_ORDER[index + 1] : null;

  return (
    <nav
      aria-label="Module navigation"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "var(--space-4)",
        paddingTop: "var(--space-8)",
        borderTop: "1px solid var(--border)",
      }}
    >
      {prevId ? (
        <Link href={MODULES[prevId].path} className="btn btn-secondary">
          &larr; {MODULES[prevId].title}
        </Link>
      ) : (
        <Link href="/" className="btn btn-secondary">
          &larr; Home
        </Link>
      )}

      {nextId ? (
        <Link href={MODULES[nextId].path} className="btn btn-primary">
          {MODULES[nextId].title} &rarr;
        </Link>
      ) : (
        <Link href="/progress" className="btn btn-primary">
          View your progress &rarr;
        </Link>
      )}
    </nav>
  );
}