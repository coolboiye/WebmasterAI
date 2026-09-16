import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Google redirects back here with a one-time `code` after the student signs
// in. We trade it for a real session, then send them on to wherever they
// started (or the progress page by default).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/progress";

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
