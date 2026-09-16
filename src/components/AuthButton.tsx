"use client";

import { useAuth } from "@/lib/auth-context";

export function AuthButton() {
  const { user, profile, authReady, supabaseConfigured, signInWithGoogle, signOut } = useAuth();

  if (!supabaseConfigured) {
    // No Supabase project wired up yet — the site still works fully in
    // local-only mode, so we just stay quiet instead of showing a broken button.
    return null;
  }

  if (!authReady) {
    return <span className="text-secondary" style={{ fontSize: "0.8125rem" }} />;
  }

  if (user) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <span className="text-secondary mono" style={{ fontSize: "0.8125rem" }} title={profile?.displayName}>
          {profile?.displayName}
        </span>
        <button className="btn btn-secondary" style={{ padding: "var(--space-2) var(--space-3)" }} onClick={signOut}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      className="btn btn-primary"
      style={{ padding: "var(--space-2) var(--space-3)" }}
      onClick={signInWithGoogle}
    >
      Sign in with Google
    </button>
  );
}
