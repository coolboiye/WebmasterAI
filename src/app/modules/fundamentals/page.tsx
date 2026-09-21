import { QuizBlock } from "@/components/QuizBlock";
import { VocabList } from "@/components/VocabList";
import { ModuleNav } from "@/components/ModuleNav";
import { ModuleRail } from "@/components/ModuleRail";
import { Reveal } from "@/components/ui/Reveal";
import { BoltIcon, CompassIcon } from "@/components/ui/Icons";

const QUIZ = [
  {
    id: "q1",
    prompt: "What best describes \"narrow AI\" — the kind that exists today?",
    options: [
      { id: "a", text: "AI that can perform any intellectual task a human can" },
      { id: "b", text: "AI designed and trained to perform one specific type of task well" },
      { id: "c", text: "AI that has become self-aware" },
      { id: "d", text: "AI that only runs on smartphones" },
    ],
    correctId: "b",
    explanation:
      "Every AI system in wide use today — chatbots, recommendation engines, image generators — is narrow: it's good at a specific kind of task. Human-level general intelligence across any domain doesn't currently exist.",
  },
  {
    id: "q2",
    prompt: "An AI model's \"training data\" is best described as:",
    options: [
      { id: "a", text: "The exact answers it will give in the future" },
      { id: "b", text: "The examples it learns statistical patterns from before it's used" },
      { id: "c", text: "The hardware the model runs on" },
      { id: "d", text: "A list of banned words the model can't say" },
    ],
    correctId: "b",
    explanation:
      "A model doesn't memorize a lookup table of answers — it learns patterns from huge amounts of example data, then applies those patterns to new inputs it hasn't seen before.",
  },
  {
    id: "q3",
    prompt: "What is an AI \"hallucination\"?",
    options: [
      { id: "a", text: "The AI intentionally lying to the user" },
      { id: "b", text: "Confident, fluent-sounding output that is factually wrong" },
      { id: "c", text: "A visual glitch that appears in an AI-generated image" },
      { id: "d", text: "When the AI refuses to answer a question" },
    ],
    correctId: "b",
    explanation:
      "Hallucination is the term for when a model states something incorrect with the same fluent confidence as something correct. It isn't intentional deception — the model has no way to know it's wrong.",
  },
  {
    id: "q4",
    prompt: "Why can AI systems produce biased or unfair results?",
    options: [
      { id: "a", text: "Because developers program bias into them on purpose" },
      { id: "b", text: "Because they can pick up and repeat patterns present in their training data" },
      { id: "c", text: "Because they run out of computer memory" },
      { id: "d", text: "Because they were built before the year 2020" },
    ],
    correctId: "b",
    explanation:
      "If the data a model learns from reflects real-world imbalances or stereotypes, the model can reproduce those patterns in its output — even without anyone intending it to.",
  },
  {
    id: "q5",
    prompt: "Which best describes a large language model (LLM)?",
    options: [
      { id: "a", text: "A model trained mainly to predict and generate text based on patterns in language" },
      { id: "b", text: "A robot that physically types text" },
      { id: "c", text: "A search engine that only returns fact-checked results" },
      { id: "d", text: "A tool that can only translate between languages" },
    ],
    correctId: "a",
    explanation:
      "LLMs like the ones behind popular chatbots are trained on huge amounts of text to predict likely next words — which is also why they can sound confident even when they're wrong.",
  },
  {
    id: "q6",
    prompt: "What does it mean when people say a chatbot generates text \"one token at a time\"?",
    options: [
      { id: "a", text: "It writes the whole answer instantly, then reveals it letter by letter for effect" },
      { id: "b", text: "It predicts the next small chunk of text, adds it to what it's written so far, and repeats" },
      { id: "c", text: "It looks up the full answer in a spreadsheet of pre-written responses" },
      { id: "d", text: "It only works one word per day due to processing limits" },
    ],
    correctId: "b",
    explanation:
      "A token is roughly a word or word-piece. The model predicts the single most likely next token given everything so far, appends it, and repeats — which is also why it can't truly \"plan ahead\" the way a person drafting an essay might.",
  },
  {
    id: "q7",
    prompt: "Which of these is an example of generative AI, as opposed to a classifier?",
    options: [
      { id: "a", text: "An email app labeling a message as spam or not spam" },
      { id: "b", text: "An app that creates a brand-new paragraph of text from a prompt" },
      { id: "c", text: "A photo app sorting pictures into \"cats\" and \"dogs\" folders" },
      { id: "d", text: "A system flagging a transaction as fraud or not fraud" },
    ],
    correctId: "b",
    explanation:
      "Generative AI creates new content — text, images, audio — that didn't exist before. A classifier instead sorts existing input into predefined categories, like spam/not-spam. Both are common types of AI, but they do different jobs.",
  },
  {
    id: "q8",
    prompt: "Why doesn't a bigger, more expensive AI model automatically mean a more trustworthy one?",
    options: [
      { id: "a", text: "Bigger models are always slower, so people don't use them" },
      { id: "b", text: "Scale can improve fluency and capability, but doesn't remove the risk of bias or hallucination — it can still confidently state wrong information" },
      { id: "c", text: "Bigger models are actually always less accurate" },
      { id: "d", text: "Model size has nothing to do with performance at all" },
    ],
    correctId: "b",
    explanation:
      "A larger model trained on more data is often more capable, but size doesn't fix the underlying issue: it's still predicting plausible-sounding output, not verifying truth. Fact-checking stays your job regardless of which model you use.",
  },
];

