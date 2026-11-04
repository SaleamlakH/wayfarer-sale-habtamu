interface StarProps {
  className?: string;
}

export function Star({ className = "" }: StarProps) {
  return (
    <span
      aria-hidden="true"
      className={`text-(--stars) ${className}`}
    >
      ★
    </span>
  );
}
