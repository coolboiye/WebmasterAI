import type { ReactNode } from "react";

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col ${className}`}>
      <span className="mb-1.5 font-mono text-[0.75rem] tracking-[0.14em] text-faint uppercase">{label}</span>
      {children}
    </label>
  );
}
