"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AuthButton } from "@/components/AuthButton";
import { BrandMark } from "@/components/ui/BrandMark";
import { useProgress } from "@/lib/progress-context";
import { MenuIcon, CloseIcon, MoonIcon, SunIcon } from "@/components/ui/Icons";

const LINKS = [
  { href: "/modules/fundamentals", label: "Concepts" },
  { href: "/modules/tools", label: "Tools" },
  { href: "/modules/ethics", label: "Ethics" },
  { href: "/progress", label: "Progress" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/copyright", label: "Copyright" },
  { href: "/worklog", label: "Work log" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavBar() {
  const pathname = usePathname();
  const { xp, totalXp, hydrated } = useProgress();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === "light" || current === "dark") setTheme(current);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    window.localStorage.setItem("ai-portal-theme", next);
    setTheme(next);
  }

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While open: lock scrolling, allow Escape, and move focus into the panel so
  // keyboard users aren't stranded behind it.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      toggleRef.current?.focus();
    };
  }, [open]);

  return (
    <header className="site-header no-print sticky top-0 z-50 border-b border-line bg-canvas">
      <div className="shell relative flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="AI Learning Portal — home">
          <BrandMark />
          <span className="leading-none text-[1rem] font-semibold tracking-[-0.02em] text-ink">
            AI Learning Portal
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:absolute lg:left-1/2 lg:block lg:-translate-x-1/2">
          <ul className="flex items-center">
            {LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex h-20 items-center px-3 text-[1rem] leading-none transition-colors duration-150 ${
                      active ? "font-semibold text-ink" : "text-mute hover:text-ink"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute inset-x-3 bottom-0 h-[3px] bg-brand" aria-hidden="true" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/progress"
            className="mono hidden text-[0.8125rem] text-mute transition-colors duration-150 hover:text-ink xl:inline"
            title={`${hydrated ? xp : 0} of ${totalXp} XP earned`}
          >
            <span className="text-ink">{hydrated ? xp : 0}</span>
            <span className="text-faint">/{totalXp} XP</span>
          </Link>

          <div className="hidden sm:block">
            <AuthButton compact />
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="theme-toggle grid size-10 cursor-pointer place-items-center rounded-[3px] border border-line-strong text-ink transition-colors duration-150 hover:border-brand hover:bg-surface"
          >
            <span className="theme-toggle-icon" aria-hidden="true">
              {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </span>
          </button>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            className="grid size-10 cursor-pointer place-items-center rounded-[3px] border border-line-strong text-ink transition-colors duration-150 hover:border-faint hover:bg-surface lg:hidden"
          >
            {open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {/* Kept mounted so the transition can play, but `inert` removes it from
          the tab order and the accessibility tree when closed. */}
      <div
        id="mobile-nav"
        inert={!open}
        aria-hidden={!open}
        className={`fixed inset-x-0 top-20 bottom-0 z-40 border-b border-line bg-canvas transition-opacity duration-150 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav aria-label="Primary mobile" className="shell h-full overflow-y-auto py-2">
          <ul>
            {LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href} className="border-b border-line last:border-b-0">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between gap-4 py-3.5 text-[1.0625rem] transition-colors duration-150 ${
                      active ? "font-semibold text-brand" : "text-ink hover:text-brand"
                    }`}
                  >
                    {link.label}
                    {active && <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-col gap-4 sm:hidden">
            <AuthButton />
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle mt-6 flex w-full items-center justify-center gap-2 border-t border-line pt-5 text-[0.875rem] font-medium text-ink sm:hidden"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="theme-toggle-icon" aria-hidden="true">
              {theme === "dark" ? <SunIcon size={17} /> : <MoonIcon size={17} />}
            </span>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>

          <p className="mono mt-6 border-t border-line pt-5 text-[0.8125rem] text-mute">
            <span className="text-ink">{hydrated ? xp : 0}</span>
            <span className="text-faint">/{totalXp} XP earned</span>
          </p>
        </nav>
      </div>
    </header>
  );
}
