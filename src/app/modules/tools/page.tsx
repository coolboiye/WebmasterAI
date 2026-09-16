import { PromptLab } from "@/components/PromptLab";
import { GroqPlayground } from "@/components/GroqPlayground";
import { QuizBlock } from "@/components/QuizBlock";
import { ModuleNav } from "@/components/ModuleNav";

const TOOL_CATEGORIES = [
  {
    title: "Writing & brainstorming",
    text: "Good for generating outlines, rephrasing a paragraph, or getting unstuck on a first draft. Not a substitute for writing the final version yourself.",
  },
  {
    title: "Research & summarizing",
    text: "Good for condensing a long article into key points you can then verify. Not a substitute for checking the original source before citing a fact.",
  },
  {
    title: "Studying & practice",
    text: "Good for generating practice questions or flashcards on material you've already learned. Not a substitute for doing the practice yourself.",
  },
  {
    title: "Images & design",
    text: "Good for quick mockups, mood boards, or draft graphics. Check your school's and this competition's rules on AI-generated art before using it in a graded or judged submission.",
  },
  {
    title: "Coding assistance",
    text: "Good for suggesting a function or explaining an error message. Not a substitute for reading, testing, and understanding the code before you use it.",
  },
  {
    title: "Data & spreadsheets",
    text: "Good for suggesting a formula, spotting a pattern in a dataset, or drafting a first-pass chart. Always check the numbers it produces against the source data.",
  },
  {
    title: "Translation & accessibility",
    text: "Good for a rough translation or a first-pass image description for accessibility. For anything official or high-stakes, have a fluent speaker or an accessibility expert review it.",
  },
];

const QUIZ = [
  {
    id: "q1",
    prompt: "Which is the most responsible use of an AI writing tool for a school essay?",
    options: [
      { id: "a", text: "Have it write the whole essay and submit it as your own" },
      { id: "b", text: "Use it to brainstorm an outline, then write your own draft" },
      { id: "c", text: "Copy its output and change a few words so it looks different" },
      { id: "d", text: "Ask it to write the essay in your \"voice\" so it's harder to detect" },
    ],
    correctId: "b",
    explanation:
      "Using AI to get past a blank page is a reasonable study aid; submitting its output as your own finished work usually violates academic honesty policies.",
  },
  {
    id: "q2",
    prompt: "An AI tool gives you a list of sources to cite in a report. What should you do first?",
    options: [
      { id: "a", text: "Use them as-is — they're formatted correctly" },
      { id: "b", text: "Verify each source actually exists using a library database or search engine" },
      { id: "c", text: "Only check the ones that sound unfamiliar" },
      { id: "d", text: "Remove the citations and submit the report without sources" },
    ],
    correctId: "b",
    explanation:
      "AI tools can generate citations that look completely real but don't exist. Verify every one before it goes in your report.",
  },
  {
    id: "q3",
    prompt: "Why does a specific, detailed prompt usually get a more useful response than a vague one?",
    options: [
      { id: "a", text: "It doesn't — prompt wording has no effect on the response" },
      { id: "b", text: "It gives the model the context it needs to produce something relevant to your actual goal" },
      { id: "c", text: "Longer prompts are processed by a more powerful version of the model" },
      { id: "d", text: "Specific prompts remove the need to review the output" },
    ],
    correctId: "b",
    explanation:
      "A model responds to exactly what you give it. Naming your audience, format, and goal narrows down what a useful answer looks like.",
  },
  {
    id: "q4",
    prompt: "What's a responsible way to use an AI tool while studying for a test?",
    options: [
      { id: "a", text: "Ask it to complete your take-home test for you" },
      { id: "b", text: "Generate practice questions to quiz yourself on material you've already studied" },
      { id: "c", text: "Have it summarize the textbook so you never read it" },
      { id: "d", text: "Ask it what will be on the test" },
    ],
    correctId: "b",
    explanation:
      "Using AI to generate extra practice reinforces material you've studied. Having it do the actual assessment defeats the purpose of the test.",
  },
  {
    id: "q5",
    prompt: "An AI coding assistant suggests a block of code for your project. What should you always do?",
    options: [
      { id: "a", text: "Paste it in without reading it, since AI-generated code is always correct" },
      { id: "b", text: "Read and test it yourself before relying on it" },
      { id: "c", text: "Only test it if the project is being graded" },
      { id: "d", text: "Rewrite it from scratch instead, since AI code can never be trusted" },
    ],
    correctId: "b",
    explanation:
      "AI-suggested code can contain bugs, security issues, or code that simply doesn't do what you asked. Reading and testing it is a normal part of using it well.",
  },
  {
    id: "q6",
    prompt: "You ask an AI tool to translate a permission slip into a language you don't speak. What's the safest next step before sending it home?",
    options: [
      { id: "a", text: "Send it immediately — translation tools are always accurate" },
      { id: "b", text: "Have a fluent speaker check it, since a mistranslation in an official document can cause real confusion" },
      { id: "c", text: "Skip translating it at all, since it's extra effort" },
      { id: "d", text: "Translate it twice with two different tools and average the results" },
    ],
    correctId: "b",
    explanation:
      "Machine translation is a good first pass but can miss context, idioms, or tone — especially risky in an official document. A fluent-speaker review catches errors an AI tool won't flag itself.",
  },
  {
    id: "q7",
    prompt: "An AI tool suggests a spreadsheet formula that changes several of your numbers. What should you do?",
    options: [
      { id: "a", text: "Apply it and move on — the AI checked the math already" },
      { id: "b", text: "Spot-check a few of the resulting numbers by hand or against the source data" },
      { id: "c", text: "Only check it if the total looks obviously wrong" },
      { id: "d", text: "Undo it automatically without reading what it did" },
    ],
    correctId: "b",
    explanation:
      "A formula can look correct and still reference the wrong range or apply the wrong operation. Spot-checking a few results against the original data catches this before it spreads through your whole sheet.",
  },
  {
    id: "q8",
    prompt: "Why might two different AI tools give noticeably different answers to the exact same prompt?",
    options: [
      { id: "a", text: "One of them must be broken" },
      { id: "b", text: "Different models are trained on different data and tuned differently, so their outputs naturally differ" },
      { id: "c", text: "AI tools always give identical answers to the same prompt" },
      { id: "d", text: "Only the free version gives wrong answers" },
    ],
    correctId: "b",
    explanation:
      "Different models — even from the same company — are trained on different data and configured differently. That's exactly what the Live Prompt Playground below lets you observe directly, by comparing outputs yourself.",
  },
];

