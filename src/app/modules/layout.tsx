import { ReadingProgress } from "@/components/ui/ReadingProgress";

/**
 * Shared chrome for the three module reading pages. The progress bar lives here
 * so every module gets it without repeating the markup.
 */
export default function ModulesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ReadingProgress />
      {children}
    </>
  );
}
