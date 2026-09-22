"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuth } from "@/lib/auth-context";
import { BrandMark } from "@/components/ui/BrandMark";
import { AlertIcon, CheckIcon, GoogleIcon, ShieldIcon } from "@/components/ui/Icons";

function LoginContent() {
  const { user, profile, supabaseConfigured, signInWithGoogle } = useAuth();
  const error = useSearchParams().get("error");

  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="surface animate-rise p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <BrandMark />
            <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-faint uppercase">
              AI Learning Portal
            </span>
          </div>

          <h1 className="mt-7 text-[1.75rem]">Sign in</h1>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-mute">
            Signing in saves your XP to your Google account, carries it across devices, and puts you on the
            class leaderboard. Nothing here is required to use the portal.
          </p>

          {!supabaseConfigured && (
            <div className="mt-6 flex gap-3 rounded-xl border-l-2 border-warn bg-warn/5 py-3.5 pr-3 pl-4">
              <AlertIcon size={17} className="mt-px shrink-0 text-warn" />
              <p className="text-[0.875rem] leading-relaxed text-mute">
                No Supabase project is connected, so sign-in isn&rsquo;t available yet. The site still works
                fully without it, tracking progress locally in this browser. See the README for setup steps.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 flex gap-3 rounded-xl border-l-2 border-bad bg-bad-soft/60 py-3.5 pr-3 pl-4">
              <AlertIcon size={17} className="mt-px shrink-0 text-bad" />
              <p className="text-[0.875rem] leading-relaxed text-mute">
                Something went wrong signing you in. Try again, or check with your mentor that Google
                sign-in is configured correctly in Supabase.
              </p>
            </div>
          )}

          {supabaseConfigured && user ? (
            <div className="mt-7 flex items-center gap-3 rounded-xl border border-brand/30 bg-brand/5 px-4 py-3.5">
              <CheckIcon size={17} className="shrink-0 text-brand-strong" />
              <p className="min-w-0 text-[0.9375rem] text-mute">
                Signed in as <strong className="text-ink">{profile?.displayName}</strong>
              </p>
            </div>
          ) : (
            supabaseConfigured && (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="btn btn-primary mt-7 w-full"
              >
                <GoogleIcon size={17} />
                Continue with Google
              </button>
            )
          )}

          {supabaseConfigured && user && (
            <Link href="/progress" className="btn btn-primary mt-6 w-full">
              Go to your progress
            </Link>
          )}

          <div className="mt-7 flex items-start gap-3 border-t border-line pt-5">
            <ShieldIcon size={15} className="mt-0.5 shrink-0 text-faint" />
            <p className="text-[0.875rem] leading-relaxed text-faint">
              Only your display name, avatar, and XP totals are stored. Your prompts and answers never leave
              this browser.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-[0.875rem] text-faint">
          <Link href="/modules/fundamentals" className="transition-colors duration-200 hover:text-brand-soft">
            Continue without an account
          </Link>
        </p>
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
