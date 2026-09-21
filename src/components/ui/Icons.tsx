import type { SVGProps } from "react";

// Hand-rolled stroke icons on a 24px grid. Kept local (instead of pulling in an
// icon package) because the site ships a small, fixed set — this keeps the
// bundle honest and every glyph visually consistent: 1.75 stroke, round caps.

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 20, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const SparkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
    <path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
  </Icon>
);

export const CompassIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.6 8.4l-1.9 5.3-5.3 1.9 1.9-5.3z" />
  </Icon>
);

export const LayersIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3l8.5 4.6L12 12.2 3.5 7.6z" />
    <path d="M3.5 12.4L12 17l8.5-4.6" />
    <path d="M3.5 16.8L12 21.4l8.5-4.6" />
  </Icon>
);

export const ScaleIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4v16" />
    <path d="M7 20h10" />
    <path d="M5 8h14" />
    <path d="M5 8l-2.5 5.5a3 3 0 006 0z" />
    <path d="M19 8l2.5 5.5a3 3 0 01-6 0z" />
  </Icon>
);

export const TrophyIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 4h10v5a5 5 0 01-10 0z" />
    <path d="M7 5H4.5v1.5A3.5 3.5 0 008 10" />
    <path d="M17 5h2.5v1.5A3.5 3.5 0 0116 10" />
    <path d="M12 14v3.5" />
    <path d="M8.5 20.5h7" />
    <path d="M10 17.5h4l.5 3h-5z" />
  </Icon>
);

export const GaugeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 18a9 9 0 1117 0" />
    <path d="M12 14l4-4.5" />
    <circle cx="12" cy="15" r="1.4" />
  </Icon>
);

export const ListIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 6h11" />
    <path d="M9 12h11" />
    <path d="M9 18h11" />
    <path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
  </Icon>
);

export const ShieldIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3l7 3v5.5c0 4.3-2.9 8-7 9.5-4.1-1.5-7-5.2-7-9.5V6z" />
    <path d="M9.2 12.2l2 2 3.6-4" />
  </Icon>
);

export const SunIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" />
  </Icon>
);

export const MoonIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19.5 15.2A7.8 7.8 0 018.8 4.5 8.5 8.5 0 1019.5 15.2z" />
  </Icon>
);

export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </Icon>
);

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </Icon>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12h15" />
    <path d="M13 6l6 6-6 6" />
  </Icon>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 12H5" />
    <path d="M11 6l-6 6 6 6" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </Icon>
);

export const PlayIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 5.5l10 6.5-10 6.5z" />
  </Icon>
);

export const BoltIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13.5 3L5 13.5h5.5L10 21l8.5-10.5H13z" />
  </Icon>
);

export const AlertIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4.5l8.5 15h-17z" />
    <path d="M12 10v4" />
    <path d="M12 17h.01" />
  </Icon>
);

export const LockIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.2" />
    <path d="M8 10.5V8a4 4 0 018 0v2.5" />
  </Icon>
);

export const AwardIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="9.5" r="5.5" />
    <path d="M8.5 14.2L7 21l5-2.4L17 21l-1.5-6.8" />
  </Icon>
);

export const PrinterIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 9V4h10v5" />
    <path d="M6 9h12a2 2 0 012 2v5h-4v4H8v-4H4v-5a2 2 0 012-2z" />
    <path d="M8 16h8" />
  </Icon>
);

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Icon>
);

export const TrashIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h16" />
    <path d="M9.5 7V5h5v2" />
    <path d="M6.5 7l.8 12.2A1.8 1.8 0 009 21h6a1.8 1.8 0 001.7-1.8L17.5 7" />
    <path d="M10.5 11v6M13.5 11v6" />
  </Icon>
);

export const UserIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20a7 7 0 0114 0" />
  </Icon>
);

export const LogOutIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M15 4h2.5A2.5 2.5 0 0120 6.5v11a2.5 2.5 0 01-2.5 2.5H15" />
    <path d="M11 8l-4 4 4 4" />
    <path d="M7 12h9" />
  </Icon>
);

export const TerminalIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="4.5" width="18" height="15" rx="2.4" />
    <path d="M7.5 10l2.5 2.5L7.5 15" />
    <path d="M13 15h4" />
  </Icon>
);

export const ClockIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);

export const SpinnerIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.5a8.5 8.5 0 108.5 8.5" />
  </Icon>
);

export const TargetIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" />
  </Icon>
);

/** Google's mark, which is multicolour by design — the one icon that is filled. */
export const GoogleIcon = ({ size = 16, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" {...props}>
    <path
      fill="#4285F4"
      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 01-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0012 24z"
    />
    <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 010-4.6V6.7H1.4a12 12 0 000 10.7z" />
    <path
      fill="#EA4335"
      d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 001.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"
    />
  </svg>
);
