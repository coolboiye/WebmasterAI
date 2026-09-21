"use client";

import { useAuth } from "@/lib/auth-context";
import { GoogleIcon, LogOutIcon } from "@/components/ui/Icons";

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "S";
  if (parts.length === 1) return parts[0]!.slice(0, 1).toUpperCase();
  return (parts[0]!.slice(0, 1) + parts[parts.length - 1]!.slice(0, 1)).toUpperCase();
}

export function AuthButton({ compact = false }: { compact?: boolean }) {
  const { user, profile, authReady, supabaseConfigured, signInWithGoogle, signOut } = useAuth();

  // No Supabase project wired up yet — the site still works fully in
  // local-only mode, so we stay quiet instead of showing a broken button.
  if (!supabaseConfigured) return null;

  if (!authReady) {
    return <span aria-hidden="true" className="block h-9 w-24 rounded-[3px] bg-surface" />;
  }

  if (user) {
    const name = profile?.displayName ?? "Student";
    return (
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="mono grid size-9 shrink-0 place-items-center rounded-[3px] border border-line-strong text-[0.8125rem] font-medium text-ink"
        >
          {initialsFor(name)}
        </span>
        {!compact && (
          <span className="hidden max-w-[9rem] truncate text-[0.9375rem] text-mute lg:block" title={name}>
            {name}
          </span>
        )}
        <button
          type="button"
          onClick={signOut}
          className="grid size-9 cursor-pointer place-items-center rounded-[3px] text-mute transition-colors duration-150 hover:bg-surface hover:text-ink"
          aria-label="Sign out"
          title={`Sign out${profile?.displayName ? ` of ${profile.displayName}` : ""}`}
        >
          <LogOutIcon size={17} />
        </button>
      </div>
    );
  }

  return (
    <button type="button" onClick={signInWithGoogle} className="btn btn-secondary btn-sm">
      <GoogleIcon size={15} />
      Sign in
    </button>
  );
}
