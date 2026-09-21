import { QuizBlock } from "@/components/QuizBlock";
import { ScenarioWalkthrough } from "@/components/ScenarioWalkthrough";
import { ModuleNav } from "@/components/ModuleNav";
import { ModuleRail } from "@/components/ModuleRail";
import { Reveal } from "@/components/ui/Reveal";
import { BoltIcon, ScaleIcon } from "@/components/ui/Icons";

const QUIZ = [
  {
    id: "q1",
    prompt: "Why might a facial recognition system perform less accurately on some groups of people than others?",
    options: [
      { id: "a", text: "Its training data didn't include enough diverse examples of those groups" },
      { id: "b", text: "Cameras physically can't photograph certain people" },
      { id: "c", text: "The system was designed to fail on purpose" },
      { id: "d", text: "It only happens with very old software" },
    ],
    correctId: "a",
    explanation:
      "If a model's training data underrepresents certain groups, its accuracy for those groups tends to suffer — a well-documented issue in early facial recognition research.",
  },
  {
    id: "q2",
    prompt: "Many schools now ask students to disclose when and how they used AI on an assignment. Why does this matter?",
    options: [
      { id: "a", text: "So the school can ban AI entirely" },
      { id: "b", text: "It keeps trust in how your work is assessed and helps teachers know what you actually learned" },
      { id: "c", text: "It has no real purpose, it's just a formality" },
      { id: "d", text: "So the AI company can track your usage" },
    ],
    correctId: "b",
    explanation:
      "Disclosure isn't about banning AI — it's about making sure grades still reflect what a student actually understands and did themselves.",
  },
  {
    id: "q3",
    prompt: "What's the safest assumption about something you type into a free AI chatbot?",
    options: [
      { id: "a", text: "It's automatically deleted and never seen by anyone" },
      { id: "b", text: "It's legally private, like a conversation with a doctor" },
      { id: "c", text: "It may be stored or reviewed, so avoid entering private information" },
      { id: "d", text: "It's only visible to you" },
    ],
    correctId: "c",
    explanation:
      "Free AI tools commonly store conversations and may use them to improve future models. Treat anything you type as something that could be seen by someone else.",
  },
  {
    id: "q4",
    prompt: "Which statement about bias in AI systems is accurate?",
    options: [
      { id: "a", text: "It's usually introduced on purpose by developers" },
      { id: "b", text: "It usually comes from patterns already present in the data the model was trained on" },
      { id: "c", text: "It only affects tools that generate images" },
      { id: "d", text: "It stopped being a problem after 2015" },
    ],
    correctId: "b",
    explanation:
      "Bias typically isn't intentional — it's inherited from real-world patterns baked into whatever data the model learned from.",
  },
  {
    id: "q5",
    prompt: "You're not sure whether your teacher allows AI tools for a specific assignment. What should you do?",
    options: [
      { id: "a", text: "Assume it's fine since you've used AI on assignments before" },
      { id: "b", text: "Ask the teacher directly before using one" },
      { id: "c", text: "Use it quietly and don't mention it" },
      { id: "d", text: "Wait and see if it becomes a problem" },
    ],
    correctId: "b",
    explanation:
      "Policies vary by class and even by assignment. A quick question up front avoids an academic integrity issue later.",
  },
  {
    id: "q6",
    prompt: "For this competition specifically, why does it matter where an AI-generated image or line of code came from?",
    options: [
      { id: "a", text: "It doesn't — judges only look at the finished product" },
      { id: "b", text: "Competition rules on AI-generated content vary and change, and a copyright/asset log is often a required part of judging" },
      { id: "c", text: "AI-generated assets are always banned from every competition" },
      { id: "d", text: "Only the graphics matter, not the code" },
    ],
    correctId: "b",
    explanation:
      "Many student competitions, including this one, expect a record of where each asset came from — including whether AI generated it. Checking the current rules and logging your sources protects your whole team.",
  },
  {
    id: "q7",
    prompt: "An AI image generator produces an illustration that looks very close in style to a specific living artist's work. What's the safest assumption?",
    options: [
      { id: "a", text: "It's automatically fine to use, since the AI made something \"new\"" },
      { id: "b", text: "It could raise real copyright and attribution concerns, so it's worth using a different prompt or tool, or getting explicit permission" },
      { id: "c", text: "Style can never be copyrighted, so there's nothing to worry about" },
      { id: "d", text: "It's only a problem if you say which artist inspired it" },
    ],
    correctId: "b",
    explanation:
      "AI image generators are trained on large amounts of existing art, and output that closely mimics a specific, identifiable artist's style sits in genuinely contested legal territory. Treat closeness to a real, identifiable style as a flag to reconsider, not a technicality to ignore.",
  },
  {
    id: "q8",
    prompt: "A classmate says \"AI detectors can always tell if text was AI-written, so it's fine to skip disclosing it as long as it doesn't get flagged.\" What's wrong with this reasoning?",
    options: [
      { id: "a", text: "Nothing — that's a reasonable strategy" },
      { id: "b", text: "AI detectors are unreliable (both missing AI text and falsely flagging human writing), and disclosure policies aren't about avoiding detection in the first place" },
      { id: "c", text: "AI detectors are 100% accurate, so this is actually risky advice" },
      { id: "d", text: "Detection has nothing to do with academic honesty" },
    ],
    correctId: "b",
    explanation:
      "AI-detection tools are known to be unreliable in both directions. But more importantly, the reasoning misses the point of disclosure policies entirely — they exist so your grade reflects your own understanding, not to create a detection game to beat.",
  },
];

