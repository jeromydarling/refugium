interface AngelWingProps {
  className?: string;
  /** Size in pixels — controls both width and height */
  size?: number;
}

/**
 * Single angel wing icon — simple outline with decorative curl.
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
      <path
        d="M30 8
           C20 8, 10 16, 8 28
           C6 38, 10 48, 18 52
           C20 53, 22 52, 22 50
           C22 48, 20 46, 18 46
           C16 46, 15 48, 14 50
           C13 48, 12 44, 13 38
           C14 30, 20 22, 30 18
           C36 16, 44 20, 48 26
           C52 32, 52 38, 50 42
           C48 46, 42 48, 36 46
           C42 44, 48 40, 50 34
           C52 28, 48 18, 38 12
           C35 10, 32 8, 30 8Z"
        strokeWidth="3.5"
      />
    </svg>
  );
}
