"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButton } from "@/components/AuthButton";

const LINKS = [
  { href: "/modules/fundamentals", label: "Concepts" },
  { href: "/modules/tools", label: "Tools" },
  { href: "/modules/ethics", label: "Ethics" },
  { href: "/progress", label: "Progress" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/copyright", label: "Copyright" },
  { href: "/worklog", label: "Work log" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="nav no-print">
      <div className="nav-inner">
        <Link href="/" className="nav-brand">
          AI Learning Portal
        </Link>
        <nav>
          <ul className="nav-links">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} data-active={pathname.startsWith(link.href)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <AuthButton />
      </div>
    </header>
  );
}
