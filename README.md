# AI Learning Portal — TSA Webmaster 2026–27

A Next.js site built for the Washington TSA Webmaster event's 2026–27 challenge: an interactive AI
learning portal for high school students, with three content modules, a live AI prompt-practice tool,
and a gamified, cloud-synced progress system.

## What's new in this version

This build adds three things on top of the original static portal:

1. **A live Prompt Playground** (Module 2 → Tools) where students run their own two versions of a
   prompt against a real model — for free, using one [Groq](https://groq.com) API key that you (the
   mentor) set up once for the whole site — and see the actual difference in the response, side by
   side.
2. **Google sign-in**, via Supabase Auth, so a student's progress follows them across devices instead
   of living only in one browser's `localStorage`.
3. **A public leaderboard** (`/leaderboard`) showing every signed-in student's XP — useful for a
   mentor or teacher running a group of students through the portal.

The site still works with **zero setup** for the Supabase side — no Supabase project, no
sign-in button, no leaderboard, just local per-browser progress like before. The Prompt Playground
is the one piece that needs a single one-time setup step from you (adding `GROQ_API_KEY` — see
below); until then it shows a plain "ask your mentor to set this up" message instead of erroring.

## A note on the "must the site be static?" question

Nothing in the national TSA Webmaster event rules restricts entries to static HTML — the guide
explicitly allows **framework systems** ("Drupal, WordPress, Bootstrap, or other current
technologies") and only prohibits **website-builder platforms** (Wix, Weebly, Webs). A Next.js app
with a Supabase backend fits within "framework systems," not the prohibited category. That said:

- **Have your advisor confirm this against the actual current-year guide** before you commit —
  state chapters (Washington TSA, in your case) can modify or reissue rules, and specific wording
  can shift year to year. This README is not a substitute for reading your chapter's copy of the
  guide.
- Whatever you use, the entry needs to be **live and reachable 24/7** at judging time (see
  Deployment below) — a backend that's asleep, unpaid, or misconfigured at demo time will look
  identical to a broken static site to a judge.

## UI system

The interface is **dark-mode only**, built on Tailwind CSS v4 with design tokens defined once in
`src/app/globals.css` under `@theme`. Everything visual reads from those tokens, so a palette or
spacing change is a one-file edit:

- **Surfaces** `--color-ink` / `--color-surface` / `--color-surface-2`
- **Text** `--color-fg` / `--color-body` / `--color-muted` / `--color-subtle`
- **Accent** `--color-emerald` (primary) paired with `--color-azure` for gradients and secondary emphasis
- **Motion** named easings (`--ease-out-expo`, `--ease-spring`) plus `--animate-*` keyframes

Hand-written styles live inside `@layer base` / `@layer components`. That matters: unlayered CSS
outranks every Tailwind utility, so a `.btn` or `.card` written outside a layer could not be
adjusted with utility classes at the call site.

Reusable pieces:

- `src/components/ui/Icons.tsx` — the whole icon set as inline SVG (no emoji, no icon dependency)
- `src/components/ui/Reveal.tsx` — scroll-reveal wrapper; content stays visible if JavaScript is off
- `src/components/ui/Field.tsx`, `BrandMark.tsx` — small shared primitives

### A note on the Groq Prompt Playground

The route in `src/app/api/groq/route.ts` proxies chat completions with a system prompt, calls Groq
with `reasoning_format: "parsed"`, and then runs the reply through `src/lib/groq-safety.ts`. That
module exists because reasoning models (gpt-oss, qwen3, r1 distills) generate an internal thinking
channel that is **not anchored to the prompt's language** — so an English prompt can come back with
reasoning pasted in front of the answer, sometimes in Chinese. The guards are:

1. Ask for `parsed` reasoning so the thinking text lands in `message.reasoning`, not `message.content`.
2. Strip ` thinking…<｜end▁of▁thinking｜>` blocks, `<|channel|>`-style special tokens, and stray reasoning headers.
3. Drop individual lines that are dominated by a non-Latin script — unless the student's own prompt
   is written in that script, in which case nothing is filtered.
4. If the reply is still empty or still in the wrong language, retry once with a much firmer
   instruction, then surface a plain-language error instead of showing the raw reasoning.

## Run it locally

You'll need [Node.js](https://nodejs.org) 18.18 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. The dev server hot-reloads as you edit files. At this point the site
runs fully in local-only mode — everything works except sign-in, cross-device sync, and the
leaderboard.

To check that everything compiles cleanly the way it will when deployed:

```bash
npm run build
npm run start
```

## Setting up Supabase (sign-in + cross-device progress + leaderboard)

This part is optional. Skip it if local-only progress is enough for your entry.

1. Create a free project at [supabase.com](https://supabase.com).
2. In your project, go to **SQL Editor → New query**, paste in the contents of
   [`supabase/schema.sql`](./supabase/schema.sql), and run it. This creates the `profiles` and
   `activity_completions` tables, the trigger that creates a profile on first sign-in, and the
   access policies described in that file's comments — **read those comments**, since this schema
   makes student names and progress public to anyone with your site's URL, which is what a
   classroom leaderboard needs but is worth knowing before you use it for anything else.
3. In **Project Settings → API**, copy the **Project URL** and the **anon / public key**.
4. Copy `.env.local.example` to `.env.local` and paste those two values in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Restart `npm run dev` so it picks up the new env vars.

### Turning on Google sign-in

1. In the [Google Cloud Console](https://console.cloud.google.com/), create (or reuse) a project,
   then go to **APIs & Services → OAuth consent screen** and fill in the basics (app name, your
   school email as support contact). "External" user type is fine for a demo like this.
2. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**, type **Web
   application**.
3. Add an **Authorized redirect URI**. Supabase needs exactly one, in this form:
   `https://<your-project-ref>.supabase.co/auth/v1/callback` (find your project ref in the Supabase
   dashboard URL or Project Settings). Save, then copy the generated **Client ID** and **Client
   secret**.
4. In Supabase: **Authentication → Providers → Google**, toggle it on, and paste in the Client ID
   and secret from step 3.
5. In Supabase: **Authentication → URL Configuration**, set **Site URL** to your deployed URL (and
   add `http://localhost:3000` under **Redirect URLs** too, so sign-in works in local dev).

Once that's done, a "Sign in with Google" button appears in the nav automatically — the app detects
the env vars and turns the feature on.

## Setting up the Prompt Playground (Groq)

Unlike Supabase, this one key is shared by the whole site/class — students don't need their own
account or key.

1. Go to [console.groq.com/keys](https://console.groq.com/keys), sign up (no credit card), and
   create a key.
2. Add it to `.env.local`:
   ```
   GROQ_API_KEY=gsk_...
   ```
3. Restart `npm run dev`. The Playground picks it up automatically — no `NEXT_PUBLIC_` prefix, so
   this key stays server-side and is never sent to the browser or visible in the page source.

**The site guards that shared key itself.** Groq's free tier is per account, not per person, so the
proxy enforces three ceilings before anything reaches Groq (see `src/lib/rate-limit.ts`): per visitor
per minute, whole site per minute, and total Groq calls per day. A comparison run costs two calls,
and the model list is cached for ten minutes so page loads spend nothing at all. Hitting a ceiling
returns a plain-language 429 ("try again in about 20 seconds") rather than a raw error.

Each ceiling is tunable, which is what you reach for during a bigger class or on a paid tier:

| Variable | Default | What it stops |
|---|---|---|
| `GROQ_LIMIT_PER_VISITOR_PER_MINUTE` | `12` | one device (or a stray script) draining the key |
| `GROQ_LIMIT_SITE_PER_MINUTE` | `30` | a whole class arriving at once; sits just under Groq's own limit |
| `GROQ_LIMIT_CALLS_PER_DAY` | `1000` | anything running the key dry overnight |
| `GROQ_LIMIT_MODEL_LOOKUPS_PER_MINUTE` | `20` | reload loops on the model list (cache misses only) |

Counters live in server memory: exact on a single long-lived server (`npm start`), and per-instance —
so fuzzier — on serverless hosts, where a cold start also resets them.

One thing to know if your class shares a network: everyone behind the same NAT address counts as one
visitor, so `GROQ_LIMIT_PER_VISITOR_PER_MINUTE` is a flood stop rather than a per-student budget.
Raise it if a lesson behind one school address trips it.

Two ways to get more headroom if you need it:

- Add a credit card to your Groq account (no charge unless you exceed free limits) to unlock the
  Developer tier, roughly 10x the rate limits, then raise the ceilings above to match.
- Leave the default model (`openai/gpt-oss-20b`, the smallest on the account) selected — the larger
  models have lower free-tier limits.

## Deployment (needs a working URL to submit)

Because this build has API routes (`src/app/api/groq/*`), an auth callback route, and middleware, it
is **no longer a pure static export** — plain static hosts like GitHub Pages **will not work** for
this version. Use a platform that runs Next.js as intended:

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, and import the repository.
3. In the Vercel project's **Settings → Environment Variables**, add `GROQ_API_KEY` (required for
   the Prompt Playground to work when deployed), plus `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` if you're using Supabase.
4. Deploy. You'll get a URL like `your-project.vercel.app` — that's what you submit.
5. Go back to Supabase's **Authentication → URL Configuration** and make sure this final URL is set
   as the **Site URL** (and added to Redirect URLs) — sign-in will silently fail otherwise.

Netlify also supports Next.js API routes and middleware and works as an alternative.

## What's in here, mapped to the rubric

| Rubric criterion | Where it's addressed |
|---|---|
| **Theme** | Every module and the homepage frame the site around the 2026–27 AI theme |
| **Challenge** | Three content modules (`/modules/*`) + gamification (`/progress`) + a live AI tool (Groq Prompt Playground) + accounts/leaderboard (`/leaderboard`) |
| **Content** | Original written explainers, a timeline, vocabulary set, prompt exercises (static and live), and ethics scenarios — no filler text |
| **Layout & Navigation** | Sticky glass top nav (with a full mobile drawer), module cards, sticky per-module progress rail, everything reachable in 1–2 clicks |
| **Graphics & Color Scheme** | Dark, low-glare base with a single emerald→azure accent pair, token-driven spacing/type scale, motion that respects `prefers-reduced-motion` |
| **Function & Compatibility** | Responsive down to mobile, no broken links; see the dynamic-hosting note above instead of a pure static-build claim |
| **Go/No-Go: Copyright Checklist** | `/copyright` — a working asset log + advisor sign-off |
| **Go/No-Go: URL** | Deploy it (see above) before submitting |
| **State entry: Work Log** | `/worklog` — add an entry per work session |

## Before you submit

- **Confirm the dynamic-site question with your advisor** against this year's actual Webmaster
  guide — see the note near the top of this file.
- **Replace the placeholder text**: `[Your Chapter Name]` in the footer (`src/app/layout.tsx`), and
  any team-specific details you want on the homepage (`src/app/page.tsx`).
- **Fill in the work log and copyright checklist** with your team's real entries — both are stored
  in the browser (not shared between devices), so fill them in on the device you'll use to take a
  final screenshot or export, or re-enter them if you switch computers.
- If you're not using Supabase, progress/XP data is stored per-browser (`localStorage`), so it
  resets for each judge who opens the site — that's expected for a judged demo, not a bug. If you
  *are* using Supabase, a judge who signs in with their own Google account will start at 0 XP and
  show up on the public leaderboard — decide ahead of time whether that's what you want during
  judging, or whether you'd rather demo signed out.

## Extending the content

Everything a module needs — its quiz questions, vocabulary terms, or prompt exercises — lives as
plain data at the top of that module's page file:

- `src/app/modules/fundamentals/page.tsx` — quiz questions, vocab terms, timeline
- `src/app/modules/tools/page.tsx` — tool categories, quiz questions
- `src/app/modules/ethics/page.tsx` — quiz questions
- `src/components/ScenarioWalkthrough.tsx` — the ethics "you decide" scenarios
- `src/components/PromptLab.tsx` — the static weak/strong prompt pairs
- `src/components/GroqPlayground.tsx` — the live Groq-backed prompt comparison tool
- `src/lib/progress-data.ts` — XP values, badge requirements, level thresholds

## Architecture notes

- **Local-only fallback everywhere.** `src/lib/supabase/client.ts` and `server.ts` both return `null`
  when the Supabase env vars aren't set, instead of throwing. Every place that uses them
  (`auth-context.tsx`, `progress-context.tsx`, `/leaderboard`) checks for `null` and falls back to
  local behavior. This is why the site never "breaks" for a team that skips the Supabase setup.
- **The Groq key is a server-only secret, shared by the whole site.** It's read from
  `process.env.GROQ_API_KEY` inside `src/app/api/groq/route.ts` and `.../models/route.ts` — both
  Route Handlers that only ever run on the server, so the key is never bundled into client
  JavaScript or visible in the page source. Students never see or enter a key.
- **Why a server route for Groq at all, then?** Even with a server-held key, Groq's chat completions
  endpoint isn't meant to be called directly from a browser — proxying through our own route keeps
  the key server-side and gives us a place to normalize errors (like turning a 429 into a plain
  "the class is going too fast" message) before it reaches the UI.
- **`activity_completions` is append-only** (no delete/update policy) so the leaderboard can't be
  gamed by a student completing then un-completing something, and so "reset progress" for a
  signed-in student only clears the local cache, not their real record.

## A note on dependencies

This project pins `next@15.5.25` and current `@supabase/supabase-js` / `@supabase/ssr` versions as of
when this was put together. Run `npm audit` yourself before you ship if you want the full picture of
any newly disclosed issues.
