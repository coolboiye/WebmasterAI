import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";

const COLUMNS = [
  {
    heading: "Learn",
    links: [
      { href: "/modules/fundamentals", label: "Fundamental concepts" },
      { href: "/modules/tools", label: "Practical tools" },
      { href: "/modules/ethics", label: "Ethical usage" },
    ],
  },
  {
    heading: "Track",
    links: [
      { href: "/progress", label: "Your progress" },
      { href: "/leaderboard", label: "Leaderboard" },
    ],
  },
  {
    heading: "Submit",
    links: [
      { href: "/copyright", label: "Copyright checklist" },
      { href: "/worklog", label: "Student work log" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer no-print border-t border-line">
      <div className="shell py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5" aria-label="AI Learning Portal — home">
              <BrandMark />
              <span className="text-[0.9375rem] font-semibold tracking-[-0.02em] text-ink">
                AI Learning Portal
              </span>
            </Link>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-mute">
              Three short modules on how AI works, how to use it well, and how to use it responsibly.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="text-[0.9375rem] font-semibold text-ink">{column.heading}</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="link-quiet text-[0.9375rem] text-mute hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.875rem] text-faint">
            Built for the TSA Webmaster event — [Your Chapter Name], 2026–27.
          </p>
          <a
            href="#main"
            className="link-quiet self-start text-[0.875rem] text-faint hover:text-ink sm:self-auto"
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
