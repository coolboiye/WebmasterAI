"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuth } from "@/lib/auth-context";

function LoginContent() {
  const { user, profile, supabaseConfigured, signInWithGoogle } = useAuth();
  const error = useSearchParams().get("error");

  return (
    <div className="page section">
      <div className="prose stack" style={{ gap: "var(--space-6)" }}>
        <h1>Sign in</h1>

        {!supabaseConfigured && (
          <p className="feedback">
            No Supabase project is connected yet, so sign-in isn&rsquo;t available — the site still
            works fully without it, tracking progress locally in this browser instead. See the README
            for setup steps.
          </p>
        )}

        {error && (
          <p className="feedback" style={{ borderColor: "#b3261e" }}>
            Something went wrong signing you in. Try again, or check with your mentor that Google
            sign-in is configured correctly in Supabase.
          </p>
        )}

        {supabaseConfigured && user && (
          <p>
            You&rsquo;re signed in as <strong>{profile?.displayName}</strong>. Head to your{" "}
            <a href="/progress">progress page</a>.
          </p>
        )}

        {supabaseConfigured && !user && (
          <button className="btn btn-primary" style={{ alignSelf: "flex-start" }} onClick={signInWithGoogle}>
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
