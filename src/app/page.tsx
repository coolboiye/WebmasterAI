import Link from "next/link";
import { ModuleList, ProgressSummary } from "@/components/ProgressWidgets";

export default function HomePage() {
  return (
    <div>
      <section className="section">
        <div className="page">
          <div className="prose stack" style={{ gap: "var(--space-6)" }}>
            <h1>Understand AI before you rely on it.</h1>
            <p className="text-secondary" style={{ fontSize: "1.125rem" }}>
              Three short modules on how AI works, how to use it well, and how to use it responsibly
              — built for high school students, by high school students.
            </p>
            <div>
              <Link href="/modules/fundamentals" className="btn btn-primary">
                Start with Concepts
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page">
          <div className="prose stack" style={{ gap: "var(--space-6)" }}>
            <h2>Why this exists</h2>
            <p>
              AI tools are already part of how students search, write, and study — often without much
              understanding of what's actually happening behind the interface. This portal exists to close
              that gap: it explains the basic mechanics of how AI systems produce their output, gives you
              hands-on practice with tools you'll actually use, and works through the judgment calls that
              come up when AI is involved in schoolwork. No prior technical background is assumed.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page">
          <div className="stack" style={{ gap: "var(--space-6)" }}>
            <h2>Modules</h2>
            <ModuleList />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page">
          <div className="stack" style={{ gap: "var(--space-6)", maxWidth: "28rem" }}>
            <h2>Your progress</h2>
            <ProgressSummary />
            <Link href="/progress" style={{ fontSize: "0.9375rem", color: "var(--accent)" }}>
              View your progress and badges
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