export default function ToolsPage() {
  return (
    <div className="page section">
      <div className="prose stack" style={{ gap: "var(--space-12)" }}>
        <div className="stack" style={{ gap: "var(--space-3)" }}>
          <p className="text-secondary mono" style={{ fontSize: "0.8125rem" }}>Module 2 of 3</p>
          <h1>Practical AI Tools & Techniques</h1>
          <p className="text-secondary" style={{ fontSize: "1.0625rem" }}>
            Matching the right tool to the task, and writing prompts that actually get you what you need.
          </p>
        </div>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <h2>Matching the tool to the task</h2>
          <ul className="stack" style={{ gap: "var(--space-4)", paddingLeft: "1.25rem" }}>
            {TOOL_CATEGORIES.map((cat) => (
              <li key={cat.title}>
                <p style={{ fontWeight: 500 }}>{cat.title}</p>
                <p className="text-secondary">{cat.text}</p>
              </li>
            ))}
          </ul>
          <p className="text-secondary" style={{ fontSize: "0.9375rem" }}>
            Check with a teacher or your school's acceptable-use policy before using any AI tool on graded
            work — policies vary by class and by assignment.
          </p>
        </div>

        <div className="stack" style={{ gap: "var(--space-3)" }}>
          <h2>Writing a prompt that works</h2>
          <p>
            A prompt is the instruction you give an AI tool, and the quality of what you get back depends
            almost entirely on it. A vague prompt gets a generic answer. A prompt that states your
            audience, your format, and exactly what you're trying to accomplish gets something you can
            actually use. A useful mental checklist before you hit enter:
          </p>
          <ul className="stack" style={{ gap: "var(--space-2)", paddingLeft: "1.25rem" }}>
            <li><strong>Audience</strong> — who is this for? A 9th grader, a teacher, yourself?</li>
            <li><strong>Format</strong> — a paragraph, a bulleted list, a specific word count?</li>
            <li><strong>Goal</strong> — what should the output let you do next?</li>
            <li><strong>Constraints</strong> — anything it should avoid, or a tone to match?</li>
          </ul>
          <p>
            Try it below: rewrite each weak prompt using that checklist, then compare it with a stronger
            version.
          </p>
        </div>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h2>Prompt Lab</h2>
            <span className="mono text-secondary" style={{ fontSize: "0.8125rem" }}>30 XP</span>
          </div>
          <PromptLab />
        </div>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h2>Live Prompt Playground</h2>
            <span className="mono text-secondary" style={{ fontSize: "0.8125rem" }}>40 XP</span>
          </div>
          <p>
            The exercise above compares prompts we picked. Here, you run your own two versions of a
            prompt against a real AI model — for free, using{" "}
            <a href="https://groq.com" target="_blank" rel="noreferrer">
              Groq
            </a>
            &rsquo;s free API tier — and see the actual difference in the response, side by side. Try
            keeping the model fixed and changing only the wording, length request, or the level of
            detail you ask for, and notice how much the output shifts.
          </p>
          <GroqPlayground />
        </div>

        <div className="stack" style={{ gap: "var(--space-3)" }}>
          <h2>Fact-check before you use it</h2>
          <p>
            As covered in Module 1, AI tools can generate fluent, confident, and wrong output — a
            hallucination. Before using anything an AI tool gives you for schoolwork, check names, dates,
            statistics, and sources against something you trust: a textbook, a library database, or a
            teacher. Treat the output as a first draft, not a finished, fact-checked answer.
          </p>
        </div>

        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h2>Check your understanding</h2>
            <span className="mono text-secondary" style={{ fontSize: "0.8125rem" }}>100 XP</span>
          </div>
          <QuizBlock activityId="tools-quiz" questions={QUIZ} />
        </div>

        <ModuleNav current="tools" />
      </div>
    </div>
  );
}