const VOCAB = [
  { term: "Algorithm", definition: "A set of step-by-step instructions a computer follows to complete a task or solve a problem." },
  { term: "Dataset", definition: "A collection of examples — text, images, numbers — used to train or test an AI model." },
  { term: "Neural network", definition: "A model structure loosely inspired by the brain, made of layers of connected nodes that adjust as they learn." },
  { term: "Training", definition: "The process of exposing a model to data so it can adjust and learn patterns before it's put to use." },
  { term: "Bias (in AI)", definition: "A tendency for a model's output to unfairly favor or disadvantage certain groups or ideas, usually from patterns in its training data." },
  { term: "Large language model (LLM)", definition: "A model trained on huge amounts of text to predict and generate language, such as the model behind a chatbot." },
  { term: "Hallucination", definition: "Fluent, confident-sounding AI output that is factually incorrect." },
  { term: "Prompt", definition: "The instruction or question a person gives an AI tool to get a response." },
  { term: "Generative AI", definition: "AI that creates new content — text, images, audio, code — rather than just sorting or labeling existing content." },
  { term: "Token", definition: "A small chunk of text, roughly a word or part of a word, that a language model reads and generates one piece at a time." },
  { term: "Parameters", definition: "The internal numerical settings a model adjusts during training; loosely, a rough measure of how much a model can learn and store." },
  { term: "Fine-tuning", definition: "Additional, more focused training applied to an already-trained model to specialize it for a narrower task or style." },
  { term: "Inference", definition: "The process of a trained model actually producing an output for a new input — as opposed to training, when it was learning." },
  { term: "Context window", definition: "The amount of recent text (measured in tokens) a model can \"see\" and consider at once when generating a response." },
];

const TIMELINE = [
  { year: "1950", text: "Alan Turing proposes a test for whether a machine's behavior is indistinguishable from a human's." },
  { year: "1956", text: "The term \"artificial intelligence\" is coined at a research workshop at Dartmouth College." },
  { year: "1997", text: "IBM's Deep Blue defeats world chess champion Garry Kasparov — a landmark for narrow, task-specific AI." },
  { year: "2012", text: "A deep learning model dramatically outperforms rivals at image recognition, kicking off the current era of AI research." },
  { year: "2017", text: "Researchers publish the transformer architecture — the design that today's large language models are still built on." },
  { year: "2022", text: "AI chatbots and AI image generators become widely available to the general public, not just researchers, for the first time." },
  { year: "2020s", text: "Large language models become part of everyday tools — search, writing apps, customer service — putting conversational AI into daily use." },
];

