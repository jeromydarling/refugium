interface WavesDividerProps {
  className?: string;
  flip?: boolean;
}

export function WavesDivider({ className, flip }: WavesDividerProps) {
  return (
    <svg
      className={`${className ?? ''} ${flip ? 'rotate-180' : ''}`}
      viewBox="0 0 1440 60"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 30C240 0 480 60 720 30C960 0 1200 60 1440 30V60H0V30Z"
        className="fill-primary/5"
      />
    </svg>
  );
}