export default function EthicsPage() {
  return (
    <div className="shell-reading band">
      <div className="grid gap-12 xl:grid-cols-[minmax(0,38rem)_16rem] xl:justify-between">
      <div className="prose stack min-w-0" style={{ gap: "var(--space-12)" }}>
        <Reveal>
          <header className="flex flex-col gap-4">
            <span className="eyebrow">
              <ScaleIcon size={13} />
              Module 3 of 3
            </span>
            <h1>Ethical AI Usage</h1>
            <p className="text-secondary" style={{ fontSize: "1.0625rem" }}>
              Academic honesty, bias, privacy, and copyright — the judgment calls that come with using AI well.
            </p>
          </header>
        </Reveal>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-faint">01</span>
            <span className="h-px flex-1 bg-line-strong" />
          </div>
          <h2>Academic integrity &amp; AI</h2>
          <p>
            Most schools now expect students to disclose if and how they used AI on an assignment —
            similar to citing a source. This isn't about treating AI as forbidden; it's about making sure
            a grade still reflects what you actually understand and produced yourself. Before using AI on
            graded work, check the assignment instructions or ask your teacher directly, and be specific
            about what you used it for if you do — "used it to check grammar" is very different from "used
            it to write the introduction."
          </p>
        </div>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-faint">02</span>
            <span className="h-px flex-1 bg-line-strong" />
          </div>
          <h2>Bias in the machine</h2>
          <p>
            An AI model learns from the data it's given, and real-world data carries real-world
            imbalances. Early facial recognition systems, for example, were often trained mostly on one
            demographic and performed measurably worse on others. Hiring-screening tools trained on a
            company's past hiring data can end up favoring the same kinds of candidates that were hired
            historically — including any historical bias baked into those decisions. This isn't a bug
            that shows up occasionally; it's a direct consequence of what the model was shown during
            training, which is why the composition of training data matters as much as the model itself.
          </p>
        </div>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-faint">03</span>
            <span className="h-px flex-1 bg-line-strong" />
          </div>
          <h2>Where does your data go?</h2>
          <p>
            Anything you type into a free AI tool can be stored, reviewed by people improving the system,
            or used to train future versions of the model. Treat it like posting in a group chat rather
            than a private diary: don't enter your full name and address, other people's private
            information, passwords, or anything you wouldn't want to see resurface later. Where a tool
            offers a setting to opt out of having your conversations used for training, it's worth knowing
            it exists.
          </p>
        </div>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-faint">04</span>
            <span className="h-px flex-1 bg-line-strong" />
          </div>
          <h2>Copyright and AI-generated content</h2>
          <p>
            This one matters directly for a Webmaster entry: if you use an AI tool to generate any image,
            icon, or block of code that ends up in your submission, that's an asset whose origin a judge
            can reasonably ask about. Two habits keep you covered. First, check the current rules for this
            competition on AI-generated content before you use it for anything that ships in the final
            site — rules in this area change often. Second, log it: this portal's{" "}
            <a href="/copyright">Copyright checklist</a> page exists specifically so your team has a
            running record of what was AI-generated, what tool made it, and what prompt was used, the same
            way you'd cite a stock photo or a code library you didn't write yourself.
          </p>
          <p>
            Watch in particular for AI output that closely mimics one specific, identifiable artist's
            style, or that reproduces a real logo, mascot, or trademarked character — those sit in the
            most legally contested territory and are worth avoiding or getting explicit permission for,
            not just disclosing.
          </p>
        </div>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2>You decide</h2>
            <span className="chip chip-azure">
              <BoltIcon size={11} />
              30 XP
            </span>
          </div>
          <ScenarioWalkthrough />
        </div>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2>Check your understanding</h2>
            <span className="chip chip-azure">
              <BoltIcon size={11} />
              100 XP
            </span>
          </div>
          <QuizBlock activityId="ethics-quiz" questions={QUIZ} />
        </div>

        <ModuleNav current="ethics" />
      </div>

      <aside className="no-print hidden xl:block">
        <div className="sticky top-24">
          <ModuleRail current="ethics" />
        </div>
      </aside>
      </div>
    </div>
  );
}