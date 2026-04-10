interface DecorativeDotsProps {
  className?: string;
}

export function DecorativeDots({ className }: DecorativeDotsProps) {
  return (
    <svg
      className={className}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 5 }).map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={12 + col * 24}
            cy={12 + row * 24}
            r="4"
            className="fill-primary/15"
          />
        )),
      )}
    </svg>
  );
}
