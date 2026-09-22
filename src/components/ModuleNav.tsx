import Link from "next/link";
import { MODULES, MODULE_ORDER, ModuleId } from "@/lib/progress-data";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/Icons";

const SHORT: Record<ModuleId, string> = {
  fundamentals: "Concepts",
  tools: "Tools",
  ethics: "Ethics",
};

export function ModuleNav({ current }: { current: ModuleId }) {
  const index = MODULE_ORDER.indexOf(current);
  const prevId = index > 0 ? MODULE_ORDER[index - 1]! : null;
  const nextId = index < MODULE_ORDER.length - 1 ? MODULE_ORDER[index + 1]! : null;

  return (
    <nav
      aria-label="Module navigation"
      className="module-nav grid gap-5 border-t border-line pt-8 sm:grid-cols-[1fr_auto_1fr] sm:items-center"
    >
      <div className="sm:justify-self-start">
        {prevId ? (
          <Link href={MODULES[prevId].path} className="btn btn-secondary module-nav-button" rel="prev">
            <ArrowLeftIcon size={16} />
            <span className="truncate">{SHORT[prevId]}</span>
          </Link>
        ) : (
          <Link href="/" className="btn btn-secondary module-nav-button" rel="prev">
            <ArrowLeftIcon size={16} />
            Home
          </Link>
        )}
      </div>

      <p className="mono order-last text-center text-[0.8125rem] text-faint sm:order-none">
        <span className="text-brand-ink">{String(index + 1).padStart(2, "0")}</span> / 03
      </p>

      <div className="sm:justify-self-end">
        {nextId ? (
          <Link href={MODULES[nextId].path} className="btn btn-primary module-nav-button" rel="next">
            <span className="truncate">Next: {SHORT[nextId]}</span>
            <ArrowRightIcon size={16} className="btn-arrow" />
          </Link>
        ) : (
          <Link href="/progress" className="btn btn-primary module-nav-button">
            View your progress
            <ArrowRightIcon size={16} className="btn-arrow" />
          </Link>
        )}
      </div>
    </nav>
  );
}
