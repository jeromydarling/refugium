interface AngelWingProps {
  className?: string;
  /** Size in pixels — controls both width and height */
  size?: number;
}

/**
 * A single angel wing SVG — outstretched, elegant, hand-drawn feel.
 * Designed to sit beside the "Refugium" wordmark.
 */
export function AngelWing({ className = '', size = 24 }: AngelWingProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Main wing silhouette — a single swept shape */}
      <path
        d="M56 30
           C54 24, 48 14, 38 10
           C32 8, 26 10, 22 14
           C18 18, 14 24, 12 30
           C10 36, 10 42, 12 46
           C14 50, 20 52, 28 50
           C34 48, 42 44, 48 38
           C52 34, 56 32, 56 30Z"
        strokeWidth="1.8"
        fill="currentColor"
        fillOpacity="0.08"
      />

      {/* Primary flight feathers — long, sweeping */}
      <path d="M12 46 C8 40, 6 30, 10 20 C12 16, 16 12, 22 10" strokeWidth="1.2" />
      <path d="M16 48 C10 42, 8 32, 12 22 C14 18, 18 14, 26 12" strokeWidth="1.2" />
      <path d="M22 49 C14 44, 12 34, 16 24 C18 20, 22 16, 30 13" strokeWidth="1.2" />

      {/* Secondary feathers — mid-wing */}
      <path d="M28 50 C20 46, 18 38, 22 28 C24 24, 28 20, 34 16" strokeWidth="1" />
      <path d="M34 48 C28 44, 26 38, 28 30 C30 26, 34 22, 38 18" strokeWidth="1" />

      {/* Coverts — short upper feather rows */}
      <path d="M40 44 C36 40, 34 34, 36 28 C38 24, 42 20, 46 18" strokeWidth="0.8" />
      <path d="M46 40 C44 36, 42 32, 44 26 C46 22, 48 20, 52 20" strokeWidth="0.8" />

      {/* Wing shoulder — the leading edge curve */}
      <path
        d="M56 30 C56 26, 52 20, 46 16 C42 14, 38 12, 34 12"
        strokeWidth="1.6"
      />

      {/* Alula — the small feather tuft at the wrist */}
      <path d="M48 22 C50 20, 52 18, 52 16" strokeWidth="0.8" />
      <path d="M46 24 C48 22, 50 20, 50 17" strokeWidth="0.8" />
    </svg>
  );
}