export default function FundamentalsPage() {
  return (
    <div className="shell-reading band">
      <div className="grid gap-12 xl:grid-cols-[minmax(0,38rem)_16rem] xl:justify-between">
      <div className="prose stack min-w-0" style={{ gap: "var(--space-12)" }}>
        <Reveal>
          <header className="flex flex-col gap-4">
            <span className="eyebrow">
              <CompassIcon size={13} />
              Module 1 of 3
            </span>
            <h1>Fundamental AI Concepts</h1>
            <p className="text-secondary" style={{ fontSize: "1.0625rem" }}>
              What AI actually is, how it learns, and where it already shows up in your day.
            </p>
          </header>
        </Reveal>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-faint">01</span>
            <span className="h-px flex-1 bg-line-strong" />
          </div>
          <h2>What is AI, really?</h2>
          <p>
            "Artificial intelligence" covers any system that performs tasks which normally require human
            judgment — recognizing an image, predicting the next word in a sentence, or recommending a
            song. That's a broad definition, and it's worth being precise: every AI system you'll interact
            with is <em>narrow</em>. It's built and trained to do a specific kind of task well. None of it
            is self-aware, has intentions, or "understands" the way a person does — it's pattern
            recognition and prediction, running at a scale that can look like understanding from the
            outside.
          </p>
          <p>
            You'll sometimes hear people talk about "AGI" — artificial general intelligence, a
            hypothetical system that could match human ability across any task, not just one. That's a
            useful concept for thinking about the future of the field, but it doesn't describe anything
            that exists today. Keeping "narrow" and "general" straight helps you evaluate claims you'll
            see in headlines: a chatbot writing a convincing essay is impressive narrow AI, not evidence
            of general intelligence.
          </p>
        </div>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-faint">02</span>
            <span className="h-px flex-1 bg-line-strong" />
          </div>
          <h2>How machines learn</h2>
          <p>
            Think about studying with flashcards. If you memorize the exact card order, you can recite
            answers perfectly — until the questions are asked in a different order, and you're lost. Real
            learning means recognizing the underlying pattern, not the exact card. Training an AI model
            works on a similar principle, at a much larger scale: it's shown enormous numbers of examples
            (its training data), and it gradually adjusts internal settings — its <em>parameters</em> —
            until it gets better at predicting the correct output for examples it hasn't seen. It never
            "reads" the way you do — it's finding statistical patterns in the data it's given.
          </p>
          <p>
            There are two separate phases worth telling apart. <strong>Training</strong> is the slow,
            expensive part — a model sees huge amounts of data over and over and gradually improves.{" "}
            <strong>Inference</strong> is what happens after: the trained model is handed a new input (your
            prompt) and generates an output using what it already learned. When you chat with an AI tool,
            you're only seeing inference — the training happened long before, on data that stops at some
            fixed point in time, which is part of why AI tools can be confidently out of date.
          </p>
        </div>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-faint">03</span>
            <span className="h-px flex-1 bg-line-strong" />
          </div>
          <h2>Types of AI you'll actually encounter</h2>
          <p>
            "AI" gets used as a catch-all term, but the systems behind it tend to fall into a few
            recognizable jobs:
          </p>
          <ul className="prose-list">
            <li>
              <strong>Generative</strong> — creates new content from a prompt: a chatbot writing text, a
              tool generating an image, code, or music. This is what most people picture when they hear
              "AI" today.
            </li>
            <li>
              <strong>Classification</strong> — sorts input into predefined categories: spam filters,
              content moderation, medical image screening that flags "needs review" vs. "likely normal."
            </li>
            <li>
              <strong>Recommendation</strong> — predicts what you're likely to want next, based on your
              past behavior and similar users': what a streaming or shopping app suggests to you.
            </li>
            <li>
              <strong>Computer vision</strong> — extracts information from images or video: face detection
              to auto-focus a camera, a self-checkout kiosk recognizing an item, sorting your photos by
              what's in them.
            </li>
          </ul>
          <p>
            These categories overlap in practice — a single app can use several — but naming which job a
            system is actually doing makes it much easier to reason about what it can and can't be
            trusted to get right.
          </p>
        </div>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-faint">04</span>
            <span className="h-px flex-1 bg-line-strong" />
          </div>
          <h2>AI in your pocket</h2>
          <p>
            AI is already running quietly behind tools you use daily: a streaming app predicting what
            you'll want to watch next, a map app estimating your arrival time from traffic patterns, your
            phone's keyboard finishing your sentence, or a camera app recognizing faces to sort your
            photos. None of these announce themselves as "AI" — they're just features. Part of AI
            literacy is noticing where it's already making decisions on your behalf.
          </p>
        </div>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-faint">05</span>
            <span className="h-px flex-1 bg-line-strong" />
          </div>
          <h2>A brief timeline</h2>
          <ol className="timeline">
            {TIMELINE.map((item) => (
              <li className="timeline-node" key={item.year}>
                <span className="font-mono text-[0.8125rem] font-semibold tracking-[0.06em] text-brand-soft">
                  {item.year}
                </span>
                <p className="mt-1 text-[0.875rem] leading-relaxed">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2>Key terms</h2>
            <span className="chip chip-azure">
              <BoltIcon size={11} />
              20 XP
            </span>
          </div>
          <VocabList terms={VOCAB} />
        </div>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2>Check your understanding</h2>
            <span className="chip chip-azure">
              <BoltIcon size={11} />
              100 XP
            </span>
          </div>
          <QuizBlock activityId="fundamentals-quiz" questions={QUIZ} />
        </div>

        <ModuleNav current="fundamentals" />
      </div>

      <aside className="no-print hidden xl:block">
        <div className="sticky top-24">
          <ModuleRail current="fundamentals" />
        </div>
      </aside>
      </div>
    </div>
  );
}