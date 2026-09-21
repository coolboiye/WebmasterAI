import Link from "next/link";
import { ModuleList, NextStepLink, ProgressPanel } from "@/components/ProgressWidgets";
import { ArrowRightIcon, TerminalIcon } from "@/components/ui/Icons";
import { ACTIVITIES, BADGES, TOTAL_XP } from "@/lib/progress-data";

const VALUE_PROPS = [
  {
    stat: String(Object.keys(ACTIVITIES).length),
    label: "Activities",
    text: "Short quizzes, useful terms, a prompt lab, and four real-world judgment calls.",
  },
  {
    stat: `${TOTAL_XP}`,
    label: "XP available",
    text: "Keep track of what you finish here, or sign in later to carry it with you.",
  },
  {
    stat: "1",
    label: "Live model",
    text: "Try a prompt, compare the result, and see how a small rewrite can change the answer.",
  },
];

const OUTCOMES = [
  "Explain, in your own words, why a chatbot can sound confident and still be wrong.",
  "Tell the difference between training and inference, and why an AI's knowledge has a cutoff date.",
  "Rewrite a vague prompt so it names an audience, a format, and a goal.",
  "Check AI output against a real source before it lands in graded work.",
  "Spot where bias enters a model, and what that means for the people affected.",
  "Know what not to put into a free AI tool, and why.",
];

export default function HomePage() {
  return (
    <>
      {/* ------------------------------------------------------------- hero */}
      <section className="band pt-16 pb-8 sm:pt-24 sm:pb-12">
        <div className="shell">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="animate-rise lg:col-span-7">
              <h1 className="max-w-[15ch]">
                Learn what AI is. Then decide how to use it.
              </h1>

              <p className="measure mt-7 text-[1.125rem] leading-relaxed text-body">
                A practical guide to the tools you already see everywhere — how they work, where they help, and when to pause before trusting the answer.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href="/modules/fundamentals" className="btn btn-primary">
                  Start with Concepts
                  <ArrowRightIcon size={17} />
                </Link>
                <Link
                  href="/modules/tools"
                  className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-mute transition-colors duration-150 hover:text-ink"
                >
                  <TerminalIcon size={16} />
                  Or jump to the live playground
                </Link>
              </div>
            </div>

            <div className="animate-pop lg:col-span-5">
              <ProgressPanel />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- value prop strip */}
      <section className="section-rule border-line">
        <div className="shell">
          <dl className="grid gap-y-0 sm:grid-cols-3">
            {VALUE_PROPS.map((prop) => (
              <div
                key={prop.label}
                className="flex min-h-36 flex-col items-center justify-center border-b border-line px-5 py-8 text-center last:border-b-0 sm:min-h-40 sm:border-b-0 sm:border-l sm:px-8 sm:py-7 sm:first:border-l-0"
              >
                <dd className="mono text-[2rem] font-bold leading-none text-ink">{prop.stat}</dd>
                <dt className="mt-3 text-[1rem] font-semibold text-ink">{prop.label}</dt>
                <p className="mt-2 max-w-[28ch] text-[0.9375rem] leading-relaxed text-body">{prop.text}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------------------------------------------------- modules */}
      <section className="band pt-8 pb-12 sm:pt-12 sm:pb-16" id="modules">
        <div className="shell">
          <div className="marker">
            <span className="marker-num">01</span>
            <div className="flex-1">
              <h2>Start here, then build from there</h2>
              <p className="measure mt-3 text-[1rem] leading-relaxed text-mute">
                Begin with the basics, try a few useful techniques, then work through the tricky choices that come with using AI.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <ModuleList />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ proof */}
      <section className="band pt-12 pb-12 sm:pt-16 sm:pb-16">
        <div className="shell">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="marker">
                <span className="marker-num">02</span>
                <h2 className="flex-1">What you&apos;ll take away</h2>
              </div>
              <p className="measure mt-7 text-[1rem] leading-relaxed text-mute">
                You already use AI to search, write, and study. These lessons give you a clearer sense of what is happening, help you catch mistakes, and keep the important decisions in your hands.
              </p>
            </div>

            <div className="lg:col-span-7">
              <ul className="border-t border-line pt-1">
                {OUTCOMES.map((outcome) => (
                  <li
                    key={outcome}
                    className="border-b border-line py-4 text-[1rem] leading-relaxed text-body"
                  >
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- cta */}
      <section className="band pt-12 pb-12 sm:pt-16 sm:pb-16">
        <div className="shell">
          <div className="marker items-center">
            <span className="marker-num">03</span>
            <div className="flex-1 border-l border-line pl-8">
              <h2 className="max-w-[24ch]">Start at your own pace.</h2>
              <p className="measure mt-4 text-[1rem] leading-relaxed text-mute">
                The first module takes about fifteen minutes. You can begin without an account and come back for the rest whenever you are ready.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href="/modules/fundamentals" className="btn btn-primary">
                  Begin module 1
                  <ArrowRightIcon size={17} />
                </Link>
                <NextStepLink href="/progress">
                  See your progress dashboard (4 badges)
                </NextStepLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- footnote */}
      <section className="section-rule border-line">
        <div className="shell flex min-h-32 items-center justify-center py-10 sm:min-h-40 sm:py-12">
          <p className="text-center text-[1.125rem] font-semibold leading-relaxed text-ink sm:text-[1.25rem]">
            {Object.keys(ACTIVITIES).length} activities <span className="px-2 text-brand" aria-hidden="true">·</span> {TOTAL_XP} XP <span className="px-2 text-brand" aria-hidden="true">·</span> {Object.keys(BADGES).length} badges <span className="px-2 text-brand" aria-hidden="true">·</span> three modules
          </p>
        </div>
      </section>
    </>
  );
}
