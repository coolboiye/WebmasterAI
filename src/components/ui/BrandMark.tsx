export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-[2.125rem] shrink-0 place-items-center rounded-[4px] bg-brand text-[0.8125rem] font-bold leading-none tracking-[-0.08em] text-on-brand ${className}`}
    >
      AI
    </span>
  );
}
