import { Link } from "react-router";

interface BackToPlacesLinkProps {
  className?: string;
}

export function BackToPlacesLink({
  className = "",
}: BackToPlacesLinkProps) {
  return (
    <Link
      to="/"
      className={`inline-flex w-fit items-center gap-2 rounded-lg border border-(--border) bg-(--bg) px-4 py-2 text-sm font-medium text-(--ink) transition-colors hover:bg-(--ink)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="size-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m15 18-6-6 6-6"
        />
      </svg>
      Back to places
    </Link>
  );
}
